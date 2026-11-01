# Agents — Registry Insight (hybrid class)

The app is this folder. Lessons and answer packs live in the other repo. Do not copy them here.

## Who uses which tool

| Role | Tool | Writes |
|---|---|---|
| Explore / planner / developer / qa | Claude Code | Reports, fixes that close the quality gate, skills |
| data-researcher (also on Claude) | Both, different files | Read-only notes with `file:line` |
| Sequential data, backend, frontend tracks | OpenCode | `docs/TASKS.md`, SQL, summary code, page |
| synthesizer | OpenCode | `docs/EXECUTIVE-SUMMARY.md` (Thai, at most 400 words) |

Do not create the same agent name as a worker on both tools. A read-only `data-researcher` may exist on both so the class can compare them.

## Rules

- Reply in the language of the question. Keep file names, endpoints, and field names in English.
- Exploration does not edit files.
- Do not add npm dependencies for the app.
- Do not edit `scripts/quality-gate.js`.
- Do not print or copy values that start with `sk-`.
- Before saying work is done, run `npm run gate` and report the real exit code.
- Notes on your laptop are stored in `data/notes.json` so they survive a restart.
- Notes on Vercel are read-only. Serverless disks do not keep file writes. Do not add `ANTHROPIC_API_KEY` or `OPENROUTER_API_KEY` to Vercel.
- OpenCode reads `OPENROUTER_API_KEY` from the environment. `ANTHROPIC_API_KEY` stays empty so the class Claude login is not replaced.
- Do not add `vercel.json` or an `api/` folder before Lab 11. Learners build those during deploy.
