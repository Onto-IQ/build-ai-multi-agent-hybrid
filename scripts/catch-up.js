#!/usr/bin/env node
'use strict';

/**
 * Copies a reference pack into the workshop app so a learner who fell behind
 * can continue. Run from the course repo:
 *   node scripts/catch-up.js w4
 *
 * Packs w7 and w9 also install the cleaned dataset (16,772 rows).
 * That file replaces data/dataset.csv in the workshop. Do not use it if you
 * still want to clean the raw file yourself.
 */

const fs = require('fs');
const path = require('path');
const { resolveWorkshopDir } = require('./workshop-dir');

const pack = process.argv[2];
const known = ['init', 'w1', 'w2', 'perm', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'];
const root = path.join(__dirname, '..');
const { dir: dest, source } = resolveWorkshopDir();

if (!known.includes(pack)) {
  console.error(`usage: node scripts/catch-up.js <${known.join('|')}>`);
  process.exit(2);
}

console.log(`catch-up: target workshop = ${dest} (from ${source})`);

if (!fs.existsSync(path.join(dest, 'server.js'))) {
  console.error(`catch-up: workshop project not found at ${dest}`);
  console.error('Clone https://github.com/Onto-IQ/multi-agent-workshop-hybrid into the class path, or set WORKSHOP_DIR.');
  process.exit(1);
}

const src = path.join(root, 'solutions', pack, 'drop-in');
if (!fs.existsSync(src)) {
  if (pack === 'w8') {
    console.log('catch-up: w8 has no drop-in. The feature is yours.');
    console.log('Read solutions/w8/FEATURE-CRITERIA.md');
    process.exit(0);
  }
  console.error(`catch-up: missing solutions/${pack}/drop-in`);
  process.exit(1);
}

fs.cpSync(src, dest, { recursive: true });
console.log(`catch-up: copied solutions/${pack}/drop-in → ${dest}`);

if (pack === 'w7' || pack === 'w9') {
  const csv = path.join(root, 'solutions', 'data', 'dataset.clean.csv');
  const target = path.join(dest, 'data', 'dataset.csv');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(csv, target);
  console.log('catch-up: installed cleaned data/dataset.csv (16,772 rows).');
}

const lab = {
  init: 'Module 02',
  w1: 'Module 03',
  w2: 'Module 04',
  perm: 'Module 04 permissions',
  w3: 'Module 05',
  w4: 'Module 06',
  w5: 'Module 07 and Module 10',
  w6: 'Module 08 MCP demo (trainer)',
  w7: 'Module 09',
  w8: 'Module 11',
  w9: 'Module 12 and Module 13',
}[pack];
console.log(`catch-up: this pack matches ${lab}. Read solutions/${pack}/SOLUTION.md`);
