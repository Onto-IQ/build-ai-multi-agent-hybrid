'use strict';

const fs = require('fs');
const path = require('path');

const dropIn = path.join(__dirname, 'drop-in');
let failed = 0;
function check(label, pass) {
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label}`);
  if (!pass) failed += 1;
}

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const fence = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!fence) return null;
  const meta = {};
  for (const line of fence[1].split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (match) meta[match[1]] = match[2].trim();
  }
  return meta;
}

function callHandler(handler, method) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 0,
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value;
      },
      end(payload) {
        resolve({ status: this.statusCode, body: JSON.parse(payload) });
      },
    };
    handler({ method }, res);
  });
}

async function main() {
  const summary = fs.readFileSync(path.join(dropIn, 'docs', 'EXECUTIVE-SUMMARY.md'), 'utf8');
  for (const phrase of ['45,341,868,784', '16,772', 'กรุงเทพมหานคร', '## ภาพรวมทุนจดทะเบียน', '## ข้อเสนอแนะ']) {
    check(`summary contains ${phrase}`, summary.includes(phrase));
  }
  const words = summary.split(/\s+/).filter(Boolean).length;
  check(`summary stays within 400 whitespace-separated words (${words})`, words <= 400);

  for (const role of ['data-researcher', 'planner', 'developer', 'qa']) {
    const meta = frontmatter(path.join(dropIn, '.claude', 'agents', `${role}.md`));
    check(`claude agent ${role}`, Boolean(meta && meta.name === role && meta.tools));
  }
  const synth = fs.readFileSync(path.join(dropIn, '.opencode', 'agents', 'synthesizer.md'), 'utf8');
  check('OpenCode synthesizer owns the summary', synth.includes('EXECUTIVE-SUMMARY.md') && synth.includes('400'));

  const vercel = fs.readFileSync(path.join(dropIn, 'vercel.json'), 'utf8');
  check('vercel.json serves summary, health, and notes', ['api/summary.js', 'api/health.js', 'api/notes.js', 'dataset.csv'].every((part) => vercel.includes(part)));
  const keyPattern = new RegExp(['ANTHROPIC|OPENROUTER|', 'sk-', 'ant-|', 'sk-', 'or-'].join(''));
  check('vercel.json has no model keys', !keyPattern.test(vercel));

  const notesSrc = fs.readFileSync(path.join(dropIn, 'api', 'notes.js'), 'utf8');
  const notesCode = notesSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  check('notes function does not write files', !/writeFile|appendFile|createWriteStream/.test(notesCode));
  const notes = require(path.join(dropIn, 'api', 'notes.js'));
  const health = require(path.join(dropIn, 'api', 'health.js'));
  const got = await callHandler(notes, 'GET');
  const posted = await callHandler(notes, 'POST');
  const healthBody = await callHandler(health, 'GET');
  check('GET notes is a readonly demo', got.status === 200 && got.body.mode === 'readonly' && Array.isArray(got.body.notes));
  check('POST notes is refused', posted.status === 405 && posted.body.error === 'NOTES_READONLY');
  check('health has no secret', healthBody.status === 200 && healthBody.body.ok === true && !JSON.stringify(healthBody.body).includes('sk-'));

  if (failed > 0) process.exit(1);
  console.log('w9 check: passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
