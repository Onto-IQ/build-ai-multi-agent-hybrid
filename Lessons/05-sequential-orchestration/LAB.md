# Module 05 — สายการผลิต: วางแผนบน OpenCode ลงมือแบบทีมบน Claude

**ทำไปเพื่ออะไร:** แผนมาจาก OpenCode แล้วส่งต่อด้วยไฟล์ให้เพื่อนทีมของ Claude ลงมือพร้อมกันสามสาย และปิดท้ายด้วยการรันของจริงด้วยมือคุณเอง จนหน้าเว็บโชว์ยอดจริง

| เวลา | เครื่องมือ |
|---|---|
| **70–80 นาที** | OpenCode วางแผน · Claude Code ลงมือแบบทีม · มือคุณตรวจ |

ทำในโฟลเดอร์แอป แล็บนี้ใช้ DuckDB — ถ้ายังไม่มี ให้ลงตาม SETUP หรือเรียกวิทยากรก่อนถึงขั้นรัน SQL

## ก่อนเริ่ม

มี `docs/EXPLORATION-REPORT.md` — ด่านยังไม่ครบ 6 ข้อ และตั้งใจให้ยังแดงเรื่องโน้ตกับ health

## Part A — วางแผนบน OpenCode (ต่อคิว)

### 1. ให้คนวางแผนเขียนไฟล์เดียว

มี `.opencode/agents/planner.md` จาก Module 04 แล้ว ปิดเปิด `opencode` ใหม่เสมอ (ไฟล์บทบาทโหลดตอนเปิดรอบ) แล้ววาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Have planner read docs/EXPLORATION-REPORT.md and data/README.md, then write docs/TASKS.md.
Organize it as three tracks — data, backend, frontend — and state who owns each file.
State clearly that scripts/quality-gate.js must never be edited.
Do not plan any change to /api/notes or /api/health in this lab.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
ให้ planner อ่าน docs/EXPLORATION-REPORT.md กับ data/README.md แล้วเขียน docs/TASKS.md
แบ่งเป็นสามสาย data, backend, frontend บอกว่าใครถือไฟล์ไหน
เขียนชัดว่าห้ามแก้ scripts/quality-gate.js
ห้ามวางแผนไปแก้ /api/notes หรือ /api/health ในแล็บนี้
```

เปิด `docs/TASKS.md` ด้วยตา ถ้ายังไม่มีสามสาย อย่าไปขั้นถัดไป ถ้ายังไม่มี `planner.md` ให้กลับไปขั้น 2 ของ Module 04 ก่อน

📦 **Handoff ที่ 1:** `docs/TASKS.md` จาก OpenCode คือสัญญาที่ทีมฝั่ง Claude ต้องอ่านต่อ — การส่งงานข้ามเครื่องมือด้วยไฟล์ ไม่ใช่แชท

## Part B — ลงมือแบบทีมบน Claude

### 2. สร้าง developer ฝั่ง Claude

ปิด `opencode` แล้วเปิด `claude` ที่โฟลเดอร์แอป วาง (เลือกอย่างใดอย่างหนึ่ง) แล้วยอมให้เขียนไฟล์:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .claude/agents/developer.md.
Write the real file with the Write tool — do not reply with text only.
Frontmatter: name developer; description "Use proactively to implement one task from docs/TASKS.md"; tools Read, Grep, Glob, Write, Edit, Bash; model sonnet.
Body: you are the developer. Implement exactly the tasks assigned to you, citing the task numbers. Node only, no dependencies. Never touch scripts/quality-gate.js.
Do not edit server.js during this file-creation step.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
สร้าง .claude/agents/developer.md
เขียนไฟล์จริงด้วยเครื่องมือ Write อย่าตอบเป็นข้อความอย่างเดียว
frontmatter: name เป็น developer, description ว่า Use proactively to implement one task from docs/TASKS.md, tools เป็น Read, Grep, Glob, Write, Edit, Bash, model เป็น sonnet
เนื้อหา: คุณคือ developer ทำงานเฉพาะ task ที่ได้รับมอบหมาย อ้างหมายเลข task ทุกครั้ง Node ล้วน ห้ามเพิ่ม dependency ห้ามแตะ scripts/quality-gate.js
ห้ามแก้ server.js ในรอบสร้างไฟล์นี้
```

ปิด Claude แล้วเปิดใหม่ ไฟล์บทบาทโหลดตอนเปิดรอบเท่านั้น

### 3. เปิดโหมดทีม (เพดาน 30 รอบ)

1. **ปิดหน้า `claude` ของขั้น 2** ก่อนเปลี่ยนไฟล์ตั้งค่า
2. สร้างไฟล์ `.claude/settings.local.json` **คัดลอกทั้งก้อน** แล้ว Save:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_MAX_TURNS": "30"
  }
}
```

> 📚 **โน้ต:** บรรทัดแรกเปิดโหมดทีม · บรรทัดที่สองเพดาน 30 รอบ (งานลงมือยาวกว่าสำรวจใน Module 03) · ไฟล์นี้เป็นของเครื่องคุณคนเดียว **ไม่หายเอง** เมื่อปิดหน้าต่าง ต้องลบเองหลังพาร์ตนี้

3. เปิด `claude` ใหม่จากโฟลเดอร์แอป (หลัง Save แล้วเท่านั้น) — **อย่า**ใช้ `claude -p` โหมดทีมจะไม่ทำงาน

### 4. สั่ง developer ตั้งทีมแล้วลงมือสามสายพร้อมกัน

วางทั้งก้อน (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@developer Act as team lead. Read docs/TASKS.md.
Use Agent Teams (not Explore). Spawn exactly 3 named teammates:
- data — write docs/DESIGN.md (the cleaning contract: drop the junk header row, Buddhist-era to ISO dates, strip comma-formatted capitals, extract the province from the address) and scripts/clean-export.sql (DuckDB SQL reading data/raw/dbd-2558.parquet, exporting data/dataset.csv)
- backend — change ONLY the /api/summary computation in server.js to parse with lib/csv.js instead of naive comma splitting, and count only rows the data dictionary accepts (reg_no 13 digits, reg_date ISO, capital numeric). Do not touch /api/notes or /api/health, and do not add try/catch around JSON.parse — those bugs are reserved for Module 06.
- frontend — update web/app.js so the dashboard shows company count and total capital from /api/summary plus a small line naming the data source

Use a shared task list. Teammates data, backend, and frontend must message each other at least 5 times before you synthesize.
Do not touch scripts/quality-gate.js. Do not "helpfully" fix notes / health / broken JSON — those four cases belong to Module 06.
Report which task numbers you completed.
When finished, ask each teammate by name to shut down (message data, then backend, then frontend). Do not call Stop Task using the names data/backend/frontend as task IDs — those are teammate names, not task IDs.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
@developer ทำหน้าที่หัวหน้าทีม อ่าน docs/TASKS.md
ใช้ Agent Teams (ไม่ใช่ Explore) สร้าง teammate ชื่อชัดเจน 3 ตัว:
- data — เขียน docs/DESIGN.md (สัญญาทำความสะอาด: แถวหัวตารางทิ้ง พ.ศ. เป็น ค.ศ. ทุนมีลูกน้ำ ดึงจังหวัดจากที่อยู่) และ scripts/clean-export.sql (DuckDB SQL อ่าน data/raw/dbd-2558.parquet ส่งออก data/dataset.csv)
- backend — แก้เฉพาะการคำนวณ /api/summary ใน server.js ด้วย lib/csv.js แทนการ split จุลภาคตรง ๆ และนับเฉพาะแถวที่ผ่านพจนานุกรมข้อมูล (reg_no 13 หลัก, reg_date ISO, capital เป็นตัวเลข) ห้ามแตะ /api/notes /api/health และห้ามใส่ try/catch รอบ JSON.parse — บั๊กพวกนั้นเก็บไว้ Module 06
- frontend — ปรับ web/app.js ให้แดชบอร์ดโชว์จำนวนกิจการกับทุนรวมจาก /api/summary พร้อมบรรทัดเล็กบอกที่มาของข้อมูล

ใช้รายการงานร่วม เพื่อนทีม data, backend, frontend ต้องส่งข้อความหากันอย่างน้อย 5 ครั้งก่อนที่คุณจะสรุป
ห้ามแตะ scripts/quality-gate.js ห้าม "ช่วยแก้" notes / health / JSON พัง — สี่เคสนั้นเป็นของ Module 06
รายงานว่าทำ task เลขอะไรครบบ้าง
จบแล้วให้สั่ง teammate ทีละชื่อให้ shut down (ส่งข้อความหา data แล้ว backend แล้ว frontend) ห้ามใช้ Stop Task โดยใส่ชื่อ data/backend/frontend เป็นรหัสงาน — นั่นคือชื่อเพื่อนทีม ไม่ใช่รหัสในรายการงาน
```

ผลที่คาดหวัง: แผงเอเจนต์มีชื่อ `data` / `backend` / `frontend` · มีรายการงานร่วม · ได้ DESIGN + SQL + การแก้ backend/frontend

📦 **Handoff ที่ 2:** `docs/TASKS.md` → ของที่เพื่อนทีมลงมือ

### 5. ออกจาก `claude` แล้วลบ `.claude/settings.local.json` — ขั้นบังคับ ไม่ทำ รอบรีวิวจะยังเป็นโหมดทีม

## Part C — มือคุณรันของจริง แล้วยอมรับว่ายังไม่ครบ

### 6. รัน SQL และตรวจไฟล์จริงด้วยมือคุณเอง

รัน SQL แล้วดู exit code — PowerShell ไม่โชว์เอง:

```powershell
duckdb -c ".read scripts/clean-export.sql"
echo $LASTEXITCODE
```

DuckDB สำเร็จมัก**เงียบ** — `$LASTEXITCODE` เป็น `0` คือผ่าน แล้วตรวจไฟล์จริง อย่าเชื่อแค่ความเงียบ:

```powershell
(Get-Content data\dataset.csv | Measure-Object -Line).Lines
Get-Content data\dataset.csv -TotalCount 3
```

| คำสั่ง | ดูอะไร | ค่าที่คาดหวัง |
|---|---|---|
| นับบรรทัด | จำนวนบรรทัดไฟล์ | ประมาณ **16773** = หัวตาราง 1 + ข้อมูล **16772** แถว |
| 3 แถวแรก | รูปแบบข้อมูล | วันที่ ISO (`2015-01-12`) · ทุนตัวเลขไม่มีลูกน้ำ · มีคอลัมน์ `province` |

เปิดเทอร์มินัลอีกหน้าต่าง รัน `npm start` แล้วเปิด `http://127.0.0.1:3000` — ต้องเห็น **16,772 กิจการ, ทุนรวม 45,341,868,784 บาท** จากนั้น `Ctrl+C` ปิดเซิร์ฟเวอร์**ก่อนรันด่าน** ไม่งั้นพอร์ตชนกัน เคส HTTP จะแดงทั้งกลุ่มทั้งที่ข้อมูลสะอาดแล้ว

```powershell
npm run gate
echo $LASTEXITCODE
```

ต้องเห็น `PASS | data-quality` และ `PASS | summary-matches-valid-rows` exit code เป็น `2` (ยังแดง 4 เคส) ข้อที่เกี่ยวกับโน้ตและ health ยังแดงได้ นั่นคืองาน Module 06 ถ้าได้ 6/6 ทั้งที่ยังไม่ถึง M06 — ทีม "ช่วยแก้" เกินสเปก ให้ย้อนดู diff แล้วคุยกันในห้อง ห้องที่อยากซ้อมเส้นทาง 2/6 → 6/6 ให้ใช้ `node scripts/catch-up.js w3` เพื่อดึง `server.js` ที่ยังเหลือสี่เคสแดง

ตัวเลขที่ต้องออกมาตรงคือ 16,772 กิจการ และทุนรวม 45,341,868,784 บาท ถ้ายังไม่ตรง อย่าไป Module 06

### 7. รอบรีวิว: อีกตาหนึ่งดู SQL กับสัญญา

เปิด `claude` ใหม่ (**ไม่มี** `settings.local.json` แล้ว) วาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the agent developer. Compare scripts/clean-export.sql against docs/DESIGN.md and write docs/REVIEW.md with the differences, citing lines for every point. Fix nothing.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
ใช้ agent developer เทียบ scripts/clean-export.sql กับ docs/DESIGN.md แล้วเขียน docs/REVIEW.md สรุปจุดต่าง อ้างบรรทัดทุกข้อ ห้ามแก้ของ
```

📦 **Handoff ที่ 3:** `docs/REVIEW.md` คือของที่คนไล่บั๊กใน Module 06 อ่านต่อ

## ผ่านเมื่อ

- มี `.opencode/agents/planner.md` (จาก Module 04) และ `.claude/agents/developer.md` จากแล็บนี้ ฟิลด์เป็นอังกฤษครบ
- `docs/TASKS.md` มาก่อนทีมลงมือ — เห็นลำดับต่อคิวด้วยไฟล์ข้ามเครื่องมือ
- มี `.claude/settings.local.json` ตอนพาร์ตทีม (MAX_TURNS 30) แล้ว**ลบแล้ว**ก่อนรอบรีวิว
- เพื่อนทีมชื่อ `data`, `backend`, `frontend` และบังคับคุยกันอย่างน้อย 5 ครั้ง
- มี `docs/TASKS.md`, `docs/DESIGN.md`, `docs/REVIEW.md` และ `scripts/clean-export.sql`
- SQL รันด้วยมือคุณเอง exit `0` หน้าเว็บโชว์ยอดจริง 16,772 / 45,341,868,784 และปิดเซิร์ฟเวอร์ก่อนรันด่านแล้ว
- ด่านมี PASS สองข้อด้านข้อมูลและยอดสรุป exit `2`
- `git diff -- scripts/quality-gate.js lib/inspect-data.js` ว่าง
- ยังไม่ได้ "ช่วย" ปิดบั๊กโน้ตหรือ health

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `Agent type not found` | ยังไม่รีสตาร์ทหลังสร้างไฟล์เอเจนต์ | ปิดแล้วเปิดเครื่องมือใหม่ |
| ได้แค่ผู้ช่วยสำรวจ ไม่มีเพื่อนทีมชื่อ | ยังไม่มี settings หรือเปิด `claude` ก่อน Save | ตรวจไฟล์ → เปิดใหม่ → สั่งชัดว่า agent team |
| ใช้ `claude -p` แล้วไม่มีทีม | โหมดทีมต้องใช้หน้าจอโต้ตอบ | ใช้ `claude` อย่างเดียว |
| หมดรอบกลางคัน | งานลงมือยาว | ตรวจว่า MAX_TURNS เป็น `"30"` · Save แล้วเปิดใหม่ |
| `Stop Task` / `No task found with ID: data` | หัวหน้าสับสนชื่อเพื่อนทีมกับรหัสงาน | ถ้าของครบแล้วไปต่อได้ · รอบหน้าสั่ง shut down ทีละชื่อเพื่อน |
| หน้าเว็บยังของเดิม | ยังไม่รัน SQL | รันขั้น 6 ซ้ำ |
| รัน `duckdb` แล้วเงียบ | DuckDB สำเร็จมักไม่พิมพ์อะไร | ดู `$LASTEXITCODE` เป็น `0` แล้วนับบรรทัด/ดู 3 แถวแรกตามขั้น 6 |
| `port 3000 is already in use` หลายเคส | ยังเปิด `npm start` ค้าง | `Ctrl+C` ปิดแล้วรัน gate ใหม่ — อย่าเพิ่งสรุปว่า backend พัง |
| ได้ 6/6 ตั้งแต่โมดูลนี้ | ทีมแก้ notes/health/JSON เกินสเปก | ไปต่อได้ · ย้ำพรอมต์ว่าห้ามแตะสี่เคสของ M06 · อยากซ้อมเส้น 2/6 ใช้ catch-up `w3` |
| SQL วนแก้ไม่ผ่าน | โมเดลเขียน SQL พังต่อเนื่อง (ชื่อคอลัมน์, ชนิดข้อมูล พ.ศ., `REGEXP` ที่ DuckDB ไม่มี) | ใช้ทางถ้าตามไม่ทัน: `node scripts/catch-up.js w3` เอา SQL อ้างอิงมารัน — เฉลยมีไว้ให้ก้าวข้ามจุดคอขวด |
| ผู้ช่วยแตะ `lib/inspect-data.js` | ไฟล์กฎที่ด่านเรียกใช้ — แตะเมื่อไร ด่านก็เสี่ยงเมื่อนั้น | `git checkout -- lib/inspect-data.js` ก่อนรันด่านรอบสำคัญ |
| วางข้อความไทยแล้วเพี้ยน (ฝั่ง opencode) | คลิปบอร์ดไม่ได้ UTF8 หรือวางตอน TUI ยังโหลด | ตั้งคลิปบอร์ดแบบ UTF8 แล้วดูช่องพิมพ์ก่อน Enter ทุกครั้ง |
| แล็บถัดไปยังค้างเป็นโหมดทีมอยู่ | ลืมลบ `settings.local.json` | ลบไฟล์แล้วเปิด `claude` ใหม่ |

จากเครื่องทดสอบจริง (7 พ.ย. 2026 — **รอบที่ยังทำทั้งแล็บบน opencode ล้วน**): SQL วนแก้สามรอบยังไม่ผ่านจนต้องใช้ SQL อ้างอิงจาก catch-up, ผู้ช่วย refactor `lib/inspect-data.js` จนด่าน abort, พอร์ต 3000 ค้างหลังมันทดสอบเอง, คลิปบอร์ดไทยเพี้ยนทั้งก้อน — ทั้งหมดยังมีโอกาสเกิดในดีไซน์ปัจจุบัน และ**ตัวแปรข้ามเครื่องมือ (แผนจาก opencode → ทีม claude) ยังไม่เคยรันจริง ให้วิทยากรทดลองหนึ่งรอบก่อนคลาส 12 พ.ย.**

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w3
```

ได้ `docs/DESIGN.md`, `docs/REVIEW.md`, `scripts/clean-export.sql` และ `data/dataset.csv` ฉบับสะอาด (ถ้าไม่มี DuckDB ให้ใช้ชุด `w7` ซึ่งใส่ CSV สะอาดมาด้วย — เฉพาะก่อน Module 06 และถ้ายอมรับว่าจะไม่ได้เห็นไฟล์ดิบ)

## ต่อยอด

หลังลบ settings แล้ว สั่ง planner เพิ่ม task เรื่อง BOM ใน CSV แล้วให้ลงมือตาม — ซ้อม handoff ต่อคิวโดยไม่เปิดโหมดทีม

## รู้เพิ่ม

สายการผลิตหมายถึงของชิ้นก่อนต้องอยู่บนไฟล์ก่อน ชิ้นถัดไปถึงจะเริ่มได้ — และเมื่อขั้นถัดไปอยู่คนละเครื่องมือ (แผนจาก opencode ลงมือด้วยทีม claude) ไฟล์คือสะพานเดียวที่เชื่อได้ คำถามตัดสินยังเป็นคำเดิมจาก Module 02: ขั้นถัดไปต้องใช้ผลของขั้นก่อนหรือไม่
