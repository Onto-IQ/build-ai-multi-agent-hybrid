# Module 02 — ให้ผู้ช่วยรู้จักงานก่อนสั่ง

**ทำไปเพื่ออะไร:** ให้ผู้ช่วยอ่านกติกาของงานก่อนลงมือ เหมือนบรีฟพนักงานใหม่ ไม่ใช่ปล่อยให้เดา

| เวลา | เครื่องมือ |
|---|---|
| **45 นาที** | Claude Code สร้างกติกา, OpenCode อ่านต่อ, ปิดท้ายอบอุ่นสมองด้วยเครื่องมือใดก็ได้ |

เปิดเทอร์มินัลที่โฟลเดอร์แอป `multi-agent-workshop-hybrid` ตลอดแล็บนี้

## ก่อนเริ่ม

แอปเปิดได้ และ `npm run gate` เป็น exit 2 มี `CLAUDE.md`, `AGENTS.md` และ `opencode.json` มากับแอปแล้ว อย่าลบกติกาด่าน กติการเรื่องโน้ต หรือกติกาห้าม `git push`

## แบบฝึกหัด

### 1. ให้ Claude อ่านของที่มี แล้วเติมกติกาที่ขาด

```powershell
cd C:\dev\multi-agent-workshop-hybrid
claude
```

บน Mac ใช้ `cd ~/dev/multi-agent-workshop-hybrid` แล้วคำสั่งเดียวกัน

พิมพ์ `/init` แล้ววางข้อความด้านล่าง (เลือกอย่างใดอย่างหนึ่ง — ครั้งแรกจะมีหน้าถามความไว้ใจโฟลเดอร์ เลือก `Yes, I trust this folder`):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Read the existing CLAUDE.md. Do not delete these rules: the app is named Registry Insight, never add dependencies, never edit scripts/quality-gate.js, before claiming done run npm run gate and report the real exit code, never print any value that starts with sk-.
If any of them went missing after /init, add them back in plain readable language.
Then summarize for me in 5 lines what this app does and what state the quality gate is in now. Do not edit server.js.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
อ่าน CLAUDE.md ที่มีอยู่ อย่าลบกฎเหล่านี้: แอปชื่อ Registry Insight, ห้ามเพิ่ม dependency, ห้ามแก้ scripts/quality-gate.js, ก่อนบอกว่าเสร็จต้องรัน npm run gate แล้วรายงาน exit code จริง, ห้ามพิมพ์ค่าที่ขึ้นต้นด้วย sk-
ถ้าข้อไหนหายไปหลัง /init ให้ใส่กลับเป็นภาษาที่อ่านง่าย
จากนั้นสรุปให้ฉัน 5 บรรทัดว่าแอปนี้ทำอะไร และตอนนี้ด่านคุณภาพเป็นอย่างไร ห้ามแก้ server.js
```

จากเครื่องทดสอบจริง (claude 2.1.318, auto mode): `/init` ไม่ถามยืนยัน รันสำรวจทันที แล้วเติมส่วนที่ไฟล์ยังไม่มี (คำสั่งรัน, แผนที่ด่าน 6 เคส) โดยเก็บทุกกฎเดิม มันอาจเสริมประโยคกฎให้ชัดขึ้น เช่น กฎ `sk-` — อันนี้อนุญาต ขอแค่ไม่ลบกฎทั้งข้อ ปิดด้วย `/exit`

ปิดหน้า Claude แล้วเปิดไฟล์ `CLAUDE.md` ด้วยตา ต้องยังมีคำว่า quality gate

### 2. ให้ OpenCode อ่านกติกาที่มี แล้วเติมเฉพาะที่ขาด

แอปมี `AGENTS.md` อยู่แล้ว อย่าเขียนทับทั้งไฟล์

เปิดเทอร์มินัลใหม่ แล้วรัน (โมเดลตาม [SETUP.md](../../SETUP.md) — เครื่องทดสอบใช้โมเดลสาธิตของศูนย์ฝึก ตั้งผ่านตัวแปร `OPENCODE_MODEL`):

```powershell
cd C:\dev\multi-agent-workshop-hybrid
opencode
```

บน Mac ใช้ `cd ~/dev/multi-agent-workshop-hybrid` แล้วคำสั่งเดียวกัน

พิมพ์ `/init` แล้ววางข้อความด้านล่าง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Read the existing CLAUDE.md and AGENTS.md, then fill in AGENTS.md only where a line is still missing.
Must remain: exploration and gate fixing on Claude Code; the production line, memory, and the executive summary on OpenCode.
OpenCode reads the key from the OPENROUTER_API_KEY variable only — never paste a key value into a file.
ANTHROPIC_API_KEY must stay empty.
Do not create vercel.json or an api/ folder in this lab; learners create them in Module 13.
Do not edit CLAUDE.md, opencode.json, or server.js.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
อ่าน CLAUDE.md กับ AGENTS.md ที่มีอยู่ แล้วเติม AGENTS.md เฉพาะบรรทัดที่ยังไม่ครบ
ต้องยังอยู่: สำรวจและปิดด่านใช้ Claude Code, สายการผลิต ความจำ และสรุปผู้บริหารใช้ OpenCode
OpenCode อ่านคีย์จากตัวแปร OPENROUTER_API_KEY เท่านั้น ห้ามวางค่าคีย์ลงไฟล์
ANTHROPIC_API_KEY ต้องว่าง
อย่าสร้าง vercel.json หรือโฟลเดอร์ api/ ในแล็บนี้ ผู้เรียนค่อยสร้างใน Module 13
ห้ามแก้ CLAUDE.md ห้ามแก้ opencode.json ห้ามแก้ server.js
```

จากเครื่องทดสอบจริง (opencode 2.2.5 รอบวางพรอมต์, opencode 2.2.6 รอบ `/init`): ชุดเริ่มให้ `AGENTS.md` มาครบอยู่แล้ว รอบที่วางพรอมต์ตรง ๆ มันตรวจแล้วรายงานว่าครบ แล้วไม่แตะไฟล์ — นี่คือผลที่ผ่าน ไม่ใช่ความล้มเหลว รอบ `/init` (9 พ.ย. 2026, ใช้เวลา 1m36s): มันไม่ได้เขียนตามอำเภอใจ แต่**ตรวจข้ออ้างในไฟล์เดิมกับซอร์สจริงก่อน** เจอ conflict จริง (`lib/inspect-data.js` ต้องการ 9 คอลัมน์รวม `province` แต่ `CLAUDE.md` เขียน 8) จึงบันทึกไว้ว่าให้เชื่อโค้ดที่ด่านเรียกใช้จริง แล้วเติมเฉพาะที่ขาด (+33/−4) ส่วนรอบตรวจกติกาหลัง `/init` (35.6s) ได้ตารางยืนยันทีละบรรทัดพร้อมเลขบรรทัด และเมื่อบรรทัดในพรอมต์**ขัดกับแผนที่คลาสใน repo** ("Module 13" ทั้งที่ `CLAUDE.md` บอก Lab 11) มัน**ไม่ใส่ตามคำสั่ง แต่ถามก่อน** — พฤติกรรมอ่านก่อนเขียนที่แล็บนี้ต้องการให้เห็นพอดี ถ้าเจอ `Rate limit reached` ให้รอ มันลองใหม่เอง ออกด้วย `/exit`

### 3. อบอุ่นสมอง: ไฟล์เสี่ยงสุด และคำถามตัดสินของคอร์ส

เปิด `claude` หรือ `opencode` ก็ได้ (ที่โฟลเดอร์แอปเหมือนเดิม — คำถามชุดนี้ไม่ผูกเครื่องมือ) แล้ววางพรอมต์ภาษาใดภาษาหนึ่ง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Explore this project for 2 minutes and name the single riskiest file. Under 80 words.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
สำรวจโปรเจกต์นี้ประมาณ 2 นาที แล้วบอกไฟล์เดียวที่เสี่ยงที่สุด พร้อมเหตุผล ไม่เกิน 80 คำ
```

ผลที่คาดหวัง: คำตอบไม่เกิน 80 คำ และชี้ไฟล์ในโปรเจกต์นี้ เช่น `server.js` หรือ `data/dataset.csv` พร้อมเหตุผลหนึ่งข้อ

ถามต่อในเซสชันเดิมหนึ่งประโยค (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ:**

```text
For the remaining work, should we run it as a swarm or sequentially? Why?
```

**เวอร์ชันไทย:**

```text
งานที่เหลือควรทำแบบ swarm หรือ sequential
```

ผลที่คาดหวัง: การอ่านหลายไฟล์ขนานได้ การแก้ quality gate ต้องรู้ผลของการอ่านก่อน จึงต่อคิว

นี่คือคำถามตัดสินเดียวของทั้งคอร์ส — งานขั้นถัดไปต้องใช้ผลของขั้นก่อนหน้าหรือไม่ ถ้าไม่ต้องก็แตกขนานได้ ถ้าต้องก็ให้ต่อคิว ทุกโมดูลที่เหลือใช้คำถามนี้ตัดสิน ในคลาสไฮบริดมีขั้นก่อนหน้านั้นอีกหนึ่งชั้น: เลือกเครื่องมือตามผังใน `AGENTS.md` ก่อน (ข้อมูล-หลังบ้าน-หน้าเว็บใช้ OpenCode, สำรวจ-ปิดด่าน-สรุปใช้ Claude Code) แล้วค่อยใช้คำถามนี้ตัดสินว่าขนานหรือต่อคิว

## ผ่านเมื่อ

- ในโฟลเดอร์แอปมี `CLAUDE.md` ที่ยังพูดถึง `quality gate` และห้ามแก้ `scripts/quality-gate.js`
- `AGENTS.md` ยังบอกทั้ง Claude Code และ OpenCode, ยังพูดถึง `OPENROUTER_API_KEY`, และยังบอกว่า `ANTHROPIC_API_KEY` ต้องว่าง
- ยังไม่มี `vercel.json` และยังไม่มีโฟลเดอร์ `api/`
- `git diff` ไม่แตะ `server.js` หรือไฟล์ใน `data/`
- คำตอบของคำถามไฟล์เสี่ยงสุดชี้ไฟล์จริงในแอปและสั้นกว่า 80 คำ
- พูดได้ว่าทำไมงานทำความสะอาดข้อมูลไม่ควรขนานกับการออกแบบ

## ถ้าตามไม่ทัน

จาก repo บทเรียน:

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js init
```

ได้ `AGENTS.md` อ้างอิง ไฟล์ `CLAUDE.md` ของแอปจะไม่ถูกทับ อ่านฉบับอ้างอิงแล้วค่อยสั่งรอบอ่านด้วยตัวเอง

## รู้เพิ่ม

สองไฟล์นี้คือบรีฟ ไม่ใช่ตัวโปรแกรม ถ้าผู้ช่วยเริ่มแก้ `server.js` ทั้งที่ยังไม่สั่ง ให้กดปฏิเสธ แล้วบอกให้ทำเฉพาะไฟล์กติกา

ถ้ามีทั้ง `AGENTS.md` และ `CLAUDE.md` OpenCode อ่านเฉพาะ `AGENTS.md` กติกาฝั่ง OpenCode จึงต้องครบในไฟล์นี้ ไม่พอแค่อ้างถึง `CLAUDE.md`

ใน starter มีคำว่า "Lab 11" หลงเหลืออยู่ใน `CLAUDE.md` กับ `server.js` ขณะที่พรอมต์ข้างบนบอก "Module 13" — รอบทดสอบผู้ช่วยไม่ใส่บรรทัดนั้นตามคำสั่ง แต่ถามก่อนว่าเลขไหนถูก ใช้จุดนี้สอนว่าการอ่านก่อนเขียนได้ผลจริง และตกลงเลขโมดูลกับห้องให้ตรงกันก่อนตอบคำถามของมัน
