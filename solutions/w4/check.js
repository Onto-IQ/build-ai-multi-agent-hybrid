#!/usr/bin/env node
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const dropIn = path.join(__dirname, 'drop-in');
let ok = true;
function check(label, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${label}`);
  if (!cond) ok = false;
}

function request(port, method, route, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: route, method, timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
    if (body) req.write(body);
    req.end();
  });
}

function boot(tmp, port) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], {
      cwd: tmp,
      env: { ...process.env, PORT: String(port) },
      stdio: 'ignore',
    });
    const deadline = Date.now() + 8000;
    const poke = setInterval(() => {
      request(port, 'GET', '/api/health')
        .then((res) => {
          if (res.status === 200) {
            clearInterval(poke);
            resolve(child);
          }
        })
        .catch(() => {});
      if (Date.now() > deadline) {
        clearInterval(poke);
        child.kill('SIGKILL');
        reject(new Error('server boot timeout'));
      }
    }, 150);
  });
}

async function main() {
  const report = fs.readFileSync(path.join(dropIn, 'docs', 'QA-REPORT.md'), 'utf8');
  check('QA report names the three starter bugs', /notes|health|sk-/.test(report));
  const qa = fs.readFileSync(path.join(dropIn, '.claude', 'agents', 'qa.md'), 'utf8');
  check('qa agent can run commands', /tools:.*Bash/.test(qa));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-w4-'));
  fs.cpSync(dropIn, tmp, { recursive: true });
  fs.mkdirSync(path.join(tmp, 'lib'), { recursive: true });
  fs.copyFileSync(
    path.join(__dirname, '..', 'w9', 'drop-in', 'lib', 'csv.js'),
    path.join(tmp, 'lib', 'csv.js')
  );
  fs.mkdirSync(path.join(tmp, 'data'), { recursive: true });
  const port = 3400 + Math.floor(Math.random() * 800);
  let server = await boot(tmp, port);
  try {
    const bad = await request(port, 'POST', '/api/notes', 'not-json');
    check('bad JSON does not crash', bad.status === 400);
    const health = await request(port, 'GET', '/api/health');
    check('health stays up', health.status === 200);
    check('health has no sk- value', !health.body.includes('sk-'));
    const nope = await request(port, 'POST', '/api/notes', JSON.stringify({ nope: 1 }));
    check('missing text is rejected', nope.status === 400);
    const mark = `w4-check-${Date.now()}`;
    const stored = await request(port, 'POST', '/api/notes', JSON.stringify({ text: mark }));
    check('a real note is stored', stored.status === 201);
    server.kill('SIGKILL');
    await new Promise((resolve) => setTimeout(resolve, 300));
    server = await boot(tmp, port);
    const after = await request(port, 'GET', '/api/notes');
    check('note survives a restart', after.status === 200 && after.body.includes(mark));
  } finally {
    if (server && server.exitCode === null) server.kill('SIGKILL');
  }

  console.log(ok ? 'w4 check: passed' : 'w4 check: failed');
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
