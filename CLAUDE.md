# บทเรียน Hybrid — Registry Insight

repo นี้คือบทเรียนของคลาส **Build AI Multi-Agent Using Claude Code and OpenCode** (12–13 พ.ย. 2026, 9Expert)

แอปที่ผู้เรียนสั่งผู้ช่วยอยู่ที่ https://github.com/Onto-IQ/multi-agent-workshop ไม่ใช่โฟลเดอร์นี้ โฟลเดอร์นี้มีเฉลยใน `solutions/` อย่าเปิด `claude` หรือ `opencode` ที่นี่เพื่อทำการบ้าน

## ลำดับสองวัน

เช็กเครื่อง → รู้จักแอป → สำรวจ → ผู้เชี่ยวชาญสองฝั่ง → ล็อกสิทธิ์ → สายการผลิตบน OpenCode → Claude ปิดด่าน 6/6 → กันความเสี่ยงและงบ → เช็กลิสต์กับความจำ → ฟีเจอร์ของตัวเอง (ย่อได้) → สรุปผู้บริหาร → Vercel

## เครื่องมือ ไม่ทับงานกัน

| งาน | เครื่องมือ |
|---|---|
| สำรวจพร้อมกัน, ปิดด่าน 6/6, เช็กลิสต์ปล่อยของ, บทบาท planner / developer / qa ในวันปิดงาน | Claude Code บัญชีของศูนย์ฝึก |
| สายการผลิตข้อมูล-หลังบ้าน-หน้าเว็บ, ความจำข้ามรอบ, สรุปผู้บริหาร | OpenCode ผ่าน OpenRouter |
| สาธิต MCP | วิทยากรเท่านั้น |

รายละเอียดบทบาทอยู่ใน `AGENTS.md`

## กติกา

1. ห้าม commit `.env` หรือค่า `OPENROUTER_API_KEY` / `ANTHROPIC_API_KEY`
2. `ANTHROPIC_API_KEY` ต้องว่างระหว่างเรียน เพื่อให้บัญชี Claude ของคลาสทำงาน
3. ห้ามใส่คีย์โมเดลบน Vercel
4. โน้ตบนเครื่องเขียนลงไฟล์เพื่อผ่านด่าน โน้ตบน Vercel เป็นอ่านอย่างเดียว เพราะดิสก์ serverless ไม่ถาวร
5. ห้ามบอกว่า deploy สำเร็จถ้ายังไม่มี URL จริงที่ขึ้นต้นด้วย `http`
6. ด่านของแอปคือ `npm run gate` ใน repo แอป ต้องไปให้ถึง 6/6 ห้ามแก้ `scripts/quality-gate.js`
7. Runtime ของสคริปต์บทเรียนคือ Node 20 ขึ้นไป ถ้าไม่มี Node ให้เสนอคำสั่งใน `SETUP.md` แล้วถามคนก่อนติดตั้ง
8. ไม่ใช้ Flux, Hostinger หรือ Coolify ในคลาสนี้

## สคริปต์

- การบ้าน: `scripts/readiness-check.ps1` หรือ `scripts/readiness-check.sh`
- โครงบทเรียน: `node scripts/verify-setup.mjs --course-files`
- ชุดอ้างอิง: `node scripts/check-solutions.mjs`
- สัญญาตัวอย่าง: `node shared/scripts/validate-json.mjs`
- รวมด่านบทเรียน: `node shared/scripts/gate-quality.mjs`

ตามให้ทัน: `node scripts/catch-up.js <รหัสชุด>` จาก repo นี้ ปลายทางคือโฟลเดอร์แอป
