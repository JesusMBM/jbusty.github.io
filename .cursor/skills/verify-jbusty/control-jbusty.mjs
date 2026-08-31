import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PRODUCTION_URL = "https://jesusmbm.github.io/jbusty.github.io/";
const DEFAULT_CHROME = "/usr/bin/google-chrome";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = "4173";
const BASE_PATH = "/jbusty.github.io/";
const EVIDENCE_DIR = process.env.JBUSTY_EVIDENCE_DIR || "/tmp/jbusty-verify-evidence-proof";
const PID_FILE = process.env.JBUSTY_PID_FILE || "/tmp/jbusty-verify-local.pid";
const STATE_FILE = process.env.JBUSTY_STATE_FILE || "/tmp/jbusty-verify-local.json";
const CHROME_TIMEOUT_MS = Number(process.env.JBUSTY_CHROME_TIMEOUT_MS || 25000);
const VIRTUAL_TIME_MS = Number(process.env.JBUSTY_VIRTUAL_TIME_MS || 8000);

const HASHES = {
  top: "#top",
  work: "#work",
  about: "#about",
  contact: "#contact",
  "main-content": "#main-content",
  home: "#top",
  hero: "#top",
};

function envMode() {
  return String(process.env.JBUSTY_MODE || "live").toLowerCase();
}

function envUrl() {
  if (process.env.JBUSTY_URL) return withSlash(process.env.JBUSTY_URL);
  if (envMode() === "local") return "http://" + DEFAULT_HOST + ":" + DEFAULT_PORT + BASE_PATH;
  return PRODUCTION_URL;
}

function withSlash(url) {
  const u = String(url).trim();
  if (!u) return PRODUCTION_URL;
  if (u.includes("#")) return u;
  return u.endsWith("/") ? u : u + "/";
}

function chromePath() {
  return process.env.JBUSTY_CHROME || DEFAULT_CHROME;
}

function isProductionUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname === "jesusmbm.github.io" || u.hostname.endsWith(".github.io");
  } catch {
    return false;
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(obj) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

function fail(exitCode, message, instead, extra) {
  extra = extra || {};
  process.stderr.write(message + "\n");
  if (instead) process.stderr.write("Instead: " + instead + "\n");
  writeJson(Object.assign({ ok: false, error: message, instead: instead || null }, extra));
  process.exit(exitCode);
}

function ok(obj) {
  writeJson(Object.assign({ ok: true }, obj));
}

function helpText() {
  return [
    "control-jbusty - drive the jbusty.github.io portfolio for verification",
    "",
    "Usage:",
    "  node control-jbusty.mjs [--json] [--dry-run] [--help] <command> [args]",
    "",
    "Commands:",
    "  doctor              Read-only health check (HTTP 200, title, live DOM)",
    "  info                Print mode, URL, chrome, pid file",
    "  snapshot            Dump rendered DOM landmarks as JSON",
    "  screenshot PATH     Capture a 1280x800 PNG of the current URL",
    "  goto HASH           Open #top|#work|#about|#contact|#main-content and screenshot",
    "  click SELECTOR      Click a selector (REFUSED on live production)",
    "  launch              Start local vite preview on 127.0.0.1:4173 (pid file)",
    "  stop                Kill ONLY the pid recorded by launch",
    "  wait-settle         Wait for the SPA to render (virtual-time-budget)",
    "",
    "Flags:",
    "  --help              Show this help",
    "  --json              JSON on stdout (default)",
    "  --dry-run           Print click/launch/stop without doing them",
    "",
    "Env:",
    "  JBUSTY_MODE=live (default) | local",
    "  JBUSTY_URL=" + PRODUCTION_URL,
    "  JBUSTY_CHROME=" + DEFAULT_CHROME,
    "  JBUSTY_PID_FILE=" + PID_FILE,
    "  JBUSTY_EVIDENCE_DIR=" + EVIDENCE_DIR,
    "  JBUSTY_ROOT checkout root for launch",
    "",
    "Default target is LIVE GitHub Pages. click is refused there.",
    "Evidence screenshots are copied to JBUSTY_EVIDENCE_DIR so they survive chrome profile cleanup.",
    "",
  ].join("\n");
}

function parseArgs(argv) {
  const flags = { json: true, dryRun: false, help: false };
  const rest = [];
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") flags.help = true;
    else if (arg === "--json") flags.json = true;
    else if (arg === "--no-json") flags.json = false;
    else if (arg === "--dry-run") flags.dryRun = true;
    else if (arg.startsWith("--")) fail(2, "Unknown flag " + arg, "Run --help for supported flags and commands.");
    else rest.push(arg);
  }
  return { flags: flags, command: rest[0] || (flags.help ? "help" : null), args: rest.slice(1) };
}

function persistFile(src, extraName) {
  ensureDir(EVIDENCE_DIR);
  if (!src || !fs.existsSync(src)) return null;
  const dest = path.join(EVIDENCE_DIR, extraName || path.basename(src));
  fs.copyFileSync(src, dest);
  const fd = fs.openSync(dest, "r+");
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  return dest;
}

function runChrome(chromeArgs) {
  const timeoutMs = CHROME_TIMEOUT_MS;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "jbusty-chrome-"));
  const chrome = chromePath();
  if (!fs.existsSync(chrome)) {
    fs.rmSync(profile, { recursive: true, force: true });
    fail(1, "Chrome not found at " + chrome, "Set JBUSTY_CHROME to the google-chrome binary.");
  }
  const args = [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--user-data-dir=" + profile,
    "--virtual-time-budget=" + VIRTUAL_TIME_MS,
    "--hide-scrollbars",
    "--window-size=1280,800",
  ].concat(chromeArgs);
  const result = spawnSync(chrome, args, {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    timeout: timeoutMs,
  });
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  return result;
}

function dumpDom(url) {
  const result = runChrome(["--dump-dom", url]);
  if (result.error && result.error.code === "ETIMEDOUT") {
    fail(1, "Chrome dump-dom timed out after " + CHROME_TIMEOUT_MS + "ms", "Retry doctor; chrome must use an isolated --user-data-dir (this CLI does).");
  }
  if (result.status !== 0 && !result.stdout) {
    fail(1, "Chrome dump-dom exited " + result.status + ": " + String(result.stderr || result.error || "").slice(0, 400), "Check JBUSTY_URL is reachable and JBUSTY_CHROME works.");
  }
  return result.stdout || "";
}

async function httpStatus(url) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    return { status: res.status, ok: res.ok, finalUrl: res.url };
  } catch (err) {
    return { status: 0, ok: false, error: String(err) };
  }
}

function titleOf(dom) {
  const m = String(dom).match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function normalizeHash(raw) {
  if (!raw) return null;
  let h = String(raw).trim();
  if (h.startsWith("#")) h = h.slice(1);
  h = h.replace(/^\/+/, "");
  const mapped = HASHES[h.toLowerCase()] || HASHES[h];
  if (mapped) return mapped;
  if (/^[a-z0-9-]+$/i.test(h)) return "#" + h;
  return null;
}

function urlWithHash(base, hash) {
  const u = new URL(base);
  u.hash = hash.startsWith("#") ? hash : "#" + hash;
  return u.toString();
}

function takeScreenshot(url, destPath) {
  const abs = path.resolve(destPath);
  ensureDir(path.dirname(abs));
  const result = runChrome(["--screenshot=" + abs, "--window-size=1280,800", url]);
  if (result.error && result.error.code === "ETIMEDOUT") {
    fail(1, "Chrome screenshot timed out after " + CHROME_TIMEOUT_MS + "ms", "Retry screenshot; evidence dir is outside the chrome profile.");
  }
  if (!fs.existsSync(abs) || fs.statSync(abs).size < 100) {
    fail(1, "Screenshot missing or empty at " + abs + " (chrome status " + result.status + ")", "Pass an absolute PATH outside the chrome profile. Proof files must survive chrome child cleanup.", { stderr: String(result.stderr || "").slice(0, 400) });
  }
  const fd = fs.openSync(abs, "r+");
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  const evidence = persistFile(abs, path.basename(abs));
  return { path: abs, bytes: fs.statSync(abs).size, evidence: evidence };
}

function findRepoRoot() {
  if (process.env.JBUSTY_ROOT && fs.existsSync(path.join(process.env.JBUSTY_ROOT, "package.json"))) {
    return process.env.JBUSTY_ROOT;
  }
  let dir = process.cwd();
  for (let i = 0; i < 12; i += 1) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        if (pkg.name === "jbusty-portfolio" || fs.existsSync(path.join(dir, "vite.config.js"))) return dir;
      } catch (e) {}
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function readPid() {
  if (!fs.existsSync(PID_FILE)) return null;
  const pid = Number(fs.readFileSync(PID_FILE, "utf8").trim());
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}

function pidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

function cmdHelp() {
  process.stdout.write(helpText());
}

async function cmdDoctor() {
  const url = envUrl();
  const mode = envMode();
  const http = await httpStatus(url);
  const checks = {
    http200: http.status === 200,
    title: false,
    signal: false,
    workCard: false,
    navWork: false,
    navAbout: false,
    navContact: false,
  };
  let title = "";
  let dom = "";
  if (checks.http200) {
    dom = dumpDom(url);
    title = titleOf(dom);
    checks.title = title.includes("Jesus Bustillos-Molina");
    checks.signal = dom.includes("I find the signal");
    checks.workCard = dom.includes("AI Agent Architecture");
    checks.navWork = /\bWork\b/.test(dom);
    checks.navAbout = /\bAbout\b/.test(dom);
    checks.navContact = /\bContact\b/.test(dom);
  }
  const passed = Object.values(checks).every(Boolean);
  const payload = { command: "doctor", mode: mode, url: url, httpStatus: http.status, title: title, checks: checks, chrome: chromePath() };
  if (!passed) {
    const missing = Object.entries(checks).filter(function (kv) { return !kv[1]; }).map(function (kv) { return kv[0]; });
    fail(1, "doctor failed: " + missing.join(", "), "Fix JBUSTY_URL / wait for Pages, then rerun `node control-jbusty.mjs doctor`. Do not edit src/ product code from this skill.", payload);
  }
  ok(payload);
}

function cmdInfo() {
  const pid = readPid();
  ok({
    command: "info",
    mode: envMode(),
    url: envUrl(),
    productionUrl: PRODUCTION_URL,
    localPreviewUrl: "http://" + DEFAULT_HOST + ":" + DEFAULT_PORT + BASE_PATH,
    chrome: chromePath(),
    pidFile: PID_FILE,
    pid: pid,
    pidAlive: pidAlive(pid),
    evidenceDir: EVIDENCE_DIR,
    clickAllowed: !(envMode() === "live" || isProductionUrl(envUrl())),
  });
}

function cmdSnapshot() {
  const url = envUrl();
  const dom = dumpDom(url);
  const title = titleOf(dom);
  const names = [
    "AI Agent Architecture",
    "AI Agents Escaping Sandboxes",
    "Open, But How Open?",
    "The Hidden Cost of AI Agents",
    "Secure SDLC: STRIDE, PASTA & SSDF",
    "Hacking a Satellite—Safely Explained",
  ];
  const projects = names.map(function (name, i) {
    return { number: String(i + 1).padStart(2, "0"), title: name, present: dom.includes(name) || dom.includes(name.replace(/&/g, '&amp;')) };
  });
  ok({
    command: "snapshot",
    url: url,
    title: title,
    landmarks: {
      skipLink: /class="skip-link"/.test(dom) && /href="#main-content"/.test(dom),
      brand: /class="brand"/.test(dom) && /Jesus Bustillos-Molina, home/.test(dom),
      menuToggle: /class="menu-toggle"/.test(dom) && /aria-controls="nav-links"/.test(dom),
      nav: /id="nav-links"/.test(dom),
      hero: /id="top"/.test(dom) && /I find the signal/.test(dom),
      work: /id="work"/.test(dom),
      about: /id="about"/.test(dom) && /Curious by nature/.test(dom),
      contact: /id="contact"/.test(dom),
    },
    navLabels: { Work: /\bWork\b/.test(dom), About: /\bAbout\b/.test(dom), Contact: /\bContact\b/.test(dom) },
    projects: projects,
    hashes: ["#top", "#work", "#about", "#contact", "#main-content"],
  });
}

function cmdScreenshot(dest) {
  if (!dest) fail(2, "screenshot requires PATH", "Example: node control-jbusty.mjs screenshot /tmp/jbusty-verify-evidence-proof/home.png");
  const shot = takeScreenshot(envUrl(), dest);
  ok(Object.assign({ command: "screenshot", url: envUrl() }, shot));
}

function cmdGoto(rawHash) {
  if (!rawHash) fail(2, "goto requires HASH", "Use: node control-jbusty.mjs goto work   (or #work, about, contact, top)");
  const hash = normalizeHash(rawHash);
  if (!hash) fail(2, "Unrecognized hash " + rawHash, "Use top, work, about, contact, or main-content (with or without #).");
  const url = urlWithHash(envUrl(), hash);
  const dom = dumpDom(url);
  const id = hash.slice(1);
  const present = new RegExp('id="' + id + '"').test(dom) || hash === "#main-content";
  ensureDir(EVIDENCE_DIR);
  const shot = takeScreenshot(url, path.join(EVIDENCE_DIR, id + ".png"));
  ok({ command: "goto", hash: hash, url: url, sectionPresent: present, title: titleOf(dom), screenshot: shot });
}

function cmdClick(selector, dryRun) {
  if (!selector) fail(2, "click requires SELECTOR", "Example: node control-jbusty.mjs click 'button.menu-toggle' --dry-run");
  const url = envUrl();
  const mode = envMode();
  if (mode === "live" || isProductionUrl(url)) {
    fail(2, "click is refused on live production (" + url + ")", "Use `goto HASH` for in-page navigation, `snapshot`/`screenshot` for read-only proof, or `launch` a local preview (JBUSTY_MODE=local) and click there. Never click the GitHub Pages site.", { command: "click", selector: selector, url: url, mode: mode });
  }
  if (dryRun) {
    ok({ command: "click", dryRun: true, selector: selector, url: url, would: "click " + selector + " on local preview (not executed)" });
    return;
  }
  fail(2, "Live click is refused; local click has no persistent headless session in this CLI", "Use --dry-run to record the intended selector, or `goto HASH` to follow nav links. Launch a local preview first (JBUSTY_MODE=local).", { command: "click", selector: selector, url: url, mode: mode });
}

function cmdWaitSettle() {
  const url = envUrl();
  const started = Date.now();
  const dom = dumpDom(url);
  ok({ command: "wait-settle", url: url, ms: Date.now() - started, virtualTimeBudgetMs: VIRTUAL_TIME_MS, rendered: /I find the signal/.test(dom) });
}

function cmdLaunch(dryRun) {
  const previewUrl = "http://127.0.0.1:4173/jbusty.github.io/";
  const root = findRepoRoot();
  const would = { cwd: root, cmd: "vite preview --host 127.0.0.1 --port 4173 --strictPort", pidFile: PID_FILE, url: previewUrl };
  if (dryRun) {
    ok({ command: "launch", dryRun: true, would: would });
    return;
  }
  if (!root) {
    fail(1, "Cannot launch: jbusty-portfolio checkout not found", "Run from a local clone of JesusMBM/jbusty.github.io (do not clone just to doctor live Pages). Set JBUSTY_ROOT, or keep JBUSTY_MODE=live (default) and use doctor/snapshot/screenshot against GitHub Pages.");
  }
  const pid = startLocalPreview(path.join(root, "node_modules", ".bin", "vite"), root, "/tmp/jbusty-verify-local.log"); writeLaunchPid(pid, previewUrl, root, "/tmp/jbusty-verify-local.log");
}

function startLocalPreview(viteBin, root, logFile) {
  const logFd = fs.openSync(logFile, "a");
  const child = spawn(viteBin, ["preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], {
    cwd: root,
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: process.env,
  });
  fs.closeSync(logFd);
  child.unref();
  return child.pid;
}

function writeLaunchPid(pid, previewUrl, root, logFile) {
  ensureDir(path.dirname(PID_FILE));
  fs.writeFileSync(PID_FILE, String(pid) + "\n");
  fs.writeFileSync(STATE_FILE, JSON.stringify({ pid: pid, url: previewUrl, cwd: root, startedAt: new Date().toISOString() }, null, 2));
  ok({ command: "launch", pid: pid, pidFile: PID_FILE, url: previewUrl, logFile: logFile });
}

function cmdStop(dryRun) {
  const pid = readPid();
  if (dryRun) {
    ok({ command: "stop", dryRun: true, would: pid ? "signal recorded pid " + pid + " (pid file only)" : "no pid file; nothing to stop" });
    return;
  }
  if (!pid) {
    fail(1, "No pid file at " + PID_FILE, "Nothing to stop. launch writes this pid file; stop never matches by process name.");
  }
  if (!pidAlive(pid)) {
    fs.rmSync(PID_FILE, { force: true });
    ok({ command: "stop", pid: pid, killed: false, note: "pid already dead; pid file removed" });
    return;
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch (err) {
    fail(1, "Failed to signal pid " + pid + ": " + err, "stop only signals the recorded pid.");
  }
  fs.rmSync(PID_FILE, { force: true });
  ok({ command: "stop", pid: pid, killed: true });
}

const parsed = parseArgs(process.argv.slice(2));
const flags = parsed.flags;
const command = parsed.command;
const args = parsed.args;
if (flags.help || command === "help" || command === "--help") {
  cmdHelp();
  process.exit(0);
}
if (!command) fail(2, "Missing command", "Run node control-jbusty.mjs --help");

const commands = {
  doctor: function () { return cmdDoctor(); },
  info: function () { return cmdInfo(); },
  snapshot: function () { return cmdSnapshot(); },
  screenshot: function () { return cmdScreenshot(args[0]); },
  goto: function () { return cmdGoto(args[0]); },
  click: function () { return cmdClick(args[0], flags.dryRun); },
  launch: function () { return cmdLaunch(flags.dryRun); },
  stop: function () { return cmdStop(flags.dryRun); },
  "wait-settle": function () { return cmdWaitSettle(); },
};

if (!commands[command]) {
  fail(2, "Unknown command " + command, "Run node control-jbusty.mjs --help");
}

Promise.resolve(commands[command]()).catch(function (err) {
  fail(1, err && err.message ? err.message : String(err), "Rerun doctor. Do not edit src/ product code.");
});
