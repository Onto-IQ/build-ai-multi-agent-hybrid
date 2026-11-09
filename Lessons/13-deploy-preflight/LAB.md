# Module 13 — ให้คนอื่นเปิดดูได้บน Vercel

**ทำไปเพื่ออะไร:** เดินครบสี่ช่วง: สมัคร/ล็อกอินบัญชี → preflight ในเครื่อง → ล็อกอิน Vercel CLI ผ่าน prompt → deploy ผ่าน prompt แล้วเก็บหลักฐาน URL — **ไม่ใช้ Vercel MCP** ในแล็บนี้ (กันปัญหาสถานะ `Needs authentication` และ connector `claude.ai Vercel` ที่ซ้ำกัน)

| เวลา | เครื่องมือ |
|---|---|
| **40 นาที** | เครื่องมือที่ถนัด (Claude Code หรือ OpenCode) สั่ง Vercel CLI · มือคุณรัน preflight |

ทำในโฟลเดอร์แอป · ถ้าห้องนี้ผู้สอนสั่งหยุดก่อนขึ้นของจริง ให้จบหลังช่วง preflight พร้อมผล gate

## ภาพรวมลำดับ

| ขั้น | ทำอะไร | ผลที่ต้องมี |
|---|---|---|
| 1 | สร้างบัญชี Vercel (Hobby ฟรี) ในเบราว์เซอร์ | ล็อกอินแดชบอร์ดได้ |
| 2–4 | preflight ในเครื่อง (release-manager ตรวจซ้ำได้ถ้าทำ M07) | gate 6/6 · health ไม่มี `sk-` · คีย์ว่าง · ปิดเซิร์ฟเวอร์ |
| 5 | Prompt ล็อกอิน **Vercel CLI** (ไม่แตะ MCP) | `npx vercel whoami` ขึ้นชื่อบัญชี |
| 6 | Prompt deploy ด้วย CLI | production URL + commit/deployment id |
| 7 | เปิด URL ยืนยัน | หน้าแดชบอร์ดขึ้นจริง ยอดตรง |

> ถ้าเคยเพิ่ม MCP ชื่อ `vercel` จากรอบเก่า ให้ลบก่อนขั้น 5: `claude mcp remove vercel -s local` (ไม่ต้องแตะ connector `claude.ai Vercel` ถ้ามี — แล็บนี้ไม่ใช้)

## 1) สร้างบัญชี Vercel (หรือล็อกอินถ้ามีแล้ว)

ทำใน**เบราว์เซอร์** — ไม่ผ่านผู้ช่วย:

1. เปิด https://vercel.com/signup
2. สมัครด้วย GitHub / Google / Email (แนะนำ GitHub)
3. เลือกแผน **Hobby** (ฟรี · งานเรียน) — **อย่า**กดลิงก์แผน Pro trial โดยไม่ตั้งใจ
4. ยืนยันอีเมล/OTP จนเข้าแดชบอร์ด https://vercel.com/dashboard ได้

> 📚 **รู้เพิ่ม:** บัญชีนี้ใช้ตอน `vercel login` ในขั้น 5 — สมัครกลางชั่วโมง deploy มักไม่ทัน

## 2) Preflight — quality gate

ปิด `npm start` ถ้าเปิดค้างอยู่ แล้ว:

```powershell
npm run gate
echo $LASTEXITCODE
```

ต้องได้ `quality gate: 6/6 passed` exit `0` — ของที่แดงขึ้นของจริงคือของเสียที่คนภายนอกเห็นก่อนเรา

**ทางเลือกที่ดีกว่า (ถ้าทำ Module 07 มาแล้ว):** เปิด `claude` แล้วเรียก `@release-manager` รัน release checklist — ต้อง PASS ทุกข้อจึงมีสิทธิ์ไปขั้นถัดไป

## 3) Preflight — `/api/health` ไม่มี `sk-` แล้วปิดเซิร์ฟเวอร์

ใช้พอร์ต **3001** กันชนกับของที่อาจค้างที่ 3000 — แล็บนี้รันใน **PowerShell** (อย่าวาง `PORT=3001 npm start` นั่นคือ bash จะขึ้น error)

**เทอร์มินัล A — สตาร์ทเซิร์ฟเวอร์:**

```powershell
$env:PORT = 3001; npm start
```

**เทอร์มินัล B — เรียก health แล้วตรวจ:**

```powershell
$h = Invoke-RestMethod http://127.0.0.1:3001/api/health
$h | ConvertTo-Json -Compress
($h | ConvertTo-Json -Compress) -match 'sk-'
```

ผลที่คาดหวัง: JSON ประมาณ `{"ok":true}` · บรรทัด `-match 'sk-'` เป็น `False` · แล้วกลับไปเทอร์มินัล A กด **Ctrl+C** ปิดเซิร์ฟเวอร์

> 📚 **รู้เพิ่ม:** พอร์ต 3001 คือการตรวจของใหม่โดยไม่ง้อเซิร์ฟเวอร์เก่า · บน Git Bash / macOS ใช้ `PORT=3001 npm start` กับ `curl -s http://127.0.0.1:3001/api/health | grep -c 'sk-' || true` (ต้องได้ 0)

## 4) Preflight — คีย์ว่าง

```powershell
echo $env:ANTHROPIC_API_KEY
```

Mac: `echo "$ANTHROPIC_API_KEY"` — ต้องว่าง คีย์โมเดลอยู่ที่เครื่องที่รันผู้ช่วยเท่านั้น ไม่ขึ้น Vercel

## 5) ล็อกอิน Vercel CLI ผ่าน Prompt (ยังไม่ deploy · ไม่ใช้ MCP)

เปิด TUI จากโฟลเดอร์แอป (`claude` หรือ `opencode` ตามถนัด) แล้ววางอย่างใดอย่างหนึ่ง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Prepare Vercel CLI login for this workshop repo so we can deploy later.
Use only the Vercel CLI (npx vercel). Do not add, configure, or call any Vercel MCP server. Do not open /mcp for Vercel.
If I am not logged in, run npx vercel login and tell me exactly what to do in the browser with the Vercel account I already signed into.
After login, run npx vercel whoami and report PASS or FAIL with the account name only.
Do not deploy. Do not link or create a project yet. Do not print tokens, cookies, or any sk- value.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
เตรียมล็อกอิน Vercel CLI ให้ repo นี้ เพื่อเตรียม deploy ทีหลัง
ใช้เฉพาะ Vercel CLI (npx vercel) ห้ามเพิ่ม ตั้งค่า หรือเรียก Vercel MCP ห้ามเปิด /mcp เพื่อ Vercel
ถ้ายังไม่ล็อกอิน ให้รัน npx vercel login แล้วบอกฉันทีละขั้นว่าต้องทำอะไรในเบราว์เซอร์ด้วยบัญชี Vercel ที่ล็อกอินไว้แล้ว
หลังล็อกอิน รัน npx vercel whoami แล้วรายงาน PASS หรือ FAIL พร้อมชื่อบัญชีเท่านั้น
ห้าม deploy ห้ามลิงก์หรือสร้างโปรเจกต์ตอนนี้ ห้ามพิมพ์ token · cookie หรือค่าที่ขึ้นต้นด้วย sk-
```

ผลที่คาดหวัง: `whoami` ขึ้นชื่อบัญชี · เอเจนต์รายงาน **PASS** · **ยังไม่มี** production URL

**ทางสำรองด้วยมือ** (นอก TUI):

```powershell
npx vercel login
npx vercel whoami
```

> 📚 **รู้เพิ่ม:** เลือก CLI แทน MCP เพราะ MCP มักซ้ำกับ connector `claude.ai Vercel` แล้วค้างที่ Needs authentication — CLI login ชัดและตรวจด้วย `whoami` ได้ทันที

## 6) Deploy ผ่าน Prompt (Vercel CLI)

วาง prompt นี้**เฉพาะเมื่อ**ขั้น 5 เป็น PASS และผู้สอนบอกว่าห้องนี้ deploy จริง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Deploy this Registry Insight app to Vercel using only the Vercel CLI (npx vercel).
Do not use Vercel MCP or /mcp.
Before deploying, run npm run gate. If it fails, stop and report.
Prefer existing vercel.json and api/ in this workshop repo if present.
Use npx vercel --prod (answer link/create prompts sensibly for a Hobby account).
After deploying, give me the production URL and the commit (or deployment id) that was deployed.
Do not print any sk- value. Do not add ANTHROPIC_API_KEY as a Vercel env var.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
Deploy แอป Registry Insight ขึ้น Vercel โดยใช้เฉพาะ Vercel CLI (npx vercel)
ห้ามใช้ Vercel MCP หรือ /mcp
ก่อน deploy ให้รัน npm run gate ถ้าไม่ผ่านให้หยุดแล้วรายงาน
ถ้ามี vercel.json และโฟลเดอร์ api/ ใน repo นี้ให้ใช้ตามนั้น
ใช้ npx vercel --prod (ตอบคำถามลิงก์/สร้างโปรเจกต์ให้เหมาะกับบัญชี Hobby)
หลัง deploy ส่ง production URL และ commit (หรือ deployment id) ที่ขึ้นจริง
ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk- ห้ามใส่ ANTHROPIC_API_KEY เป็นตัวแปรบน Vercel
```

ผลที่คาดหวังถ้าขึ้นได้: มี **URL** และมี **commit หรือ deployment id** · ถ้าไม่ขึ้น: รายงานว่าหยุดที่ gate หรือติดสิทธิ์ — ไม่มีคำว่า "ขึ้นแล้ว" โดยไม่มี URL

**ทางสำรอง CLI เอง** (หลัง gate เขียวและ whoami ผ่าน): `npx vercel --prod`

> 📚 **รู้เพิ่ม:** URL กับ commit/deployment id คือหลักฐาน — คำว่า "ขึ้นแล้ว" โดยไม่มีหลักฐานไม่นับ และสคริปต์ตรวจใน repo ไม่ได้เรียก Vercel แทนคุณ

## 7) ยืนยันบนของจริง

เปิด production URL ในเบราว์เซอร์ เทียบยอดกับ `docs/EXECUTIVE-SUMMARY.md` — หน้าโหลดได้ · `/api/health` ไม่มี `sk-` · ยอดไม่เพี้ยน

จากเครื่องทดสอบจริง (8 พฤศจิกายน 2026, บัญชี Hobby): ขั้น 1–4 ผ่านครบ ขั้น 5 `whoami` ตอบทันที ขั้น 6 สร้าง `vercel.json` กับ `api/summary.js / api/health.js / api/notes.js` ด้วย prompt เดียว (ไม่มี writeFile ใน api/ — โน้ตเป็นแบบอ่านอย่างเดียว POST ตอบ 405 `NOTES_READONLY`) gate ยัง 6/6 และ `npx vercel --prod` สำเร็จใน 8 วินาที

**URL จริง**: https://multi-agent-workshop-hybrid-54svriymv-onto-iq.vercel.app — ตรวจผ่าน `vercel curl`: `/api/health` → `{"ok":true}` ไม่มี sk-, `/api/summary` → 16,772 / 45,341,868,784 ตรงเป๊ะ, POST `/api/notes` → 405 `NOTES_READONLY`, `vercel env ls` ว่างเปล่า (ไม่มีคีย์บน Vercel)

> 📚 **ข้อจำกัดที่ต้องอธิบายในห้อง:** URL ถูก **Vercel Deployment Protection** กันไว้ตามค่าเริ่มต้นของ Hobby — คนที่ไม่ล็อกอินบัญชีเจ้าของจะเจอ 302 ไปหน้า auth — ถ้าจะให้คนอื่นเปิดได้จริง ไป Vercel Dashboard → Settings → Deployment Protection แล้วปิด (การตัดสินใจของเจ้าของบัญชี ไม่ใช่ของผู้ช่วย) ระหว่างสอน สาธิตด้วย `vercel curl` ก็พอ เพราะเห็น JSON จริงจาก production

## ผ่านเมื่อ

- มีบัญชี Vercel (Hobby) และล็อกอินแดชบอร์ดได้
- quality gate exit 0 · health ไม่มี `sk-` · เซิร์ฟเวอร์ท้องถิ่นถูกปิดแล้ว · `ANTHROPIC_API_KEY` ว่าง
- `npx vercel whoami` ผ่านโดยไม่พึ่ง MCP (หรือบันทึกว่าผู้สอนสาธิต)
- มี production URL ที่ขึ้นต้น `https://` + commit/deployment id (หรือบันทึกว่าห้องนี้ให้ผู้สอนสาธิต พร้อมเก็บผล gate ไว้)
- โน้ตบน URL นั้นอ่านอย่างเดียว (405) และอธิบายให้เพื่อนฟังได้ว่าทำไมไม่เขียนไฟล์
- `.vercel/` ไม่ถูก commit (เพิ่ม `.gitignore` แล้ว)

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| สมัครแล้วขึ้น Pro trial / ถามบัตร | กดลิงก์แผนผิด | กลับไป signup แล้วเลือก Hobby ฟรี |
| quality gate ยัง exit 2 | ข้อมูล/เซิร์ฟเวอร์ยังไม่ใช่ชุด Module 05–07 | catch-up `w9` แล้วรัน gate ใหม่ |
| `PORT=3001` is not recognized | วาง syntax bash ใน PowerShell | ใช้ `$env:PORT = 3001; npm start` ตามขั้น 3 |
| port busy | ของเก่ายังฟังอยู่ | ปิดหรือเปลี่ยน `PORT` |
| `Unable to connect` ที่ 3001 | เซิร์ฟเวอร์ยังไม่ขึ้น | รอเทอร์มินัล A โชว์ listening แล้วเรียกใหม่ |
| เอเจนต์ไปเพิ่ม MCP / `Needs authentication` | ใช้ prompt รอบเก่าที่สั่ง MCP | `claude mcp remove vercel -s local` แล้วใช้ prompt ขั้น 5 ชุดใหม่ |
| `vercel whoami` ไม่รู้จัก | ยังไม่ login | `npx vercel login` ในเบราว์เซอร์ด้วยบัญชีขั้น 1 |
| headless ไม่ยอมเรียก vercel | Bash ถูกปฏิเสธ | ใช้ TUI หรือรัน `npx vercel --prod` เอง |
| ได้คำว่า deployed แต่ไม่มี URL | ไม่มีหลักฐาน | ไม่นับเป็นข้อผ่าน — ขอ URL กับ deployment id ใหม่ |
| เปิด URL เจอหน้าล็อกอิน Vercel | Deployment Protection ของ Hobby | ไม่ใช่ deploy พัง — ดูหมายเหตุขั้น 7 |
| `.vercel/` จะถูก commit | โฟลเดอร์มี project id ฝัง | เพิ่ม `.gitignore` (รอบทดสอบเพิ่มให้แล้ว) |
| หมดเทิร์นกลางทาง | เพดานรอบต่ำ | อยู่ใน TUI |

สคริปต์ตรวจใน repo บทเรียนไม่ได้เรียก Vercel — การผ่านสคริปต์ไม่แทน URL

## ถ้าตามไม่ทัน

```powershell
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w9
```

แล้วรัน `npm run gate` ในโฟลเดอร์แอปให้ได้ exit 0 — การได้ URL ยังเป็นขั้นที่คนทำ (ขั้น 5–7) — ในเอกสารแอป ขั้นนี้อาจยังถูกเรียกว่า Lab 11

## ต่อยอด

เทียบยอดบน URL จริงกับ `docs/EXECUTIVE-SUMMARY.md` แล้วจดสั้น ๆ ว่าตรง/ไม่ตรงข้อไหน — ถ้าปิด Deployment Protection แล้วลองเปิดจากเครื่องเพื่อน

## รู้เพิ่ม

ลิงก์คือหลักฐาน คำว่า "deploy แล้ว" ในแชทไม่นับ ทางขึ้นของจริงคือ `api/*.js` ไม่ใช่การเอา `server.js` ไปฟังพอร์ต และวิธีแนบ `data/dataset.csv` (~8 MB) ผ่าน `includeFiles` อยู่ที่ `reference/vercel/README.md` — อย่าคัดลอกไฟล์ในโฟลเดอร์นั้นขึ้นรากโปรเจกต์ก่อนแล็บนี้
