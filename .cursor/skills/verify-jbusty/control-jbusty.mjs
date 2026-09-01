#!/usr/bin/env node
/**
 * Drive the live jbusty portfolio on GitHub Pages.
 * One JSON object on stdout. Exit 0 on success, non-zero on failure.
 * Click is always refused on jesusmbm.github.io. Never follow outbound project origins.
 */
import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const LIVE_URL = "https://jesusmbm.github.io/jbusty.github.io/"
const LIVE_HOST = "jesusmbm.github.io"
const CHROME_BIN = process.env.CHROME_PATH || "/usr/bin/google-chrome"
const DEFAULT_EVIDENCE = process.env.VERIFY_JBUSTY_EVIDENCE || "/tmp/verify-jbusty-evidence"
const WINDOW = "1280,800"
const CHROME_TIMEOUT_MS = 30000
const VIRTUAL_TIME_MS = 8000
const NODE_WATCHDOG_MS = 40000

const REQUIRED_MARKERS = [
  { id: "skip-link", test: (html) => /class=["'][^"']*\bskip-link\b/i.test(html) && /href=["']#main-content["']/i.test(html) && /Skip to main content/i.test(html) },
  { id: "#main-content", test: (html) => hasElemId(html, "main-content") },
  { id: "#top", test: (html) => hasElemId(html, "top") },
  { id: "#work", test: (html) => hasElemId(html, "work") },
  { id: "#about", test: (html) => hasElemId(html, "about") },
  { id: "#contact", test: (html) => hasElemId(html, "contact") },
  { id: "brand-aria-label", test: (html) => /aria-label=["']Jesus Bustillos-Molina, home["']/i.test(html) },
  { id: "h1-signal", test: (html) => /I find the signal/i.test(html) },
]

const OLD_IDENTITY = [
  { id: "old-#hero-id", test: (html) => hasElemId(html, "hero") },
  { id: "old-#projects", test: (html) => hasElemId(html, "projects") },
  { id: "old-#skills", test: (html) => hasElemId(html, "skills") },
  { id: "old-threat-hunt-copy", test: (html) => /I secure systems and hunt threats/i.test(html) },
]

const HELP = `control-jbusty — drive the live jbusty portfolio GitHub Pages UI.

USAGE
  node control-jbusty.mjs [--help] [--dry-run] [--url BASE] <command> [flags]

COMMANDS
  doctor                 GET live URL + chrome dump-dom; assert App.jsx identity
  snapshot [--path FILE] dump-dom HTML + compact headings/links/ids extract
  screenshot [--path FILE]
                         chrome --screenshot at 1280x800
  goto --url HASH_OR_URL resolve hash against live base, dump-dom, confirm id
  click ...              ALWAYS refused on jesusmbm.github.io (exit 2)
  cleanup                kill chrome pids this run started; never deletes evidence

FLAGS
  --help, -h             this text
  --dry-run              print planned chrome argv / URL; do not launch chrome
  --url                  override live base, or goto destination after the command
  --path FILE            snapshot / screenshot / optional goto screenshot path

DEFAULTS
  base     ${LIVE_URL}
  evidence ${DEFAULT_EVIDENCE}  (or $VERIFY_JBUSTY_EVIDENCE)
  chrome   ${CHROME_BIN}

Chrome is always invoked with --headless=new --no-sandbox --disable-gpu
--disable-dev-shm-usage --timeout=30000 --virtual-time-budget=8000.
Stderr is written to the evidence dir. Never click live. Never follow
outbound project (netlify) origins.

EXAMPLES
  node control-jbusty.mjs --help
  node control-jbusty.mjs --dry-run doctor
  node control-jbusty.mjs doctor
  node control-jbusty.mjs snapshot --path /tmp/verify-jbusty-evidence/hero.html
  node control-jbusty.mjs screenshot --path /tmp/verify-jbusty-evidence/hero.png
  node control-jbusty.mjs goto --url '#work'
  node control-jbusty.mjs goto work
  node control-jbusty.mjs click .menu-toggle
  node control-jbusty.mjs cleanup
`

function emit(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n")
}

function fail(obj, code = 1) {
  emit({ ok: false, ...obj })
  process.exit(code)
}

function hasElemId(html, id) {
  const re = new RegExp(`\\sid=["']${id}["']`, "i")
  return re.test(html)
}

function evidenceDir() {
  const dir = DEFAULT_EVIDENCE
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function pidFile() {
  return path.join(evidenceDir(), ".chrome-pids.json")
}

function recordPid(pid) {
  const file = pidFile()
  let list = []
  try { list = JSON.parse(fs.readFileSync(file, "utf8")) } catch { list = [] }
  if (!Array.isArray(list)) list = []
  list.push({ pid, at: new Date().toISOString() })
  fs.writeFileSync(file, JSON.stringify(list))
}

function parseArgs(argv) {
  const opts = {
    help: false,
    dryRun: false,
    baseUrl: LIVE_URL,
    command: null,
    dest: null,
    path: null,
    rest: [],
  }
  const args = [...argv]
  while (args.length) {
    const a = args.shift()
    if (a === "--help" || a === "-h") {
      opts.help = true
    } else if (a === "--dry-run") {
      opts.dryRun = true
    } else if (a === "--url" || a.startsWith("--url=")) {
      const v = a.startsWith("--url=") ? a.slice(6) : args.shift()
      if (v == null) fail({ error: "--url requires a value", hint: "quote hashes in the shell: --url '#work' (unquoted # starts a comment). Or pass a bare name: goto work" })
      if (opts.command === "goto") opts.dest = v
      else opts.baseUrl = v
    } else if (a === "--path" || a.startsWith("--path=")) {
      const v = a.startsWith("--path=") ? a.slice(7) : args.shift()
      if (v == null) fail({ error: "--path requires a value" })
      opts.path = v
    } else if (!a.startsWith("-") && !opts.command) {
      opts.command = a
    } else if (!a.startsWith("-")) {
      opts.rest.push(a)
      if (opts.command === "goto" && !opts.dest) opts.dest = a
      if ((opts.command === "snapshot" || opts.command === "screenshot") && !opts.path) opts.path = a
    } else {
      opts.rest.push(a)
    }
  }
  return opts
}

function normalizeBase(url) {
  try {
    const u = new URL(url)
    if (!u.pathname.endsWith("/")) u.pathname += "/"
    u.hash = ""
    u.search = ""
    return u.toString()
  } catch {
    fail({ error: "invalid base url", url })
  }
}

function hostnameOf(url) {
  try { return new URL(url).hostname } catch { return "" }
}

function isLiveHost(url) {
  return hostnameOf(url) === LIVE_HOST
}

function chromeProfileDir() {
  const dir = path.join("/tmp", "verify-jbusty-chrome-" + process.pid + "-" + Date.now())
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function chromeCommonArgs({ createProfile = false } = {}) {
  const profile = createProfile ? chromeProfileDir() : "/tmp/verify-jbusty-chrome-profile"
  return [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    `--timeout=${CHROME_TIMEOUT_MS}`,
    `--virtual-time-budget=${VIRTUAL_TIME_MS}`,
    `--window-size=${WINDOW}`,
    `--user-data-dir=${profile}`,
  ]
}

function extractHtml(stdout) {
  const text = String(stdout || "")
  const doctype = text.search(/<!DOCTYPE html/i)
  const htmlTag = text.search(/<html[\s>]/i)
  const idx = doctype >= 0 ? doctype : htmlTag
  return idx >= 0 ? text.slice(idx) : text
}

function extractTitle(html) {
  const m = String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? stripTags(m[1]) : ""
}

function stripTags(s) {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function listIds(html) {
  const ids = []
  const re = /\sid=["']([^"']+)["']/gi
  let m
  while ((m = re.exec(html))) ids.push(m[1])
  return [...new Set(ids)]
}

function compactExtract(html) {
  const lines = []
  lines.push("TITLE: " + extractTitle(html))
  lines.push("IDS: " + listIds(html).join(", "))
  lines.push("HEADINGS:")
  const headingRe = /<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi
  let m
  while ((m = headingRe.exec(html))) {
    lines.push(`  ${m[1]}: ${stripTags(m[3])}`)
  }
  lines.push("SECTION INDEX:")
  const indexRe = /<p\b[^>]*class=["'][^"']*\bsection-index\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi
  let indexFound = false
  while ((m = indexRe.exec(html))) {
    indexFound = true
    lines.push(`  ${stripTags(m[1])}`)
  }
  if (!indexFound) lines.push("  (none)")
  lines.push("STATEMENT:")
  const stmt = html.match(/<div\b[^>]*class=["'][^"']*\bstatement-copy\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
  lines.push(stmt ? `  ${stripTags(stmt[1])}` : "  (none)")
  lines.push("LINKS:")
  const linkRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi
  while ((m = linkRe.exec(html))) {
    const href = attr(m[1], "href")
    const label = attr(m[1], "aria-label")
    const text = stripTags(m[2])
    lines.push(`  ${text || label || "(empty)"} -> ${href}${label ? ` [${label}]` : ""}`)
  }
  return lines.join("\n") + "\n"
}

function attr(tag, name) {
  const re = new RegExp(name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i")
  const m = String(tag).match(re)
  return m ? (m[1] ?? m[2] ?? m[3] ?? "") : ""
}

function stamp(kind) {
  return `${kind}-${new Date().toISOString().replace(/[:.]/g, "-")}`
}

function runChrome({ extraArgs, url, stderrName, dryRun }) {
  const args = [...chromeCommonArgs({ createProfile: !dryRun }), ...extraArgs, url]
  if (dryRun) {
    return { dryRun: true, chrome: CHROME_BIN, argv: args, url }
  }
  const dir = evidenceDir()
  const stderrPath = path.join(dir, stderrName)
  const stderrFd = fs.openSync(stderrPath, "w")
  return new Promise((resolve, reject) => {
    const child = spawn(CHROME_BIN, args, {
      stdio: ["ignore", "pipe", stderrFd],
    })
    recordPid(child.pid)
    let stdout = ""
    child.stdout.on("data", (buf) => { stdout += buf.toString("utf8") })
    const watchdog = setTimeout(() => {
      try { child.kill("SIGKILL") } catch { /* already gone */ }
      reject(new Error(`chrome watchdog ${NODE_WATCHDOG_MS}ms pid=${child.pid}`))
    }, NODE_WATCHDOG_MS)
    child.on("error", (err) => {
      clearTimeout(watchdog)
      try { fs.closeSync(stderrFd) } catch { /* */ }
      reject(err)
    })
    child.on("close", (code) => {
      clearTimeout(watchdog)
      try { fs.closeSync(stderrFd) } catch { /* */ }
      resolve({
        code,
        stdout,
        html: extractHtml(stdout),
        stderrPath,
        pid: child.pid,
        argv: args,
        url,
      })
    })
  })
}

async function chromeVersion() {
  return new Promise((resolve) => {
    const child = spawn(CHROME_BIN, ["--version"], { stdio: ["ignore", "pipe", "pipe"] })
    let out = ""
    child.stdout.on("data", (b) => { out += b.toString("utf8") })
    child.stderr.on("data", () => {})
    const t = setTimeout(() => { try { child.kill("SIGKILL") } catch {} resolve("unknown") }, 5000)
    child.on("close", () => { clearTimeout(t); resolve(out.trim() || "unknown") })
    child.on("error", () => { clearTimeout(t); resolve("unknown") })
  })
}

async function httpGet(url) {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), 20000)
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ac.signal,
      headers: { "User-Agent": "control-jbusty/1.0" },
    })
    return { status: res.status, finalUrl: res.url }
  } catch (err) {
    return { status: 0, error: err.message }
  } finally {
    clearTimeout(t)
  }
}

function markerReport(html) {
  const found = []
  const missing = []
  for (const m of REQUIRED_MARKERS) {
    if (m.test(html)) found.push(m.id)
    else missing.push(m.id)
  }
  const oldFound = OLD_IDENTITY.filter((m) => m.test(html)).map((m) => m.id)
  return { found, missing, oldFound }
}

function refuseOutbound(url, base) {
  let target
  let origin
  try {
    target = new URL(url)
    origin = new URL(base)
  } catch {
    fail({ error: "invalid url", url })
  }
  if (target.origin !== origin.origin) {
    fail({
      error: "refusing outbound navigation",
      url,
      origin: target.origin,
      reason: "verification stays on live Pages; project cards open other origins and must not be followed",
    })
  }
}

function resolveGoto(dest, baseUrl) {
  if (!dest) fail({ error: "goto requires --url HASH_OR_URL", usage: "node control-jbusty.mjs goto --url '#work'  (or: goto work)" })
  const base = normalizeBase(baseUrl)
  if (dest.startsWith("#")) return new URL(dest, base).toString()
  try {
    const u = new URL(dest)
    return u.toString()
  } catch {
    return new URL("#" + dest.replace(/^#/, ""), base).toString()
  }
}

function targetIdFromUrl(url) {
  try {
    const hash = new URL(url).hash.replace(/^#/, "")
    return hash || null
  } catch {
    return null
  }
}

async function cmdDoctor(opts) {
  const url = normalizeBase(opts.baseUrl)
  const argv = [...chromeCommonArgs(), "--dump-dom", url]
  if (opts.dryRun) {
    emit({ ok: true, dryRun: true, command: "doctor", url, chrome: CHROME_BIN, argv })
    return
  }
  const version = await chromeVersion()
  const httpInfo = await httpGet(url)
  let dumped
  try {
    dumped = await runChrome({
      extraArgs: ["--dump-dom"],
      url,
      stderrName: "chrome-doctor.stderr",
      dryRun: false,
    })
  } catch (err) {
    fail({
      error: "chrome dump-dom failed",
      url,
      status: httpInfo.status,
      chromeVersion: version,
      detail: err.message,
    })
  }
  const html = dumped.html || ""
  const title = extractTitle(html)
  const markers = markerReport(html)
  const dumpPath = path.join(evidenceDir(), "doctor.dump.html")
  fs.writeFileSync(dumpPath, html)
  const oldIdentity = markers.oldFound.length > 0 && markers.missing.length > 0
  const ok =
    httpInfo.status === 200 &&
    markers.missing.length === 0 &&
    !oldIdentity &&
    !markers.oldFound.includes("old-#hero-id") &&
    !markers.oldFound.includes("old-threat-hunt-copy")
  const payload = {
    ok,
    url,
    status: httpInfo.status,
    title,
    markers: { found: markers.found, missing: markers.missing },
    chromeVersion: version,
  }
  if (markers.oldFound.length) payload.oldIdentity = markers.oldFound
  if (!ok) {
    payload.error = oldIdentity
      ? "old leftover #hero identity from unused components; live App.jsx expected"
      : "doctor identity check failed"
    payload.dumpPath = dumpPath
    emit(payload)
    process.exit(1)
  }
  emit(payload)
}

async function cmdSnapshot(opts) {
  const url = normalizeBase(opts.baseUrl)
  const dest = opts.path || path.join(evidenceDir(), "snapshot.html")
  const argv = [...chromeCommonArgs(), "--dump-dom", url]
  if (opts.dryRun) {
    emit({ ok: true, dryRun: true, command: "snapshot", url, path: dest, chrome: CHROME_BIN, argv })
    return
  }
  let dumped
  try {
    dumped = await runChrome({
      extraArgs: ["--dump-dom"],
      url,
      stderrName: "chrome-snapshot.stderr",
    })
  } catch (err) {
    fail({ error: "chrome dump-dom failed", url, detail: err.message })
  }
  const html = dumped.html || ""
  fs.mkdirSync(path.dirname(path.resolve(dest)), { recursive: true })
  fs.writeFileSync(dest, html)
  const extractPath = dest.replace(/\.html?$/i, "") + ".extract.txt"
  fs.writeFileSync(extractPath, compactExtract(html))
  const ids = listIds(html)
  emit({
    ok: true,
    url,
    path: path.resolve(dest),
    extractPath: path.resolve(extractPath),
    bytes: Buffer.byteLength(html),
    ids,
    title: extractTitle(html),
  })
}

async function cmdScreenshot(opts) {
  const url = normalizeBase(opts.baseUrl)
  const dest = opts.path || path.join(evidenceDir(), "screenshot.png")
  fs.mkdirSync(path.dirname(path.resolve(dest)), { recursive: true })
  const abs = path.resolve(dest)
  const argv = [...chromeCommonArgs(), `--screenshot=${abs}`, url]
  if (opts.dryRun) {
    emit({ ok: true, dryRun: true, command: "screenshot", url, path: abs, chrome: CHROME_BIN, argv })
    return
  }
  try {
    await runChrome({
      extraArgs: [`--screenshot=${abs}`],
      url,
      stderrName: "chrome-screenshot.stderr",
    })
  } catch (err) {
    fail({ error: "chrome screenshot failed", url, path: abs, detail: err.message })
  }
  if (!fs.existsSync(abs)) fail({ error: "chrome did not write screenshot", path: abs, url })
  emit({ ok: true, url, path: abs, bytes: fs.statSync(abs).size })
}

async function cmdGoto(opts) {
  const base = normalizeBase(opts.baseUrl)
  const dest = opts.dest || opts.rest[0]
  const url = resolveGoto(dest, base)
  refuseOutbound(url, base)
  const id = targetIdFromUrl(url)
  const argv = [...chromeCommonArgs(), "--dump-dom", url]
  const shotArgs = opts.path ? [...chromeCommonArgs(), `--screenshot=${path.resolve(opts.path)}`, url] : null
  if (opts.dryRun) {
    emit({
      ok: true,
      dryRun: true,
      command: "goto",
      url,
      id,
      chrome: CHROME_BIN,
      argv,
      screenshotArgv: shotArgs,
    })
    return
  }
  let dumped
  try {
    dumped = await runChrome({
      extraArgs: ["--dump-dom"],
      url,
      stderrName: "chrome-goto.stderr",
    })
  } catch (err) {
    fail({ error: "chrome dump-dom failed", url, detail: err.message })
  }
  const html = dumped.html || ""
  const found = id ? hasElemId(html, id) : false
  const dumpPath = path.join(evidenceDir(), `goto-${id || "page"}.html`)
  fs.writeFileSync(dumpPath, html)
  let shot = null
  if (opts.path) {
    const abs = path.resolve(opts.path)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    try {
      await runChrome({
        extraArgs: [`--screenshot=${abs}`],
        url,
        stderrName: "chrome-goto-screenshot.stderr",
      })
    } catch (err) {
      fail({ error: "chrome screenshot failed", url, path: abs, detail: err.message, foundId: found })
    }
    if (!fs.existsSync(abs)) fail({ error: "chrome did not write screenshot", path: abs, url })
    shot = { path: abs, bytes: fs.statSync(abs).size }
  }
  const payload = {
    ok: found,
    url,
    id,
    found: found,
    dumpPath,
    title: extractTitle(html),
  }
  if (shot) {
    payload.path = shot.path
    payload.bytes = shot.bytes
  }
  if (!found) {
    payload.error = id ? `target id #${id} not found in dump-dom` : "no hash id to confirm"
    emit(payload)
    process.exit(1)
  }
  emit(payload)
}

function cmdClick(opts) {
  const url = normalizeBase(opts.baseUrl)
  const selector = opts.rest.join(" ").trim() || null
  if (opts.dryRun) {
    emit({
      ok: true,
      dryRun: true,
      command: "click",
      url,
      selector,
      wouldRefuse: isLiveHost(url),
      reason: isLiveHost(url)
        ? "click refused on live GitHub Pages (shared recruiter instance; no mutation)"
        : "click is not implemented; this skill is read-only against live Pages",
    })
    return
  }
  if (isLiveHost(url)) {
    fail({
      error: "click refused on live",
      reason: "live GitHub Pages is a shared public instance; click would mutate menu state or open mailto/outbound tabs. Use snapshot, screenshot, and goto.",
      url,
      selector,
    }, 2)
  }
  fail({
    error: "click not supported",
    reason: "this skill drives live Pages only; click is refused. Use snapshot / screenshot / goto.",
    url,
    selector,
  }, 2)
}

function pidAlive(pid) {
  try { process.kill(pid, 0); return true } catch { return false }
}

function cmdCleanup(opts) {
  if (opts.dryRun) {
    emit({ ok: true, dryRun: true, command: "cleanup", pidFile: pidFile(), evidenceDir: evidenceDir() })
    return
  }
  const file = pidFile()
  let list = []
  try { list = JSON.parse(fs.readFileSync(file, "utf8")) } catch { list = [] }
  const killed = []
  const alreadyDead = []
  for (const rec of list) {
    const pid = rec && rec.pid
    if (!pid) continue
    if (!pidAlive(pid)) { alreadyDead.push(pid); continue }
    try { process.kill(pid, "SIGTERM") } catch { /* */ }
    killed.push(pid)
  }
  for (const pid of killed) {
    if (pidAlive(pid)) {
      try { process.kill(pid, "SIGKILL") } catch { /* */ }
    }
  }
  const evidence = evidenceDir()
  const files = fs.readdirSync(evidence).filter((n) => !n.startsWith(".chrome"))
  emit({
    ok: true,
    command: "cleanup",
    killed,
    alreadyDead,
    evidenceDir: evidence,
    evidenceSurvives: true,
    evidenceFiles: files,
  })
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help || !opts.command) {
    process.stdout.write(HELP)
    process.exit(0)
  }
  try {
    opts.baseUrl = opts.baseUrl || LIVE_URL
    switch (opts.command) {
      case "doctor":
        await cmdDoctor(opts)
        break
      case "snapshot":
        await cmdSnapshot(opts)
        break
      case "screenshot":
        await cmdScreenshot(opts)
        break
      case "goto":
        await cmdGoto(opts)
        break
      case "click":
        cmdClick(opts)
        break
      case "cleanup":
        cmdCleanup(opts)
        break
      default:
        fail({ error: `unknown command: ${opts.command}`, hint: "see --help" })
    }
  } catch (err) {
    fail({ error: err.message || String(err) })
  }
}

const self = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === self) {
  main()
}
