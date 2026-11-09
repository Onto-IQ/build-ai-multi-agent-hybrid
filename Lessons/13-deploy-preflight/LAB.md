# Module 13 — ให้คนอื่นเปิดดูได้บน Vercel

**ทำไปเพื่ออะไร:** ส่งงานออกไปเป็นลิงก์จริง ไม่จบแค่บนเครื่องตัวเอง

| เวลา | เครื่องมือ |
|---|---|
| **40 นาที** | สั่ง Vercel CLI ผ่าน prompt ของ Claude หรือ OpenCode |

ต้องมีบัญชี Vercel แผน Hobby ที่สมัครไว้แล้ว ทำในโฟลเดอร์แอป

## ทำไมโน้ตบนของจริงต้องอ่านอย่างเดียว

บนเครื่องคุณ เซิร์ฟเวอร์เขียนโน้ตลง `data/notes.json` ด่านข้อ `notes-persists` ถึงได้ผ่าน เพราะปิดโปรแกรมแล้วเปิดใหม่ โน้ตยังอยู่

Vercel รันเป็นฟังก์ชันสั้น ๆ ดิสก์ไม่ได้รับปากว่าจะอยู่ถึงคำขอถัดไป ถ้าเขียนไฟล์บนนั้น โน้ตจะหาย หรือคำสั่งเขียนจะล้ม ทั้งที่แชทบอกว่าเซฟแล้ว

ของที่ขึ้นจริงจึงทำแบบนี้:

- หน้าแดชบอร์ดและ `/api/summary` อ่านไฟล์ข้อมูลที่แนบไปกับรอบ deploy
- `/api/health` ตอบแค่ `{ "ok": true }` ไม่มีค่าที่ขึ้นต้น `sk-`
- `/api/notes` ตอบตัวอย่างแบบอ่านอย่างเดียว และปฏิเสธการบันทึกใหม่ (รหัส 405) โดยไม่มี `writeFile`
- ไม่ใส่ `ANTHROPIC_API_KEY` หรือ `OPENROUTER_API_KEY` เป็นตัวแปรบน Vercel ค่าโมเดลอยู่ที่เครื่องที่รัน Claude และ OpenCode เท่านั้น

## ก่อนเริ่ม

`npm run gate` เป็น 6/6 บัญชี Vercel ล็อกอินในเบราว์เซอร์แล้ว เลือกแผน Hobby ไม่ใช่ Pro

## แบบฝึกหัด

### 1. ตรวจบนเครื่องก่อน

ปิด `npm start` แล้วรัน:

```powershell
npm run gate
```

ต้องเป็น `quality gate: 6/6 passed`

เปิดอีกเทอร์มินัล:

```powershell
$env:PORT = 3001; npm start
```

Mac: `PORT=3001 npm start`

อีกช่องหนึ่ง:

```powershell
(Invoke-RestMethod http://127.0.0.1:3001/api/health | ConvertTo-Json -Compress) -match 'sk-'
```

Mac: `curl -s http://127.0.0.1:3001/api/health | grep -c 'sk-' || true` ต้องไม่พบ `sk-`

ปิดเซิร์ฟเวอร์ด้วย Ctrl+C

```powershell
echo $env:ANTHROPIC_API_KEY
```

Mac: `echo "$ANTHROPIC_API_KEY"` ต้องว่าง

ถ้าทำ Module 07 มาแล้ว จะเรียก `@release-manager` รัน release checklist ซ้ำก่อนย้ายไปขั้น 2 ก็ได้ — ผลต้อง PASS ทุกข้อจึงมีสิทธิ์ deploy

### 2. ล็อกอิน CLI ยังไม่ deploy

เปิด `claude` หรือ `opencode` ที่โฟลเดอร์แอป วาง:

```text
เตรียมล็อกอิน Vercel CLI สำหรับ repo นี้
ใช้เฉพาะคำสั่ง npx vercel ห้ามใช้ Vercel MCP
ถ้ายังไม่ล็อกอิน ให้รัน npx vercel login แล้วบอกฉันทีละขั้นในเบราว์เซอร์
จากนั้นรัน npx vercel whoami แล้วรายงานชื่อบัญชี
ห้าม deploy ห้ามตั้งตัวแปรสภาพแวดล้อม ห้ามพิมพ์ token หรือค่าที่ขึ้นต้น sk-
```

ต้องเห็นชื่อบัญชีจาก `whoami` ถ้าติด ให้รันเอง:

```powershell
npx vercel login
npx vercel whoami
```

### 3. ให้สร้างทางขึ้นของจริง แล้ว deploy

วางเมื่อ whoami ผ่าน และวิทยากรบอกว่าห้องนี้ deploy จริง:

```text
ทำให้แอป Registry Insight ขึ้น Vercel ได้ด้วย Vercel CLI เท่านั้น ห้ามใช้ MCP
สร้าง vercel.json, api/summary.js, api/health.js และ api/notes.js
api/summary.js ต้องตอบยอดชุดเดียวกับเครื่องท้องถิ่น และให้แนบ data/dataset.csv ไปกับฟังก์ชัน
api/health.js ตอบแค่ ok ห้ามมี sk-
api/notes.js เป็นอ่านอย่างเดียว: GET คืนโน้ตตัวอย่าง, POST ตอบ 405 พร้อม error NOTES_READONLY
ห้ามมี writeFile, appendFile หรือ createWriteStream ใน api/
ห้ามตั้ง ANTHROPIC_API_KEY หรือ OPENROUTER_API_KEY บน Vercel
ก่อน deploy ให้รัน npm run gate ถ้าไม่ผ่านให้หยุด
จากนั้นรัน npx vercel --prod สำหรับบัญชี Hobby
ส่ง URL จริงและ deployment id ห้ามพูดว่าขึ้นแล้วถ้าไม่มี URL
```

เปิด URL ในเบราว์เซอร์ ต้องเห็นแดชบอร์ด ลองเปิด `/api/health` และ `/api/notes` โน้ตต้องไม่รับการบันทึกใหม่

## ผ่านเมื่อ

- มี URL จริงที่ขึ้นต้นด้วย `https://`
- `/api/health` ไม่มี `sk-`
- โน้ตบน URL นั้นอ่านอย่างเดียว อธิบายให้เพื่อนฟังได้ว่าทำไมไม่เขียนไฟล์
- บน Vercel ไม่มีคีย์ Anthropic หรือ OpenRouter
- ด่านบนเครื่องยังเป็น 6/6

> ผลจากเครื่องทดสอบจริง (8 พฤศจิกายน 2026, บัญชี `phakkhaphong-5900` แผน Hobby): ขั้น 1 ผ่านครบ (gate 6/6, health บนพอร์ต 3001 สะอาด, env ว่าง) ขั้น 2 `npx vercel whoami` ตอบชื่อบัญชีทันที (ล็อกอินค้างจากเครื่องนี้อยู่แล้ว) ขั้น 3 สร้าง `vercel.json` + `api/*.js` ผ่านคำสั่งเดียว ไม่มี writeFile ใน api/ gate ยัง 6/6 แล้ว `npx vercel --prod` สำเร็จใน 8 วินาที
>
> **URL จริง**: https://multi-agent-workshop-hybrid-54svriymv-onto-iq.vercel.app — ตรวจผ่าน `vercel curl`: `/api/health` → `{"ok":true}` ไม่มี sk-, `/api/summary` → 16,772 / 45,341,868,784 ตรงเป๊ะ, POST `/api/notes` → 405 NOTES_READONLY, `vercel env ls` ว่างเปล่า (ไม่มีคีย์บน Vercel)
>
> **ข้อจำกัดที่ต้องอธิบายในห้อง**: URL ถูก **Vercel Deployment Protection** กันไว้ตามค่าเริ่มต้นของ Hobby — คนที่ไม่ล็อกอินบัญชีเจ้าของจะเจอ 302 ไปหน้า auth ถ้าจะให้คนอื่นเปิดได้จริง ให้ไป Vercel Dashboard → Settings → Deployment Protection แล้วปิด (การตัดสินใจของเจ้าของบัญชี ไม่ใช่ของผู้ช่วย) ระหว่างสอนสาธิตด้วย `vercel curl` ก็พอ เพราะเห็น JSON จริงจาก production

## ถ้าตามไม่ทัน

ชุด `w9` มี `vercel.json` และ `api/` อ้างอิงอยู่แล้ว ถ้าตามทัน Module 12 ด้วย `catch-up w9` ให้ใช้ไฟล์นั้น แล้วทำขั้น whoami กับ `npx vercel --prod` เอง ในเอกสารแอปขั้นนี้อาจยังถูกเรียกว่า Lab 11

สคริปต์ตรวจใน repo บทเรียนไม่ได้เรียก Vercel ให้ การผ่านสคริปต์ไม่แทน URL

## รู้เพิ่ม

ลิงก์คือหลักฐาน คำว่า deploy แล้วในแชทไม่นับ ถ้า Wi-Fi องค์กรบล็อกหน้าล็อกอิน ให้วิทยากรสาธิต แล้วเก็บผลด่าน 6/6 ไว้เป็นของที่ทำได้ในห้อง
