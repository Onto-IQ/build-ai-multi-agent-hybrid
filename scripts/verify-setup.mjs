#!/usr/bin/env node
/**
 * Readiness check for the hybrid class.
 *
 *   node scripts/verify-setup.mjs                 learner machine (homework)
 *   node scripts/verify-setup.mjs --course-files  repo shape only (no tools)
 *
 * Flags: --skip-claude --skip-opencode --skip-openrouter --skip-workshop --course-files
 *        --skip-claude-prompt --skip-opencode-prompt (skip the live login round trips)
 *
 * Never prints API key values.
 */

import { execFile, spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { createRequire } from 'node:module';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { resolveWorkshopDir } = require('./workshop-dir.js');

const exec = promisify(execFile);
const repo = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const courseFiles = args.has('--course-files');
const skipClaude = courseFiles || args.has('--skip-claude');
const skipOpencode = courseFiles || args.has('--skip-opencode');
const skipOpenrouter = courseFiles || args.has('--skip-openrouter');
const skipWorkshop = courseFiles || args.has('--skip-workshop');
const skipClaudePrompt = args.has('--skip-claude-prompt');
const skipOpencodePrompt = args.has('--skip-opencode-prompt');

const problems = [];

function note(message) {
  console.log(`OK   | ${message}`);
}

function warn(message) {
  console.log(`WARN | ${message}`);
}

function bad(message) {
  problems.push(message);
  console.log(`FAIL | ${message}`);
}

function parseVersion(text) {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(text || '');
  if (!match) return null;
  return match.slice(1, 4).map(Number);
}

function atLeast(found, minimum) {
  if (!found) return false;
  for (let i = 0; i < minimum.length; i += 1) {
    if (found[i] > minimum[i]) return true;
    if (found[i] < minimum[i]) return false;
  }
  return true;
}

const HANDS_ON = [
  'Lessons/01-environment-setup/LAB.md',
  'Lessons/02-agent-foundations/LAB.md',
  'Lessons/03-swarm/LAB.md',
  'Lessons/04-specialty-agents/LAB.md',
  'Lessons/05-sequential-orchestration/LAB.md',
  'Lessons/06-fix-and-qa/LAB.md',
  'Lessons/07-skills/LAB.md',
  'Lessons/09-guardrails-hooks/LAB.md',
  'Lessons/10-context-memory/LAB.md',
  'Lessons/11-feature/LAB.md',
  'Lessons/12-capstone/LAB.md',
  'Lessons/13-deploy-preflight/LAB.md',
];

const MODULES = [
  '01-environment-setup',
  '02-agent-foundations',
  '03-swarm',
  '04-specialty-agents',
  '05-sequential-orchestration',
  '06-fix-and-qa',
  '07-skills',
  '08-mcp',
  '09-guardrails-hooks',
  '10-context-memory',
  '11-feature',
  '12-capstone',
  '13-deploy-preflight',
];

function handsOnHas(relPath) {
  const file = path.join(repo, relPath);
  if (!existsSync(file)) {
    bad(`missing ${relPath}`);
    return;
  }
  const text = readFileSync(file, 'utf8');
  for (const phrase of ['ทำไปเพื่ออะไร', 'ผ่านเมื่อ']) {
    if (!text.includes(phrase)) bad(`${relPath} missing “${phrase}”`);
  }
  // แล็บส่วนใหญ่ใช้หัว "แบบฝึกหัด" — โมดูล 05/10 ใช้ "## Part" และโมดูล 13 ใช้ขั้นตัวเลข "## N)" ตามดีไซน์
  if (!text.includes('แบบฝึกหัด') && !/^(## Part |## \d+\))/m.test(text)) {
    bad(`${relPath} missing “แบบฝึกหัด”`);
  }
  if (!/\d+\s*นาที/.test(text)) bad(`${relPath} missing expected minutes`);
  else note(`${relPath} has purpose, minutes, pass line`);
}

function courseShape() {
  for (const relPath of HANDS_ON) handsOnHas(relPath);
  for (const dir of MODULES) {
    const readme = path.join(repo, 'Lessons', dir, 'README.md');
    const lab = path.join(repo, 'Lessons', dir, 'LAB.md');
    if (!existsSync(readme)) bad(`missing Lessons/${dir}/README.md`);
    if (!existsSync(lab)) bad(`missing Lessons/${dir}/LAB.md`);
  }
  if (MODULES.every((dir) => existsSync(path.join(repo, 'Lessons', dir, 'README.md')) && existsSync(path.join(repo, 'Lessons', dir, 'LAB.md')))) {
    note('Lessons/01–13 each have README.md and LAB.md');
  }
  const feature = path.join(repo, 'Lessons', '11-feature', 'LAB.md');
  if (existsSync(feature) && !readFileSync(feature, 'utf8').includes('ย่อได้')) {
    bad('Module 11 must be marked ย่อได้');
  }
  const demo = path.join(repo, 'Lessons', '08-mcp', 'LAB.md');
  if (!existsSync(demo)) bad('missing Lessons/08-mcp/LAB.md');
  else if (!readFileSync(demo, 'utf8').includes('วิทยากร')) bad('MCP demo must say it is for the trainer');
  else note('MCP demo is marked as a trainer demo');

  const readme = existsSync(path.join(repo, 'README.md')) ? readFileSync(path.join(repo, 'README.md'), 'utf8') : '';
  if (!readme.includes('https://github.com/Onto-IQ/build-ai-multi-agent-hybrid')) {
    bad('README.md must link to build-ai-multi-agent-hybrid');
  }
  if (!readme.includes('https://github.com/Onto-IQ/multi-agent-workshop-hybrid')) {
    bad('README.md must link to multi-agent-workshop-hybrid');
  }
  if (readme.includes('github.com/Onto-IQ/build-ai-multi-agent-lab')) {
    bad('README.md still links to build-ai-multi-agent-lab');
  } else if (readme) note('README repo links point at hybrid + workshop');

  const csv = path.join(repo, 'solutions', 'data', 'dataset.clean.csv');
  if (!existsSync(csv)) bad('missing solutions/data/dataset.clean.csv');
  else {
    const lines = readFileSync(csv, 'utf8').split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length !== 16773) bad(`cleaned csv has ${lines.length} lines, want 16773`);
    else note('cleaned catch-up csv has 16,772 data rows');
  }

  const gitignore = existsSync(path.join(repo, '.gitignore')) ? readFileSync(path.join(repo, '.gitignore'), 'utf8') : '';
  if (!/(^|\n)\.env(\r?\n|$)/.test(gitignore)) bad('.gitignore must ignore .env');
  else note('.gitignore ignores .env');
}

function walkSecrets(dir, hits) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dataset.clean.csv') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSecrets(full, hits);
      continue;
    }
    if (!/\.(md|js|mjs|json|ps1|sh|example|css|html|txt)$/.test(entry.name) && entry.name !== '.env.example') continue;
    let text = '';
    try {
      if (statSync(full).size > 1_000_000) continue;
      text = readFileSync(full, 'utf8');
    } catch {
      continue;
    }
    const markers = [
      new RegExp(['sk-', 'ant-', '[A-Za-z0-9_-]{8,}'].join('')),
      new RegExp(['sk-', 'or-v1-'].join('')),
      new RegExp(['sk-', 'proj-'].join('')),
    ];
    if (markers.some((marker) => marker.test(text))) hits.push(path.relative(repo, full));
  }
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function portOpen(port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host: '127.0.0.1', port });
    const settle = (open) => {
      sock.destroy();
      resolve(open);
    };
    sock.setTimeout(400);
    sock.once('connect', () => settle(true));
    sock.once('error', () => settle(false));
    sock.once('timeout', () => settle(false));
  });
}

function get(port, route) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: route, timeout: 4000 }, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

function runNode(argsList, cwd, env) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, argsList, { cwd, env });
    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stdout += chunk;
    });
    child.on('close', (code) => resolve({ code, stdout }));
  });
}

async function commandVersion(bin, binArgs) {
  try {
    const result = await exec(bin, binArgs, { windowsHide: true });
    return `${result.stdout || ''}${result.stderr || ''}`.trim();
  } catch {
    return null;
  }
}

// Runs a live agent round trip (claude -p / opencode run) so the check proves
// login works, not just that the binary is installed. 45s cap per call.
function runProcess(bin, binArgs, cwd) {
  return new Promise((resolve) => {
    const child = spawn(bin, binArgs, { cwd: cwd || repo, windowsHide: true });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill('SIGKILL'), 45000);
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ code: 1, stdout, stderr: String(err) });
    });
  });
}

async function workshopChecks() {
  const { dir: workshop, source } = resolveWorkshopDir();
  if (!existsSync(path.join(workshop, 'server.js'))) {
    bad(`workshop not found at ${workshop} (from ${source}). Clone multi-agent-workshop-hybrid or set WORKSHOP_DIR.`);
    return;
  }
  note(`workshop project found at ${workshop}`);
  const parquet = path.join(workshop, 'data', 'raw', 'dbd-2558.parquet');
  const duck = path.join(workshop, 'data', 'warehouse.duckdb');
  if (existsSync(parquet) && existsSync(duck)) note('workshop has the real dataset');
  else bad('workshop data is incomplete (need data/raw/dbd-2558.parquet and data/warehouse.duckdb)');

  if (await portOpen(3000)) warn('port 3000 is in use. Stop that process or set PORT before npm start');
  else note('port 3000 is free');

  const appPort = await freePort();
  const server = spawn(process.execPath, ['server.js'], {
    cwd: workshop,
    env: { ...process.env, PORT: String(appPort) },
    stdio: 'ignore',
  });
  try {
    let status = 0;
    const deadline = Date.now() + 8000;
    while (Date.now() < deadline && status !== 200) {
      try {
        status = await get(appPort, '/');
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    if (status === 200) note(`app homepage responded on port ${appPort}`);
    else bad('app server did not serve /');
  } finally {
    if (server.exitCode === null) server.kill('SIGKILL');
  }

  const gatePort = await freePort();
  const gate = await runNode(['scripts/quality-gate.js'], workshop, { ...process.env, PORT: String(gatePort) });
  if (gate.code === 2 && gate.stdout.includes('FAIL | data-quality')) {
    note('starter quality gate exits 2 (intended starting state)');
  } else bad(`starter quality gate expected exit 2, got ${gate.code}`);
}

async function main() {
  console.log(`verify-setup (course) · ${repo}`);
  console.log(courseFiles ? 'mode · course-files' : 'mode · learner machine');

  courseShape();
  const secretHits = [];
  walkSecrets(repo, secretHits);
  if (secretHits.length > 0) bad(`possible API key in ${secretHits.join(', ')}`);
  else note('no Anthropic/OpenRouter key material in course text files');

  if (courseFiles) {
    if (problems.length > 0) {
      console.log(`verify-setup: ${problems.length} problem(s)`);
      process.exit(1);
    }
    console.log('verify-setup: passed (course-files)');
    return;
  }

  const nodeVersion = parseVersion(process.version);
  if (atLeast(nodeVersion, [20, 0, 0])) note(`node ${process.version}`);
  else bad(`node ${process.version} is below 20`);

  const gitText = await commandVersion('git', ['--version']);
  if (gitText) note(gitText);
  else bad('git is not on PATH');

  // Round trips run inside the workshop project when it exists — the same
  // context the labs use — so a passing login check means a passing lab login.
  const workshopDir = resolveWorkshopDir().dir;
  const promptCwd = existsSync(path.join(workshopDir, 'server.js')) ? workshopDir : repo;

  if (skipClaude) warn('skipped Claude Code checks');
  else {
    const claudeText = await commandVersion('claude', ['--version']);
    const claudeVersion = parseVersion(claudeText || '');
    if (!claudeText) bad('claude is not on PATH. Install @anthropic-ai/claude-code and log in with the class account.');
    else if (!atLeast(claudeVersion, [2, 1, 296])) bad(`${claudeText.split('\n')[0]} is below 2.1.296. Run: claude update`);
    else {
      note(claudeText.split('\n')[0]);
      if (skipClaudePrompt) warn('skipped claude -p round trip (--skip-claude-prompt)');
      else {
        const prompt = await runProcess('claude', ['-p', 'Reply with exactly: CLAUDE-OK'], promptCwd);
        if (prompt.code === 0 && prompt.stdout.includes('CLAUDE-OK')) note('claude -p returned CLAUDE-OK');
        else bad('claude -p did not return CLAUDE-OK. Log in with claude, and unset ANTHROPIC_API_KEY if it overrides the class login.');
      }
    }
  }

  if (skipOpencode) warn('skipped OpenCode checks');
  else {
    const opencodeText = await commandVersion('opencode', ['--version']);
    if (!opencodeText) bad('opencode is not on PATH. See SETUP.md');
    else {
      note(opencodeText.split('\n')[0]);
      if (skipOpencodePrompt) warn('skipped opencode run round trip (--skip-opencode-prompt)');
      else {
        const prompt = await runProcess('opencode', ['run', 'Reply with exactly: OC-OK'], promptCwd);
        if (prompt.code === 0 && prompt.stdout.includes('OC-OK')) note('opencode run returned OC-OK');
        else bad('opencode run did not return OC-OK. Check the OpenRouter key and login steps in SETUP.md.');
      }
    }
  }

  const anthropic = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (anthropic) bad('ANTHROPIC_API_KEY is set. Unset it so the class Claude login is used. Do not put this key on Vercel.');
  else note('ANTHROPIC_API_KEY is empty');

  if (skipOpenrouter) warn('skipped OpenRouter key check');
  else {
    const key = (process.env.OPENROUTER_API_KEY || '').trim();
    if (!key) bad('OPENROUTER_API_KEY is empty. Set the key from the training center in your user environment. Never commit it.');
    else if (/^sk-or-/.test(key) || key.length >= 20) note(`OPENROUTER_API_KEY is set (${key.length} characters, value hidden)`);
    else bad('OPENROUTER_API_KEY looks too short. Paste the key from the training center again.');
  }

  const duckText = await commandVersion('duckdb', ['--version']);
  if (duckText) note(`duckdb ${duckText.split('\n')[0]}`);
  else warn('duckdb is not on PATH. Install it before Lab 05 (see SETUP.md). Until then this is a warning.');

  const uvText = await commandVersion('uvx', ['--version']);
  if (uvText) note(`uvx ${uvText.split('\n')[0]}`);
  else warn('uvx is not on PATH. Only the trainer MCP demo needs it.');

  const vercelText = await commandVersion('vercel', ['--version']);
  if (vercelText && /\d+\.\d+/.test(vercelText)) note(`vercel ${vercelText.split('\n')[0]}`);
  else warn('vercel is not on PATH yet. Day-1 homework can pass without it. Lab 11 uses npx vercel. Create a Vercel Hobby account before day 2.');

  if (!skipWorkshop) await workshopChecks();
  else warn('skipped workshop app checks');

  if (problems.length > 0) {
    console.log(`verify-setup: ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log('verify-setup: passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
