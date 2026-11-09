# Module 01 — เช็กว่าเครื่องพร้อม

**ทำไปเพื่ออะไร:** วันเรียนได้ลงมือทันที ไม่เสียครึ่งวันติดตั้งโปรแกรม — แล็บนี้ต้องจบก่อนเปิด `claude` หรือ `opencode` ครั้งแรกของคอร์ส

| เวลา | เครื่องมือ | ในห้อง |
|---|---|---|
| ทำการบ้านก่อนวันเรียน ทั้งก้อน · ในห้องใช้ **15 นาที** | Claude Code และ OpenCode | รันสคริปต์แล้วอ่านบรรทัด FAIL |

## ก่อนเริ่ม

ทำ [SETUP.md](../../SETUP.md) จนครบ เปิดเทอร์มินัลที่ repo บทเรียน ไม่ใช่แค่โฟลเดอร์ `Lessons/`

งานทั้งคอร์สแบ่งอยู่สอง repo:

| repo | มีอะไร | คุณทำอะไรที่นี่ |
|---|---|---|
| repo บทเรียน (โฟลเดอร์ที่มี `Lessons/`) | บทเรียน แล็บ สคริปต์ตรวจ และเฉลย | รันสคริปต์ตรวจ อ่านแล็บ |
| repo แอป `multi-agent-workshop-hybrid` | แอป Registry Insight ล้วน | เปิด `claude` / `opencode` รัน `npm start` / `npm run gate` ผลงานทุกชิ้นอยู่ที่นี่ |

ที่ repo บทเรียนจงใจ**ไม่มีโค้ดแอป** — เมื่อคุณเปิดผู้ช่วยที่ repo แอป agent จะเห็นเฉพาะแอป ไม่เห็นเฉลยหรือเนื้อหาบทเรียน

## แบบฝึกหัด

### 1. ตรวจเวอร์ชันและตัวแปรด้วยมือ

Windows:

```powershell
node --version
git --version
claude --version
opencode --version
echo $env:ANTHROPIC_API_KEY
echo $env:OPENROUTER_API_KEY
```

Mac ใช้ `echo $ANTHROPIC_API_KEY` กับ `echo $OPENROUTER_API_KEY` แทนสองบรรทัดท้าย

ผลที่คาดหวัง: Node 20 ขึ้นไป, Claude Code 2.1.296 ขึ้นไป, opencode มีเลขรุ่น, บรรทัด `ANTHROPIC_API_KEY` **ว่าง**, บรรทัด `OPENROUTER_API_KEY` มีค่า (อย่าก็อปค่านี้ส่งที่ไหน) — ถ้ามีคีย์ค้าง ปิดรอบเทอร์มินัลด้วย `Remove-Item Env:ANTHROPIC_API_KEY` (Mac: `unset ANTHROPIC_API_KEY`) แล้วดู SETUP.md ถ้ามันกลับมาทุกเทอร์มินัลใหม่

> 📚 **รู้เพิ่ม:** ทำไมคีย์ต้องว่าง — ถ้ามี `ANTHROPIC_API_KEY` ค้างอยู่ Claude จะใช้คีย์นั้นแทนบัญชีคลาสทันที และค่าใช้จ่ายไปโผล่ที่บัญชีส่วนตัวแบบจ่ายตามการใช้ โดยไม่มีกล่องเตือนให้เห็น

### 2. ล็อกอินและจับมือครั้งแรกใน TUI สองตัว

ที่**โฟลเดอร์แอป** (Windows: `C:\dev\multi-agent-workshop-hybrid` · Mac: `~/dev/multi-agent-workshop-hybrid`):

```powershell
claude
```

พิมพ์ `/status` — ต้องเห็นบัญชีของคลาส ไม่ใช่โหมด API key — แล้ววาง prompt (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Reply with exactly: CLAUDE-OK
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
ตอบกลับมาเป๊ะ ๆ ว่า: CLAUDE-OK
```

ต้องได้คำตอบ `CLAUDE-OK` เป๊ะ ๆ จึงพิมพ์ `/exit`

เปิด `opencode` ที่โฟลเดอร์เดียวกัน:

```powershell
opencode
```

รอจอพร้อม (โลโก้ + ช่องพิมพ์) แล้ววาง prompt (เลือกอย่างใดอย่างหนึ่ง) — คนละคำกับฝั่ง Claude เพราะต้องตรงกับที่สคริปต์ตรวจยิง:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Reply with exactly: OC-OK
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
ตอบกลับมาเป๊ะ ๆ ว่า: OC-OK
```

ต้องได้คำตอบ `OC-OK` เป๊ะ ๆ

> 📚 **รู้เพิ่ม:** สองคำตอบนี้คือสิ่งเดียวกับที่สคริปต์ตรวจข้อถัดไปยิงเองอัตโนมัติ (`claude -p` → `CLAUDE-OK`, `opencode run` → `OC-OK`) ลองด้วยมือครั้งนี้เพื่อรู้ว่าถ้าข้อนั้นแดง ต้องแก้ที่ตรงไหน

### 3. รันสคริปต์ตรวจ — ที่ repo แอปก่อน แล้วครบสอง repo

**ที่ repo แอป** (ตรวจเครื่อง + บูตแอป + ด่านเริ่มต้น):

Windows:

```powershell
cd C:\dev\multi-agent-workshop-hybrid
npm run verify
```

Mac:

```bash
cd ~/dev/multi-agent-workshop-hybrid
npm run verify
```

ผลที่คาดหวัง: บรรทัด `OK | starter quality gate exits 2 (intended day-1 state)` และจบด้วย `verify-setup (workshop): passed`

**ที่ repo บทเรียน** (ตรวจครบทั้งสอง repo):

Windows:

```powershell
cd C:\dev\build-ai-multi-agent-hybrid
powershell -ExecutionPolicy Bypass -File scripts/readiness-check.ps1
```

Mac:

```bash
cd ~/dev/build-ai-multi-agent-hybrid
bash scripts/readiness-check.sh
```

อ่านผลทีละบรรทัด:

- `OK` ผ่านข้อนั้น
- `WARN` ยังเข้าวันที่ 1 ได้ แต่อ่านให้จบ DuckDB ต้องมีก่อน Module 05 บัญชี Vercel ต้องมีก่อน Module 13
- `FAIL` แก้ตามข้อความ แล้วรันใหม่ ยังไม่เข้าแล็บถัดไป

> 📚 **รู้เพิ่ม:** รันจากโฟลเดอร์ไหนได้ผลของโฟลเดอร์นั้น — ที่ repo แอปตรวจเครื่องและบูตแอป ส่วน readiness-check ที่ repo บทเรียนตรวจครบและหา repo แอปเองตามลำดับ `WORKSHOP_DIR` → `.env` → พาธคลาส ถ้าเก็บ repo แอปไว้คนละที่ ตั้ง `WORKSHOP_DIR` แล้วรันใหม่

### 4. เปิดแอปครั้งหนึ่ง — คนละเทอร์มินัลกับขั้นถัดไป

ที่โฟลเดอร์แอป:

Windows:

```powershell
cd C:\dev\multi-agent-workshop-hybrid
npm start
```

Mac:

```bash
cd ~/dev/multi-agent-workshop-hybrid
npm start
```

เปิด http://127.0.0.1:3000 ในเบราว์เซอร์ แล้วกลับมาหยุดด้วย Ctrl+C ในเทอร์มินัลที่รันเอง

ผลที่คาดหวัง: หน้าเว็บ**ยังไม่พร้อม** และ**ไม่มีตัวเลขสรุปที่ใช้ได้** — นี่คือสถานะเริ่มต้นตามดีไซน์ ไม่ใช่เครื่องพัง

### 5. รันด่าน

กลับที่เทอร์มินัลเดิม (เซิร์ฟเวอร์ปิดด้วย Ctrl+C แล้วเท่านั้น) รัน `npm run gate` — ต้องจบด้วย exit 2 กับแดง **0/6** ชื่อพอดีหกชื่อ: `data-quality`, `bad-json-does-not-crash`, `summary-matches-valid-rows`, `health-no-secrets`, `notes-validation`, `notes-persists`

> 📚 **รู้เพิ่ม:** อย่าพยายามทำให้ด่านเขียวในแล็บนี้ เส้นทางของคอร์สคือ แดง 0/6 → **2/6 หลัง Module 05** → **6/6 หลัง Module 06** และห้ามแก้ `scripts/quality-gate.js` หรือเอาข้อมูลสะอาดมาทับเอง — ไฟล์ดิบกับบั๊กใน `server.js` ถูกปลูกไว้ให้แดงครบหกเคสตั้งแต่ clone

## ผ่านเมื่อ

- [ ] `claude --version` ≥ 2.1.296 และ `opencode --version` มีเลขรุ่น
- [ ] `ANTHROPIC_API_KEY` ว่าง และ `OPENROUTER_API_KEY` มีค่า — ไม่เอาค่าคีย์ไปวางในแชทหรือใน git
- [ ] TUI สองตัวเห็นบัญชีคลาส และตอบ `CLAUDE-OK` / `OC-OK` เป๊ะ ๆ
- [ ] `npm run verify` ที่ repo แอปขึ้น `verify-setup (workshop): passed`
- [ ] สคริปต์ตรวจที่ repo บทเรียนขึ้น `verify-setup: passed`
- [ ] หน้าเว็บเปิดได้ และปิดเซิร์ฟเวอร์ด้วย Ctrl+C แล้ว
- [ ] ด่านเริ่มต้น exit 2 แดง 0/6 โดยไม่แก้ไฟล์ใดใน repo แอป

## ถ้าตามไม่ทัน

แล็บนี้ไม่มีชุดเฉลย ถ้าเครื่องใครยังแดง ให้เพื่อนที่ผ่านแล้วนั่งคู่ช่วง 15 นาทีแรก อย่าข้ามไป Module 02 ทั้งที่ `claude` หรือ `opencode` ยังเปิดไม่ได้

## รู้เพิ่ม

- สคริปต์ไม่พิมพ์ค่าคีย์ มันบอกแค่ความยาว ถ้าเห็นตัวคีย์เต็ม ๆ บนจอ แปลว่าไปพิมพ์เอง อย่าส่งภาพนั้น
- ปัญหาที่พบบ่อยครบทุกอาการอยู่ที่ [SETUP.md](../../SETUP.md) หัวข้อปัญหาที่พบบ่อย
- อย่าใช้ `taskkill /IM node.exe` — มันฆ่า Node ทั้งเครื่อง ปิดเซิร์ฟเวอร์ด้วย Ctrl+C ในหน้าต่างที่รันเองเสมอ
- ต่อยอด: ที่ repo บทเรียนรัน `node scripts/check-solutions.mjs` — ชุดเฉลยอ้างอิงทั้งเก้าแล็บผ่านหมด ขณะที่ด่านในเครื่องคุณยังแดง 0/6 ตามดีไซน์
