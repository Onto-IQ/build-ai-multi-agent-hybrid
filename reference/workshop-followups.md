# สถานะรายการแก้แอป — multi-agent-workshop-hybrid

แอปของห้องนี้อยู่ที่ https://github.com/Onto-IQ/multi-agent-workshop-hybrid

repo แอปของคอร์ส Claude อย่างเดียว (ชื่อเดิมที่ไม่มี `-hybrid`) ยังเป็นของคลาสนั้น ห้าม push และห้ามเปิด PR ใส่ repo นั้น

รายการด้านล่างตรงกับสาขาแอปของคลาสไฮบริด ถ้า `main` ของ repo นั้นยังมีแค่ README ให้รอพีอาร์ของแอปเข้า `main` ก่อนแจกคำสั่ง clone ผู้เรียนต้องได้ `server.js` โดยที่รากโปรเจกต์ยังไม่มี `vercel.json` และไม่มีโฟลเดอร์ `api/`

ชุดเริ่มยังเป็นจุดเริ่มตามดีไซน์: `npm start` เปิดได้, `npm run gate` แดง 0/6, ข้อมูลจริงอยู่ครบ ชุดปิดงานใน `solutions/w9` ของ repo บทเรียนวางทับแล้วด่านขึ้น 6/6

## ทำแล้วในแอป

1. `package.json` เป็น Registry Insight ไม่ใช่ชื่อผลิตภัณฑ์เก่า
2. `CLAUDE.md` และ `AGENTS.md` ใช้กติกาชุดเดียวกัน โน้ตบนเครื่องเขียนลง `data/notes.json` และบน Vercel (`process.env.VERCEL`) เป็นอ่านอย่างเดียว ห้ามเขียนไฟล์
3. มี `scripts/check-machine.sh`, `scripts/check-machine.ps1` และ `scripts/verify-setup.mjs` ตรวจ Claude Code, OpenCode, Node และ DuckDB ยืนยันว่า `OPENROUTER_API_KEY` ถูกตั้งโดยไม่พิมพ์ค่า และ `ANTHROPIC_API_KEY` ว่าง
4. ชุดเริ่มไม่มี `vercel.json` และไม่มีโฟลเดอร์ `api/` ทางขึ้นของจริงคือ `api/*.js` ที่ผู้เรียนสร้างใน Lab 11 `server.js` ฟังที่ `127.0.0.1` และแยกเส้นทางให้ย้ายไปเป็นฟังก์ชันได้ วิธีแนบ CSV ประมาณ 8 MB ผ่าน `includeFiles` อยู่ที่ `reference/vercel/`
5. ข้อความ error ของด่านพูดถึง `dataset.csv`
6. หน้าแรกมีช่องโน้ต และบอกว่าของจริงอ่านอย่างเดียว

`opencode.json` มากับแอป พร้อมคอมเมนต์ว่ารูปแบบ permission เปลี่ยนตามรุ่น OpenCode คีย์เป็น `{env:OPENROUTER_API_KEY}` เท่านั้น

## ยังต้องคงไว้

- อย่าทำให้ด่าน `notes-persists` หลวมลง เครื่องผู้เรียนยังต้องเซฟโน้ตลง `data/notes.json`
- อย่าใส่คีย์โมเดลหรือไฟล์ `.env` ที่มีค่าจริง
- อย่าใส่ `.mcp.json` มาในชุดวันแรก วิทยากรสาธิต MCP เอง
- ผู้เรียนสร้าง `vercel.json` และ `api/` เองใน Lab 11 อย่าเอาไฟล์จาก `reference/vercel/` ขึ้นรากโปรเจกต์ก่อนแล็บนั้น

## ของที่แล็บสั่งให้ผู้ช่วยสร้างเพิ่มในแอป

- รายงาน แผน SQL และผู้ช่วย ตาม Lab 02–10 (`AGENTS.md` มีมากับแอปแล้ว Lab 01 ให้ทบทวนและเติม)
- `vercel.json`, `api/summary.js`, `api/health.js`, `api/notes.js` ที่ POST ตอบ 405 และไม่มี `writeFile`
- หน้าเว็บที่ดึงโน้ตแบบ GET อย่างเดียวบนของจริง
