'use strict';

/**
 * Resolves the Registry Insight app folder (multi-agent-workshop).
 *
 * Precedence:
 *   1. process.env.WORKSHOP_DIR
 *   2. course-root .env.local
 *   3. course-root .env
 *   4. class default — Windows: C:\dev\multi-agent-workshop
 *      macOS/Linux: ~/dev/multi-agent-workshop
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const courseRoot = path.join(__dirname, '..');

function defaultWorkshopDir() {
  if (process.platform === 'win32') return 'C:\\dev\\multi-agent-workshop';
  return path.join(os.homedir(), 'dev', 'multi-agent-workshop');
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  /** @type {Record<string, string>} */
  const out = {};
  const text = fs.readFileSync(filePath, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"'))
      || (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function resolveWorkshopDir() {
  const fromEnv = (process.env.WORKSHOP_DIR || '').trim();
  if (fromEnv) return { dir: path.resolve(fromEnv), source: 'env' };

  const local = loadEnvFile(path.join(courseRoot, '.env.local'));
  if ((local.WORKSHOP_DIR || '').trim()) {
    return { dir: path.resolve(local.WORKSHOP_DIR.trim()), source: 'env.local' };
  }

  const file = loadEnvFile(path.join(courseRoot, '.env'));
  if ((file.WORKSHOP_DIR || '').trim()) {
    return { dir: path.resolve(file.WORKSHOP_DIR.trim()), source: '.env' };
  }

  return { dir: defaultWorkshopDir(), source: 'default' };
}

module.exports = {
  defaultWorkshopDir,
  resolveWorkshopDir,
};
