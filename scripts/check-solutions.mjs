#!/usr/bin/env node
/**
 * Static checks for every reference pack. Does not need the workshop clone.
 *
 *   node scripts/check-solutions.mjs
 *   node scripts/check-solutions.mjs --live
 *
 * --live also overlays solutions/w9 on WORKSHOP_DIR and expects quality gate 6/6,
 * and expects the untouched starter gate to exit 2.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, cp, copyFile, rm } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { resolveWorkshopDir } = require('./workshop-dir.js');

const repo = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const live = process.argv.includes('--live');
const packs = ['init', 'w1', 'w2', 'perm', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'];

function run(script, args, options) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [script, ...args], options);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
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

async function liveGate() {
  const { dir: workshop, source } = resolveWorkshopDir();
  console.log(`check-solutions --live: workshop = ${workshop} (from ${source})`);
  if (!existsSync(path.join(workshop, 'server.js'))) {
    console.error('FAIL | --live needs the workshop repo (set WORKSHOP_DIR)');
    process.exit(1);
  }

  const starterPort = await freePort();
  const starter = await run(path.join(workshop, 'scripts', 'quality-gate.js'), [], {
    cwd: workshop,
    env: { ...process.env, PORT: String(starterPort) },
  });
  const starterOk = starter.code === 2 && starter.stdout.includes('FAIL | data-quality');
  if (!starterOk) {
    console.log(starter.stdout);
    console.error(`FAIL | starter gate expected exit 2, got ${starter.code}`);
    process.exit(1);
  }
  console.log('PASS | starter quality gate exits 2');

  const tmp = await mkdtemp(path.join(os.tmpdir(), 'registry-live-'));
  try {
    await cp(workshop, tmp, { recursive: true });
    await cp(path.join(repo, 'solutions', 'w9', 'drop-in'), tmp, { recursive: true });
    await copyFile(
      path.join(repo, 'solutions', 'data', 'dataset.clean.csv'),
      path.join(tmp, 'data', 'dataset.csv')
    );
    const port = await freePort();
    const gate = await run(path.join(tmp, 'scripts', 'quality-gate.js'), [], {
      cwd: tmp,
      env: { ...process.env, PORT: String(port) },
    });
    if (gate.code !== 0 || !gate.stdout.includes('quality gate: 6/6 passed')) {
      console.log(gate.stdout);
      console.error(`FAIL | w9 overlay gate exit ${gate.code}`);
      process.exit(1);
    }
    console.log('PASS | w9 overlay quality gate 6/6');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

async function main() {
  for (const pack of packs) {
    const script = path.join(repo, 'solutions', pack, 'check.js');
    const result = await run(script, [], { cwd: repo });
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    if (result.code !== 0) {
      console.error(`${pack} check failed with exit ${result.code}`);
      process.exit(result.code || 1);
    }
  }
  console.log('PASS | solution packs init, w1–w9, perm');
  if (live) await liveGate();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
