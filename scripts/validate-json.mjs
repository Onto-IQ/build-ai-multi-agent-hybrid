import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const requestedFiles = process.argv.slice(2);
const jsonFiles = [];

const common = ['schema_version', 'project_id', 'generated_by', 'generated_at', 'source_mode'];

const contractChecks = {
  handoff: [...common, 'from_role', 'from_tool', 'to_role', 'to_tool', 'status', 'notes', 'files_touched'],
  'audit-result': [...common, 'status', 'round', 'quality_check', 'cost_check', 'violations', 'recommended_action', 'max_refinement_rounds', 'gate_passed'],
  'synthesize-report': [...common, 'status', 'summary_path', 'word_limit', 'tool', 'notes'],
  'capstone-ship': [...common, 'public_url', 'deploy_target', 'gate_status', 'notes_mode', 'anthropic_key_on_vercel', 'cost_note'],
};

function validateContractShape(file, parsed) {
  if (path.basename(path.dirname(file)) !== 'contracts') return;
  const base = path.basename(file, '.json').replace(/\.example$/, '');
  const required = contractChecks[base];
  if (!required) return;
  for (const key of required) {
    if (!(key in parsed)) throw new Error(`missing required field: ${key}`);
  }
  if (parsed.project_id !== 'registry-insight') {
    throw new Error('project_id must be registry-insight');
  }
  if (!['mock', 'cache', 'hybrid', 'api', 'manual'].includes(parsed.source_mode)) {
    throw new Error('source_mode must be mock|cache|hybrid|api|manual');
  }
  if (base === 'handoff' && (!Array.isArray(parsed.files_touched) || parsed.files_touched.length < 1)) {
    throw new Error('files_touched must list at least one file');
  }
  if (base === 'audit-result' && !['PASS', 'FAIL'].includes(parsed.status)) {
    throw new Error('status must be PASS or FAIL');
  }
  if (base === 'audit-result' && parsed.status === 'FAIL' && (!Array.isArray(parsed.violations) || parsed.violations.length === 0)) {
    throw new Error('FAIL audit must include at least one violation');
  }
  if (base === 'synthesize-report') {
    if (typeof parsed.word_limit !== 'number' || parsed.word_limit > 400) {
      throw new Error('word_limit must be a number no higher than 400');
    }
    if (parsed.tool !== 'OpenCode') throw new Error('synthesizer tool must be OpenCode');
  }
  if (base === 'capstone-ship') {
    if (!String(parsed.public_url).startsWith('http')) throw new Error('public_url must start with http');
    if (!String(parsed.deploy_target).toLowerCase().includes('vercel')) throw new Error('deploy_target must be Vercel');
    if (parsed.notes_mode !== 'readonly') throw new Error('notes_mode must be readonly');
    if (parsed.anthropic_key_on_vercel !== false) throw new Error('anthropic_key_on_vercel must be false');
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.json')) jsonFiles.push(full);
  }
}

if (requestedFiles.length > 0) {
  for (const requested of requestedFiles) {
    const full = path.resolve(repoRoot, requested);
    if (!fs.existsSync(full)) {
      console.error(`FAIL ${requested}: file not found`);
      process.exitCode = 1;
      continue;
    }
    if (!full.endsWith('.json')) {
      console.error(`FAIL ${requested}: expected a .json file`);
      process.exitCode = 1;
      continue;
    }
    jsonFiles.push(full);
  }
} else {
  walk(path.join(repoRoot, 'reference', 'contracts'));
  walk(path.join(repoRoot, 'workspace', 'contracts'));
}

let failed = false;
for (const file of jsonFiles) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('root must be an object');
    validateContractShape(file, parsed);
    console.log(`PASS ${path.relative(repoRoot, file)}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${path.relative(repoRoot, file)}: ${error.message}`);
  }
}

if (jsonFiles.length === 0) {
  console.error('FAIL no contract json files found');
  failed = true;
}

if (failed) process.exitCode = 1;
else console.log('All checks passed.');
