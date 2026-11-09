# Agents — คลาสไฮบริด Registry Insight

ใช้คู่กับ Claude Code และ OpenCode อ่านไฟล์นี้ใน repo บทเรียนเพื่อรู้ว่าใครทำอะไร ไม่ได้สั่งให้สร้างผู้ช่วยใน repo นี้

ผู้ช่วยที่ผู้เรียนสร้าง อยู่ใน repo แอป (`multi-agent-workshop-hybrid`) ใต้ `.claude/agents/` หรือ `.opencode/agents/`

## ใครใช้อะไร

บทบาทที่ลงมือแก้ของ อยู่เครื่องมือเดียว ประสานด้วยไฟล์ในโฟลเดอร์แอป (`docs/`, `server.js`, ข้อมูล) ไม่สร้างคนทำงานชื่อเดียวกันทั้งสองฝั่ง — Module 04 ให้คนละบทบาทตามสายงาน: Claude สร้าง `data-researcher` ตัวอ่านสืบค้น, OpenCode สร้าง `planner` ตัววางแผนสายการผลิต และ Module 05 เพิ่ม `developer` ฝั่ง Claude ที่เรียกแบบทีมสามสาย (แผนจาก OpenCode ส่งต่อด้วย `docs/TASKS.md`)

| บทบาท | เครื่องมือ | โมดูล | เขียนอะไร |
|---|---|---|---|
| explore (หลายคนพร้อมกัน) | Claude Code | 03 | `docs/EXPLORATION-REPORT.md` เท่านั้น |
| `data-researcher` | Claude Code | 04 | ไม่เขียนไฟล์แอป อ้าง `ไฟล์:บรรทัด` |
| `planner` | OpenCode | 04 สร้าง · 05 ใช้ | เขียนได้เฉพาะ `docs/TASKS.md` |
| เส้นสิทธิ์ | ทั้งคู่ | 04 (พาร์ตรั้วท้าย LAB.md) | ไฟล์ตั้งค่าที่ห้าม `git push` และห้ามแก้ด่าน |
| `developer` + teammates data/backend/frontend | Claude Code | 05 | `docs/DESIGN.md`, SQL, ส่วนสรุปใน `server.js`, หน้าเว็บ |
| `qa` แล้วคนแก้ | Claude Code | 06 | รายงาน QA และจุดที่ด่านยังแดง จนครบ 6/6 |
| `release-checklist` skill + `release-manager` | Claude Code | 07 | skill + เอเจนต์ที่ preload skill — ผล PASS/FAIL ส่งต่อ M13 |
| MCP DuckDB อ่านอย่างเดียว | Claude Code | 08 | `.mcp.json` + `scripts/analysis.sql` + `docs/ANALYSIS.md` |
| hook และงบ | Claude Code เป็นหลัก, OpenCode ใช้เส้นสิทธิ์ | 09 | hook, `cost-gate`, ไม่แก้ตัวด่าน |
| ความจำข้ามรอบ | OpenCode | 10 | `docs/MEMORY.md` |
| ฟีเจอร์ของตัวเอง | เลือกเอง | 11 ย่อได้ | ฟีเจอร์ 1 ชิ้น ด่านยังเขียว |
| planner, data-researcher, developer, qa | Claude Code | 12 | ของปิดงาน |
| `synthesizer` | OpenCode | 12 | สรุปผู้บริหารภาษาไทย ไม่เกิน 400 คำ |
| คนสั่ง Vercel CLI | เครื่องมือที่ถนัด | 13 | `vercel.json` และ `api/` ที่โน้ตอ่านอย่างเดียว |

ไม่มีบทบาท Flux และไม่มีใบคัมบัง

## สิทธิ์ที่ทุกบทบาทต้องเคารพ

- อ่านทั้งแอปได้
- ห้ามแก้ `scripts/quality-gate.js`
- ห้าม `git push` เอง เว้นแต่ผู้เรียนสั่งหลังดู diff แล้ว
- ห้ามอ่านหรือคัดลอกค่าที่ขึ้นต้นด้วย `sk-`
- ห้ามเพิ่ม dependency ของแอป
- ก่อนบอกว่าเสร็จ รัน `npm run gate` แล้วรายงาน exit code จริง
- บน Vercel ห้ามเขียนไฟล์โน้ต และห้ามตั้ง `ANTHROPIC_API_KEY` หรือ `OPENROUTER_API_KEY`

## เมื่อไม่มี Node

1. บันทึกว่า `NODE_MISSING`
2. เสนอคำสั่งใน `SETUP.md`
3. ถามคนก่อนติดตั้ง
4. ติดตั้งแล้วค่อยรันสคริปต์ตรวจซ้ำ

ห้ามข้ามด่านแล้วบอกว่าผ่าน
