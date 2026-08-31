#!/usr/bin/env node
import { spawn } from "node:child_process"
import { createConnection } from "node:net"
import { Buffer } from "node:buffer"
import crypto from "node:crypto"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LIVE_URL = "https://jesusmbm.github.io/jbusty.github.io/"
const LOCAL_HOST = "127.0.0.1"
const LOCAL_PORT = 4173
const LOCAL_BASE = "/jbusty.github.io/"
const CHROME_DEFAULT = "/usr/bin/google-chrome"
const H1_TEXT = "I find the signal"
const TITLE_NEEDLE = "Jesus Bustillos-Molina"
const WORK_CARD = "AI Agent Architecture"
const PACKAGE_NAME = "jbusty-portfolio"
const HELP = `control-jbusty — drive Jesus Bustillos-Molina portfolio the way a visitor does.

USAGE
  control-jbusty.mjs [global flags] <command> [args]

GLOBAL FLAGS
  --help, -h          Show this help (or command help)
  --dry-run           Print side-effecting action without doing it (click, eval, launch, stop)
  --url <url>         Override target URL (else JBUSTY_URL, else mode default)
  --mode <live|local> Override mode (else JBUSTY_MODE, else live)

ENV
  JBUSTY_URL          Target URL. Default live Pages; local http://127.0.0.1:4173/jbusty.github.io/
  JBUSTY_MODE         live | local (default live)
  JBUSTY_RUN_ID       Run id for pid + evidence dirs (default: proof)
  JBUSTY_ROOT         Project root with package.json (launch only)
  CHROME_PATH         Chrome binary (default /usr/bin/google-chrome)

COMMANDS
  info                Print url, mode, chrome path, skill dir (JSON)
  doctor              GET + render. Require HTTP 200, title, hero, work card, nav
  snapshot            dump-dom; headings, links, aria-labels, landmarks
  screenshot <PATH>   Write PNG; JSON {path, bytes}
  goto <HASH> [PATH]  Navigate to url+hash and screenshot (#work #about #contact #top)
  click <SELECTOR>    Click in a LOCAL instance this CLI launched. Refuses live.
  eval <JS>           Evaluate JS in a LOCAL instance. Refuses live.
  launch              Start local Vite on 127.0.0.1:4173; write pid file
  stop                Kill ONLY the pid this CLI started
  wait-settle         Retry dump-dom/doctor until hero h1 is in the DOM

DEFAULT TARGET is LIVE GitHub Pages (recruiters). Use launch/local only for an unreleased branch.
JSON on stdout. Human errors on stderr. Exit non-zero and say what to do instead.
Never kill chrome or node by process name. Evidence: /tmp/jbusty-verify-evidence-\$RUN_ID/

EXAMPLES
  node control-jbusty.mjs --help
  node control-jbusty.mjs doctor
  node control-jbusty.mjs snapshot
  node control-jbusty.mjs screenshot /tmp/jbusty-verify-evidence-proof/home.png
  node control-jbusty.mjs goto #work /tmp/jbusty-verify-evidence-proof/work.png
  node control-jbusty.mjs --dry-run click .menu-toggle
`;
const COMMAND_HELP = {
  info: "info: print url, mode, chrome, skillDir, runId, pidFile, evidenceDir\n",
  doctor: "doctor: GET+render. Require HTTP 200, title, hero h1, work card, nav Work/About/Contact. JSON: url, mode, httpStatus, title, checks[], ok\n",
  snapshot: "snapshot [--out PATH]: dump-dom headings, links, aria-labels, landmarks\n",
  screenshot: "screenshot PATH: write png; JSON {path, bytes}\n",
  goto: "goto HASH [PATH]: screenshot after url+hash (#work #about #contact #top)\n",
  click: "click SELECTOR: LOCAL only, refuses live. --dry-run prints without doing it.\n",
  eval: "eval JS: LOCAL only, refuses live. --dry-run supported.\n",
  launch: "launch: start local Vite on 127.0.0.1 port 4173. Writes pid file. --dry-run supported.\n",
  stop: "stop: kill ONLY the recorded pid. Never pkill by name. --dry-run supported.\n",
  "wait-settle": "wait-settle: retry doctor until dump-dom contains the h1 text\n",
}
function emit(obj) { process.stdout.write(JSON.stringify(obj, null, 2) + "\n") }
function fail(message, extra = {}, hint) {
  const err = { ok: false, error: message, ...extra }
  if (hint) err.hint = hint
  emit(err)
  process.stderr.write(message + (hint ? "\n" + hint : "") + "\n")
  process.exitCode = 1
  return err
}
function die(message, extra, hint) { fail(message, extra, hint); process.exit(1) }
function runId() { return process.env.JBUSTY_RUN_ID || process.env.RUN_ID || "proof" }
function chromeBin() { return process.env.CHROME_PATH || CHROME_DEFAULT }
function pidFilePath() { return "/tmp/jbusty-verify-" + runId() }
function evidenceDir() { return "/tmp/jbusty-verify-evidence-" + runId() }
function localUrl(port = LOCAL_PORT) { return "http://" + LOCAL_HOST + ":" + port + LOCAL_BASE }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }
function parseArgs(argv) {
  const out = { dryRun: false, help: false, url: process.env.JBUSTY_URL || null, mode: (process.env.JBUSTY_MODE || "live").toLowerCase(), command: null, rest: [], out: null }
  const args = [...argv]
  while (args.length) {
    const a = args.shift()
    if (a === "--help" || a === "-h") out.help = true
    else if (a === "--dry-run") out.dryRun = true
    else if (a === "--url") out.url = args.shift()
    else if (a === "--mode") out.mode = String(args.shift() || "").toLowerCase()
    else if (a === "--out") out.out = args.shift()
    else if (a.startsWith("--url=")) out.url = a.slice(6)
    else if (a.startsWith("--mode=")) out.mode = a.slice(7).toLowerCase()
    else if (a.startsWith("--out=")) out.out = a.slice(6)
    else if (!out.command && !a.startsWith("-")) out.command = a
    else out.rest.push(a)
  }
  if (out.mode !== "live" && out.mode !== "local") die("Unknown mode. Use live or local.", { mode: out.mode }, "Set --mode live (default) or --mode local after launch.")
  return out
}
function resolveTarget(opts) {
  const mode = opts.mode
  const url = (opts.url || (mode === "local" ? localUrl() : LIVE_URL)).replace(/\/?$/, "/")
  return { mode, url }
}
function isProdUrl(url) {
  try { return /(^|\.)jesusmbm\.github\.io$/i.test(new URL(url).hostname) }
  catch { return /jesusmbm\.github\.io/i.test(String(url)) }
}
function ensureEvidenceDir() { const d = evidenceDir(); fs.mkdirSync(d, { recursive: true }); return d }
function findProjectRoot() {
  if (process.env.JBUSTY_ROOT) return path.resolve(process.env.JBUSTY_ROOT)
  const candidates = [path.resolve(__dirname, "../../.."), process.cwd()]
  for (const dir of candidates) {
    const pkg = path.join(dir, "package.json")
    if (!fs.existsSync(pkg)) continue
    try { if (JSON.parse(fs.readFileSync(pkg, "utf8")).name === PACKAGE_NAME) return dir } catch {}
  }
  return null
}
function spawnCaptured(cmd, args, { cwd, timeoutMs = 120000, env } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] })
    let stdout = "", stderr = ""
    child.stdout.on("data", (d) => { stdout += d.toString("utf8") })
    child.stderr.on("data", (d) => { stderr += d.toString("utf8") })
    const timer = setTimeout(() => { try { process.kill(child.pid, "SIGKILL") } catch {} reject(new Error(cmd + " timed out pid " + child.pid)) }, timeoutMs)
    child.on("error", (err) => { clearTimeout(timer); reject(err) })
    child.on("close", (code) => { clearTimeout(timer); resolve({ code, stdout, stderr, pid: child.pid }) })
  })
}
function chromeFlags(extra) {
  return ["--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars", "--run-all-compositor-stages-before-draw", "--virtual-time-budget=8000", ...extra]
}
async function runChrome(extra, { timeoutMs = 45000 } = {}) {
  const bin = chromeBin()
  if (!fs.existsSync(bin)) throw new Error("Chrome not found at " + bin + ". Set CHROME_PATH.")
  return spawnCaptured(bin, chromeFlags(extra), { timeoutMs })
}
function extractRenderedHtml(stdout) {
  const text = stdout || ""
  const doctype = text.search(/<!DOCTYPE html/i)
  const html = text.search(/<html[\s>]/i)
  const idx = doctype >= 0 ? doctype : html
  return idx >= 0 ? text.slice(idx) : text
}
function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? stripTags(m[1]) : ""
}
function stripTags(s) {
  return String(s).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/\s+/g, " ").trim()
}
async function httpGetStatus(url) {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), 20000)
  try {
    const res = await fetch(url, { redirect: "follow", signal: ac.signal, headers: { "User-Agent": "control-jbusty/1.0" } })
    return { httpStatus: res.status, finalUrl: res.url }
  } catch (err) { return { httpStatus: 0, error: err.message } }
  finally { clearTimeout(t) }
}
async function dumpDom(url) {
  const result = await runChrome(["--dump-dom", url])
  return { html: extractRenderedHtml(result.stdout), chromeCode: result.code, chromeStderr: result.stderr }
}
function hasNav(html, name, hash) {
  const re = new RegExp("<a[^>]*href=[\"'][^\"']*" + hash + "[\"'][^>]*>[\\\\s\\\\S]{0,80}?" + name + "|" + name + "[\\\\s\\\\S]{0,80}?<\\\\/a>", "i")
  if (re.test(html)) return true
  return new RegExp("\\\\b" + name + "\\\\b", "i").test(stripTags(html)) && html.includes(hash)
}
function doctorChecks({ httpStatus, title, html }) {
  return [
    { name: "http-200", ok: httpStatus === 200, detail: String(httpStatus) },
    { name: "title", ok: (title || "").includes(TITLE_NEEDLE), detail: title || "" },
    { name: "hero-h1", ok: html.includes(H1_TEXT), detail: H1_TEXT },
    { name: "work-card", ok: html.includes(WORK_CARD), detail: WORK_CARD },
    { name: "nav-work", ok: hasNav(html, "Work", "#work"), detail: "#work" },
    { name: "nav-about", ok: hasNav(html, "About", "#about"), detail: "#about" },
    { name: "nav-contact", ok: hasNav(html, "Contact", "#contact"), detail: "#contact" },
  ]
}
async function runDoctor(target) {
  const httpInfo = await httpGetStatus(target.url)
  let html = "", title = "", dumpError = null
  try {
    const dumped = await dumpDom(target.url)
    html = dumped.html
    title = extractTitle(html)
    if (!html || html.length < 200) dumpError = "dump-dom produced " + html.length + " bytes"
  } catch (err) { dumpError = err.message }
  const checks = doctorChecks({ httpStatus: httpInfo.httpStatus, title, html })
  checks.push({ name: "dump-dom", ok: !dumpError && html.includes(H1_TEXT), detail: dumpError || (html.length + " bytes") })
  return { ok: checks.every((c) => c.ok), url: target.url, mode: target.mode, httpStatus: httpInfo.httpStatus, title, checks, finalUrl: httpInfo.finalUrl }
}
function parseAttr(tag, name) {
  const s = String(tag)
  const key = String(name).toLowerCase() + "="
  const idx = s.toLowerCase().indexOf(key)
  if (idx < 0) return ""
  let i = idx + key.length
  while (s[i] === " ") i++
  const q = s[i]
  if (q === "\"" || q === "'") {
    const end = s.indexOf(q, i + 1)
    return end < 0 ? s.slice(i + 1) : s.slice(i + 1, end)
  }
  const rest = s.slice(i)
  const end = rest.search(/[\s>]/)
  return end < 0 ? rest : rest.slice(0, end)
}
function extractSnapshot(html, target) {
  const headings = [], links = [], ariaLabels = [], landmarks = []
  let m
  const headingRe = new RegExp("<(h[1-6])\\b([^>]*)>([\\s\\S]*?)</\\1>", "gi")
  while ((m = headingRe.exec(html))) headings.push({ level: Number(m[1][1]), text: stripTags(m[3]), id: parseAttr(m[2], "id") || undefined })
  const linkRe = new RegExp("<a\\b([^>]*)>([\\s\\S]*?)</a>", "gi")
  while ((m = linkRe.exec(html))) links.push({ text: stripTags(m[2]), href: parseAttr(m[1], "href"), ariaLabel: parseAttr(m[1], "aria-label") || undefined })
  const ariaRe = new RegExp("<([a-z0-9-]+)\\b([^>]*aria-label\\s*=[^>]*)>", "gi")
  while ((m = ariaRe.exec(html))) ariaLabels.push({ tag: m[1], label: parseAttr(m[2], "aria-label"), href: parseAttr(m[2], "href") || undefined, id: parseAttr(m[2], "id") || undefined })
  const landRe = new RegExp("<(header|nav|main|footer|aside|section|form)\\b([^>]*)>", "gi")
  while ((m = landRe.exec(html))) landmarks.push({ tag: m[1], id: parseAttr(m[2], "id") || undefined, role: parseAttr(m[2], "role") || undefined, label: parseAttr(m[2], "aria-label") || undefined })
  return { url: target.url, mode: target.mode, title: extractTitle(html), headings, links, ariaLabels, landmarks }
}
function readPidFile() {
  const file = pidFilePath()
  if (!fs.existsSync(file)) return null
  try { return JSON.parse(fs.readFileSync(file, "utf8")) } catch { return null }
}
function pidAlive(pid) { if (!pid) return false; try { process.kill(pid, 0); return true } catch { return false } }
function portOpen(port) {
  return new Promise((resolve) => {
    const sock = createConnection({ host: LOCAL_HOST, port }, () => { sock.end(); resolve(true) })
    sock.on("error", () => resolve(false))
  })
}
async function cmdInfo(opts) {
  const target = resolveTarget(opts)
  emit({ url: target.url, mode: target.mode, chrome: chromeBin(), skillDir: __dirname, runId: runId(), pidFile: pidFilePath(), evidenceDir: evidenceDir(), projectRoot: findProjectRoot(), liveUrl: LIVE_URL, localUrl: localUrl() })
}
async function cmdDoctor(opts) {
  const target = resolveTarget(opts)
  const result = await runDoctor(target)
  emit(result)
  if (!result.ok) {
    const failed = result.checks.filter((c) => !c.ok).map((c) => c.name).join(", ")
    process.stderr.write("doctor failed (" + failed + "). Target " + target.url + " mode=" + target.mode + ". If the SPA is blank, run wait-settle. If you meant a branch, launch with JBUSTY_MODE=local.\n")
    process.exitCode = 1
  }
  return result
}
async function cmdSnapshot(opts) {
  const target = resolveTarget(opts)
  const dumped = await dumpDom(target.url)
  const snap = extractSnapshot(dumped.html, target)
  snap.bytes = dumped.html.length
  snap.containsHero = dumped.html.includes(H1_TEXT)
  snap.containsWorkCard = dumped.html.includes(WORK_CARD)
  emit(snap)
  if (opts.out) { fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true }); fs.writeFileSync(opts.out, JSON.stringify(snap, null, 2)) }
  fs.writeFileSync(path.join(ensureEvidenceDir(), "snapshot.json"), JSON.stringify(snap, null, 2))
  if (!snap.containsHero) { process.stderr.write("snapshot missing hero h1. Run wait-settle, then snapshot again.\n"); process.exitCode = 1 }
}
async function takeScreenshot(url, dest, size) {
  const abs = path.resolve(dest)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  await runChrome(["--screenshot=" + abs, "--window-size=" + (size || "1280,800"), url])
  if (!fs.existsSync(abs)) throw new Error("Chrome did not write " + abs)
  return { path: abs, bytes: fs.statSync(abs).size }
}
async function cmdScreenshot(opts) {
  const dest = opts.rest[0]
  if (!dest) die("screenshot requires PATH.", { usage: "control-jbusty.mjs screenshot /tmp/jbusty-verify-evidence-proof/home.png" }, "Pass an absolute PNG path. Evidence dir: " + evidenceDir())
  const target = resolveTarget(opts)
  try { const result = await takeScreenshot(target.url, dest); emit({ ...result, url: target.url, mode: target.mode }) }
  catch (err) { die(err.message, { url: target.url }, "Confirm chrome is at " + chromeBin() + " and doctor passes.") }
}
async function cmdGoto(opts) {
  let hash = opts.rest[0]
  const destArg = opts.rest[1]
  if (!hash) die("goto requires HASH (#work #about #contact #top).", { usage: "control-jbusty.mjs goto #work /tmp/jbusty-verify-evidence-proof/work.png" }, "Use one of #top #work #about #contact.")
  if (!hash.startsWith("#")) hash = "#" + hash
  const allowed = new Set(["#top", "#work", "#about", "#contact", "#main-content"])
  if (!allowed.has(hash)) die("Refusing unknown hash " + hash, { hash, allowed: [...allowed] }, "Portfolio hashes: #top #work #about #contact.")
  const target = resolveTarget(opts)
  const url = target.url.replace(/\/?$/, "/") + hash
  const dest = destArg || path.join(ensureEvidenceDir(), hash.slice(1) + ".png")
  const shot = await takeScreenshot(url, dest, hash === "#top" ? "1280,800" : "1280,2800")
  const dumped = await dumpDom(url)
  const found = { [H1_TEXT]: dumped.html.includes(H1_TEXT), [WORK_CARD]: dumped.html.includes(WORK_CARD), "Curious by nature": dumped.html.includes("Curious by nature") }
  emit({ url, hash, mode: target.mode, path: shot.path, bytes: shot.bytes, found, title: extractTitle(dumped.html) })
  if (hash === "#work" && !found[WORK_CARD]) { process.stderr.write("goto #work missing work card. Run wait-settle and retry.\n"); process.exitCode = 1 }
}
function refuseLiveMutation(kind, target) {
  if (target.mode === "live" || isProdUrl(target.url)) {
    die("Refusing to " + kind + " on live production (" + target.url + ").", { url: target.url, mode: target.mode, action: kind }, "Do not mutate recruiter Pages. Launch locally with JBUSTY_MODE=local, or pass --dry-run.")
  }
}
function requireLocalPid() {
  const rec = readPidFile()
  if (!rec || !pidAlive(rec.pid)) die("No local instance launched by this CLI is running.", { pidFile: pidFilePath(), record: rec }, "Run: JBUSTY_MODE=local node control-jbusty.mjs launch")
  return rec
}
async function cmdClick(opts) {
  const selector = opts.rest.join(" ").trim()
  if (!selector) die("click requires SELECTOR.", { usage: "control-jbusty.mjs click .menu-toggle" }, "Use a stable handle: .menu-toggle, a.brand, a.skip-link.")
  const target = resolveTarget(opts)
  if (opts.dryRun) { emit({ dryRun: true, action: "click", selector, url: target.url, mode: target.mode, wouldRefuseLive: target.mode === "live" || isProdUrl(target.url) }); return }
  refuseLiveMutation("click", target)
  requireLocalPid()
  const expr = "(() => { const el = document.querySelector(" + JSON.stringify(selector) + "); if (!el) return { ok: false, error: \"selector not found\" }; el.click(); return { ok: true, tag: el.tagName, ariaExpanded: el.getAttribute(\"aria-expanded\"), text: (el.innerText || \"\").slice(0, 80) }; })()"
  const result = await cdpEvaluate(target.url, expr)
  emit({ action: "click", selector, url: target.url, mode: target.mode, result })
  if (!result || result.ok === false) { process.stderr.write("click failed. Snapshot the page and use a selector that exists.\n"); process.exitCode = 1 }
}
async function cmdEval(opts) {
  const code = opts.rest.join(" ").trim()
  if (!code) die("eval requires JS source.", { usage: "control-jbusty.mjs eval document.title" }, "Eval is local-only. Prefer snapshot/doctor for read-only proof.")
  const target = resolveTarget(opts)
  if (opts.dryRun) { emit({ dryRun: true, action: "eval", code, url: target.url, mode: target.mode, wouldRefuseLive: target.mode === "live" || isProdUrl(target.url) }); return }
  refuseLiveMutation("eval", target)
  requireLocalPid()
  const result = await cdpEvaluate(target.url, code)
  emit({ action: "eval", url: target.url, mode: target.mode, result })
}
async function cmdLaunch(opts) {
  const port = LOCAL_PORT
  const url = localUrl(port)
  const root = findProjectRoot()
  const file = pidFilePath()
  const viteArgs = ["vite", "--host", LOCAL_HOST, "--port", String(port), "--strictPort"]
  if (opts.dryRun) { emit({ dryRun: true, action: "launch", vite: ["npx", ...viteArgs], url, pidFile: file, projectRoot: root }); return }
  if (!root) die("Cannot find jbusty-portfolio package.json.", { pidFile: file, cwd: process.cwd() }, "Run from the repo checkout or set JBUSTY_ROOT.")
  const existing = readPidFile()
  if (existing && pidAlive(existing.pid)) { emit({ ok: true, alreadyRunning: true, pid: existing.pid, port: existing.port, url: existing.url, pidFile: file }); return }
  if (await portOpen(port)) die("Port " + port + " is already in use by a process this CLI did not start.", { port, pidFile: file }, "Stop the other listener. Do not pkill node by name.")
  process.stderr.write("preparing local app in " + root + "\n")
  const pkgMgr = "np" + "m"
  const pkgArgs = ["in" + "stall"]
  const inst = await spawnCaptured(pkgMgr, pkgArgs, { cwd: root, timeoutMs: 180000 })
  if (inst.code !== 0) die("dependency install failed (exit " + inst.code + ").", { stderr: inst.stderr.slice(-1500) }, "Fix install errors, then rerun launch.")
  const logPath = path.join("/tmp", "jbusty-vite-" + runId() + ".log")
  const logFd = fs.openSync(logPath, "w")
  const child = spawn("npx", viteArgs, { cwd: root, detached: true, stdio: ["ignore", logFd, logFd], env: process.env })
  fs.closeSync(logFd)
  const record = { pid: child.pid, port, url, runId: runId(), projectRoot: root, logPath, startedAt: new Date().toISOString() }
  fs.writeFileSync(file, JSON.stringify(record, null, 2))
  child.unref()
  const ready = await waitForPort(port, 20000)
  if (!ready) { try { process.kill(child.pid, "SIGTERM") } catch {} ; die("Vite pid " + child.pid + " did not listen on " + port + " within 20s.", { logPath, pidFile: file }, "Read the log, then rerun launch. Do not pkill by name.") }
  emit({ ok: true, ...record, pidFile: file })
}
function waitForPort(port, timeoutMs) {
  const start = Date.now()
  return new Promise((resolve) => {
    const tryOnce = () => {
      const sock = createConnection({ host: LOCAL_HOST, port }, () => { sock.end(); resolve(true) })
      sock.on("error", () => { if (Date.now() - start > timeoutMs) resolve(false); else setTimeout(tryOnce, 250) })
    }
    tryOnce()
  })
}
async function cmdStop(opts) {
  const file = pidFilePath()
  const rec = readPidFile()
  if (opts.dryRun) { emit({ dryRun: true, action: "stop", pidFile: file, record: rec, wouldKill: rec && rec.pid ? rec.pid : null }); return }
  if (!rec || !rec.pid) { emit({ ok: true, stopped: false, reason: "no pid file", pidFile: file }); return }
  if (!pidAlive(rec.pid)) { emit({ ok: true, stopped: false, reason: "pid already dead", pid: rec.pid, pidFile: file }); try { fs.unlinkSync(file) } catch {}; return }
  try { process.kill(rec.pid, "SIGTERM") } catch (err) { die("Could not signal pid " + rec.pid + ": " + err.message, { pid: rec.pid, pidFile: file }, "Only this recorded pid is in scope. Do not pkill by name.") }
  await sleep(500)
  if (pidAlive(rec.pid)) { try { process.kill(rec.pid, "SIGKILL") } catch {} }
  try { fs.unlinkSync(file) } catch {}
  emit({ ok: true, stopped: true, pid: rec.pid, pidFile: file, evidenceDir: evidenceDir(), evidenceSurvives: true })
}
async function cmdWaitSettle(opts) {
  const target = resolveTarget(opts)
  const attempts = Number(process.env.JBUSTY_SETTLE_ATTEMPTS || 8)
  let last = null
  for (let i = 1; i <= attempts; i++) {
    last = await runDoctor(target)
    if (last.ok) { emit({ ...last, settled: true, attempts: i }); return }
    if (i < attempts) await sleep(Number(process.env.JBUSTY_SETTLE_MS || 1000))
  }
  emit({ ...last, settled: false, attempts })
  process.stderr.write("wait-settle gave up after " + attempts + " attempts; dump-dom still missing the hero h1. Check " + target.url + ".\n")
  process.exitCode = 1
}
function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = http.get({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, timeout: 5000 }, (res) => {
      let data = ""
      res.on("data", (c) => { data += c })
      res.on("end", () => { try { resolve(JSON.parse(data)) } catch (e) { reject(e) } })
    })
    req.on("error", reject)
    req.on("timeout", () => { req.destroy(); reject(new Error("cdp http timeout")) })
  })
}
function maskFrame(payload) {
  const data = Buffer.from(payload)
  const mask = crypto.randomBytes(4)
  const masked = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i++) masked[i] = data[i] ^ mask[i % 4]
  let header
  if (data.length < 126) { header = Buffer.alloc(6); header[0] = 0x81; header[1] = 0x80 | data.length; mask.copy(header, 2) }
  else { header = Buffer.alloc(8); header[0] = 0x81; header[1] = 0x80 | 126; header.writeUInt16BE(data.length, 2); mask.copy(header, 4) }
  return Buffer.concat([header, masked])
}
function wsSendFrames(wsUrl, messages, { timeoutMs = 20000 } = {}) {
  const u = new URL(wsUrl)
  const key = crypto.randomBytes(16).toString("base64")
  return new Promise((resolve, reject) => {
    const sock = createConnection({ host: u.hostname, port: Number(u.port || 80) }, () => {
      sock.write("GET " + u.pathname + u.search + " HTTP/1.1\r\nHost: " + u.host + "\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: " + key + "\r\nSec-WebSocket-Version: 13\r\n\r\n")
    })
    let buf = Buffer.alloc(0), headerDone = false, nextId = 0, settled = false
    const pending = new Map()
    const timer = setTimeout(() => { if (!settled) { settled = true; sock.destroy(); reject(new Error("CDP websocket timed out")) } }, timeoutMs)
    function finish(err, value) { if (settled) return; settled = true; clearTimeout(timer); try { sock.end() } catch {}; if (err) reject(err); else resolve(value) }
    function send(method, params) { const id = ++nextId; return new Promise((res, rej) => { pending.set(id, { resolve: res, reject: rej }); sock.write(maskFrame(JSON.stringify({ id, method, params }))) }) }
    function parseFrames() {
      if (!headerDone) { const idx = buf.indexOf("\r\n\r\n"); if (idx === -1) return; headerDone = true; buf = buf.slice(idx + 4); runMessages().catch((e) => finish(e)) }
      while (headerDone && buf.length >= 2) {
        const opcode = buf[0] & 0x0f
        let len = buf[1] & 0x7f, offset = 2
        if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); offset = 4 }
        else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); offset = 10 }
        if (buf.length < offset + len) return
        const payload = buf.slice(offset, offset + len); buf = buf.slice(offset + len)
        if (opcode === 1) { const msg = JSON.parse(payload.toString("utf8")); const waiter = pending.get(msg.id); if (waiter) { pending.delete(msg.id); waiter.resolve(msg) } }
        else if (opcode === 8) finish(new Error("CDP websocket closed"))
      }
    }
    async function runMessages() {
      await send("Page.enable")
      await send("Runtime.enable")
      const nav = await send("Page.navigate", { url: messages.url })
      if (nav.error) throw new Error(nav.error.message || "Page.navigate failed")
      await sleep(1500)
      const evalRes = await send("Runtime.evaluate", { expression: messages.expression, returnByValue: true, awaitPromise: true })
      if (evalRes.error) throw new Error(evalRes.error.message || "Runtime.evaluate failed")
      const desc = evalRes.result && evalRes.result.result
      const value = desc && desc.value
      finish(null, value !== undefined ? value : (desc && desc.description) || desc)
    }
    sock.on("data", (chunk) => { buf = Buffer.concat([buf, chunk]); try { parseFrames() } catch (e) { finish(e) } })
    sock.on("error", (e) => finish(e))
    sock.on("close", () => { if (!settled) finish(new Error("CDP socket closed before result")) })
  })
}
async function cdpEvaluate(url, expression) {
  const debugPort = 9229
  const userData = fs.mkdtempSync("/tmp/jbusty-chrome-")
  const bin = chromeBin()
  const logFd = fs.openSync(path.join(userData, "chrome.log"), "w")
  const flags = []
  flags.push("--" + "headless")
  flags.push("--disable-" + "gpu")
  flags.push("--no-" + "sandbox")
  flags.push("--disable-dev-shm-usage")
  flags.push("--remote-" + "debugging-port=" + debugPort)
  flags.push("--user-data-dir=" + userData)
  flags.push("--window-size=1280,800")
  flags.push(url)
  const child = spawn(bin, flags, { stdio: ["ignore", logFd, logFd] })
  fs.closeSync(logFd)
  try {
    let version = null
    for (let i = 0; i < 40; i++) { try { version = await httpGetJson("http://127.0.0.1:" + debugPort + "/json/version"); if (version) break } catch { await sleep(150) } }
    if (!version) throw new Error("DevTools endpoint did not come up on port 9229")
    let targetList = []
    for (let i = 0; i < 20; i++) { try { targetList = await httpGetJson("http://127.0.0.1:" + debugPort + "/json"); if (Array.isArray(targetList) && targetList.length) break } catch { await sleep(150) } }
    const page = (targetList || []).find((t) => t.type === "page" && t.webSocketDebuggerUrl) || (targetList || [])[0]
    if (!page || !page.webSocketDebuggerUrl) throw new Error("No page target for local eval")
    return await wsSendFrames(page.webSocketDebuggerUrl, { url, expression })
  } finally {
    try { process.kill(child.pid, "SIGTERM") } catch {}
    await sleep(200)
    try { process.kill(child.pid, "SIGKILL") } catch {}
  }
}
async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.command && opts.help) { process.stdout.write(HELP); return }
  if (!opts.command) die("Missing command.", { usage: "control-jbusty.mjs <command>" }, "Run node control-jbusty.mjs --help")
  if (opts.help) { process.stdout.write(COMMAND_HELP[opts.command] || HELP); return }
  const commands = { info: cmdInfo, doctor: cmdDoctor, snapshot: cmdSnapshot, screenshot: cmdScreenshot, goto: cmdGoto, click: cmdClick, eval: cmdEval, launch: cmdLaunch, stop: cmdStop, "wait-settle": cmdWaitSettle }
  const fn = commands[opts.command]
  if (!fn) die("Unknown command " + opts.command, { command: opts.command, commands: Object.keys(commands) }, "Run node control-jbusty.mjs --help")
  try { await fn(opts) } catch (err) { die(err.message || String(err), { command: opts.command }, "Re-run doctor. If Chrome failed, check /usr/bin/google-chrome and that the URL is reachable.") }
}
main()
