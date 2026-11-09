# Module 05 — สายการผลิต แผนแล้วค่อยทำ

**ทำไปเพื่ออะไร:** แบ่งงานเป็นทอด ๆ ให้ข้อมูล สายหลังบ้าน และหน้าเว็บทำคนละชิ้น โดยแผนต้องมาก่อนของจริง

| เวลา | เครื่องมือ |
|---|---|
| **60 นาที** | OpenCode |

ทำในโฟลเดอร์แอป แล็บนี้ใช้ DuckDB ถ้ายังไม่มี ให้ลงตาม SETUP หรือเรียกวิทยากรก่อนถึงขั้นรัน SQL

## ก่อนเริ่ม

มี `docs/EXPLORATION-REPORT.md` ด่านยังไม่ครบ 6 ข้อ และตั้งใจให้ยังแดงเรื่องโน้ตกับ health

## แบบฝึกหัด

### 1. ให้คนวางแผนเขียนไฟล์เดียว

มี `.opencode/agents/planner.md` จาก Module 04 แล้ว ปิดเปิด `opencode` ใหม่เสมอ (ไฟล์บทบาทโหลดตอนเปิดรอบ) แล้ววาง:

```text
ให้ planner อ่าน docs/EXPLORATION-REPORT.md กับ data/README.md แล้วเขียน docs/TASKS.md
แบ่งเป็นสามสาย data, backend, frontend บอกว่าใครถือไฟล์ไหน
เขียนชัดว่าห้ามแก้ scripts/quality-gate.js
ห้ามวางแผนไปแก้ /api/notes หรือ /api/health ในแล็บนี้
```

เปิด `docs/TASKS.md` ด้วยตา ถ้ายังไม่มีสามสาย อย่าไปขั้นถัดไป ถ้ายังไม่มี `planner.md` ให้กลับไปขั้น 2 ของ Module 04 ก่อน

### 2. สร้าง developer แล้วทำทีละสาย ห้ามข้าม

สายส่งของแล็บนี้คือไฟล์ตัวตนของเอเจนต์: `planner.md` เขียน `docs/TASKS.md` แล้ว `developer.md` เป็นคนลงมือตามแผน เปิด `opencode` วาง:

```text
สร้าง .opencode/agents/developer.md ที่พาธนี้เป๊ะ ๆ ไม่ใช่ agents/ ที่รากโปรเจกต์
frontmatter ต้องมี description ว่า Use proactively to implement one task from docs/TASKS.md, mode: subagent และ permission: bash: deny
เนื้อหาในไฟล์: ทำงานเฉพาะ task ที่ได้รับมอบหมาย อ้างหมายเลข task ทุกครั้ง Node ล้วน ห้ามเพิ่ม dependency ห้ามแตะ scripts/quality-gate.js
จากนั้นปิดคำแนะนำนี้ไว้ก่อน: ให้ฉันเปิดรอบใหม่แล้วเรียก developer ทีละสาย
```

ปิดเปิด `opencode` ใหม่ (ไฟล์บทบาทโหลดตอนเปิดรอบ) แล้วเรียก developer ทีละสาย

สายข้อมูล:

```text
ใช้ agent developer ทำเฉพาะสาย data จาก docs/TASKS.md
เขียน docs/DESIGN.md อธิบายการทิ้งแถวขยะ การแปลงวันที่ พ.ศ. เป็น ISO และการดึงจังหวัด
เขียน scripts/clean-export.sql ของ DuckDB ที่อ่าน data/raw/dbd-2558.parquet แล้วส่งออก data/dataset.csv
อย่าแก้ server.js
```

จากนั้นรันเองในเทอร์มินัล ไม่ต้องให้ผู้ช่วยรันถ้าไม่มั่นใจ:

```powershell
duckdb -c ".read scripts/clean-export.sql"
```

Mac ใช้คำสั่งเดียวกัน

สายหลังบ้าน:

```text
ใช้ agent developer ทำเฉพาะสาย backend จาก docs/TASKS.md
แก้เฉพาะการคำนวณ /api/summary ใน server.js ให้ใช้ lib/csv.js
นับเฉพาะแถวที่ผ่านกฎใน data/README.md
ห้ามแก้การพังของ JSON, ห้ามเอา sample token ออกจาก /api/health, ห้ามทำให้โน้ตทนต่อการรีสตาร์ท
ห้ามแก้ scripts/quality-gate.js
```

สายหน้าเว็บ:

```text
ใช้ agent developer ทำเฉพาะสาย frontend จาก docs/TASKS.md
ปรับ web/ ให้โชว์จำนวนกิจการและทุนจาก /api/summary และมีข้อความบอกแหล่งข้อมูล
ห้ามแก้ scripts/quality-gate.js
```

### 3. ตรวจของจริงด้วยมือคุณเอง แล้วยอมรับว่ายังไม่ครบ

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

เปิดเทอร์มินัลอีกหน้าต่างรัน `npm start` แล้วเปิด `http://127.0.0.1:3000` — ต้องเห็น **16,772 กิจการ, ทุนรวม 45,341,868,784 บาท** จากนั้น `Ctrl+C` ปิดเซิร์ฟเวอร์**ก่อนรันด่าน** ไม่งั้นพอร์ตชน เคส HTTP แดงทั้งกลุ่มทั้งที่ข้อมูลสะอาดแล้ว

```powershell
npm run gate
echo $LASTEXITCODE
```

ต้องเห็น `PASS | data-quality` และ `PASS | summary-matches-valid-rows` exit เป็น `2` (ยังแดง 4 เคส) ข้อที่เกี่ยวกับโน้ตและ health ยังแดงได้ นั่นคืองาน Module 06 ถ้าได้ 6/6 ทั้งที่ยังไม่ถึง M06 — ผู้ช่วย "ช่วยแก้" เกินสเปก ให้ย้อนดู diff แล้วคุยกันในห้อง

ตัวเลขที่ควรเริ่มตรงคือ 16,772 กิจการ และทุนรวม 45,341,868,784 บาท ถ้ายังไม่ตรง อย่าไป Module 06

### 4. รอบรีวิว: อีกตาหนึ่งดู SQL กับสัญญา

วางต่อใน `opencode` (หรือเปิดรอบใหม่ก็ได้):

```text
ใช้ agent developer เทียบ scripts/clean-export.sql กับ docs/DESIGN.md แล้วเขียน docs/REVIEW.md สรุปจุดต่าง อ้างบรรทัดทุกข้อ ห้ามแก้ของ
```

📦 **Handoff ต่อ:** `docs/REVIEW.md` คือของที่คนไล่บั๊กใน Module 06 อ่านต่อ

จากเครื่องทดสอบจริง (opencode 2.2.5, `zai/glm-4.7-flash`, 7 พฤศจิกายน 2026):

- **planner.md ลืม YAML frontmatter** (เคสจากรอบที่ยังสร้างในโมดูลนี้ — ตอนนี้สร้างที่ Module 04) — เขียน description/mode/permission เป็นหัวข้อ markdown ธรรมดา ตรวจด้วยตาตั้งแต่ M04 ไฟล์ถึงจะถูกจับเป็น subagent ถ้าเจอไฟล์เสียให้เติมบล็อก `---` เองก่อนเรียก
- **SQL วนแก้สามรอบยังไม่ผ่าน** — รอบแรกอ้างชื่อคอลัมน์ผิด (`reg_date` ทั้งที่ parquet มี `reg_date_raw`), รอบสองชนชนิดข้อมูลตอนลบ 543 ปี, รอบสามยังใช้ `REGEXP` เป็นตัวดำเนินการซึ่ง DuckDB ไม่มี สุดท้ายใช้ทาง "ถ้าตามไม่ทัน" คัดลอก SQL อ้างอิงจาก `node scripts/catch-up.js w3` มารันแล้วผ่านทันที — นี่คือเหตุผลที่เฉลยมีไว้
- **วางข้อความคลิปบอร์ดภาษาไทยให้ opencode ต้องระวัง encoding** — ตั้งคลิปบอร์ดด้วย `Get-Content` โดยไม่ใส่ `-Encoding UTF8` แล้วข้อความไทยเพี้ยนเป็นตัวมั่วทั้งก้อนก่อนถูกส่ง (เคสจริง: ข้อความกลายเป็นเรื่อง A/B prefill ที่ไม่เกี่ยว) วิธีกัน: ตั้งคลิปบอร์ดแล้วกลับมาดูช่องพิมพ์ใน TUI ก่อนกด Enter เสมอ
- **อย่าให้มันแตะ `lib/inspect-data.js`** — รอบทดสอบมัน refactor `parseRows` ในไฟล์กฎให้เรียก `parseCsv` แต่ลืม import ทำให้ด่าน abort ทั้งตัว (`parseCsv is not defined`) แก้ด้วย `git checkout -- lib/inspect-data.js` กฎอยู่ไฟล์ที่แชร์กับด่าน แตะเมื่อไรด่านเสี่ยงเมื่อนั้น
- **พอร์ต 3000 ค้างหลังให้ผู้ช่วยทดสอบเอง** — มันรัน `npm start` ทิ้งไว้ ด่านรอบถัดมา FAIL ทั้งกลุ่มเซิร์ฟเวอร์ด้วย "port 3000 is already in use" ปิดทิ้ง (`Get-NetTCPConnection -LocalPort 3000` → `Stop-Process`) แล้วรันด่านใหม่

## ผ่านเมื่อ

- มี `.opencode/agents/planner.md` จาก Module 04 และ `.opencode/agents/developer.md` จากแล็บนี้ ที่ bash deny และฟิลด์เป็นอังกฤษ
- มี `docs/TASKS.md`, `docs/DESIGN.md` และ `scripts/clean-export.sql`
- SQL รันด้วยมือคุณเอง exit `0` และนับได้ ~16,773 บรรทัด วันที่ ISO ทุนเป็นตัวเลข
- หน้าเว็บโชว์ยอดจริง 16,772 / 45,341,868,784 แล้วปิดเซิร์ฟเวอร์ก่อนรันด่านแล้ว
- ด่านมี PASS สองข้อด้านข้อมูลและยอดสรุป exit `2`
- มี `docs/REVIEW.md` จากรอบรีวิว
- `git diff -- scripts/quality-gate.js lib/inspect-data.js` ว่าง
- ยังไม่ได้ “ช่วย” ปิดบั๊กโน้ตหรือ health

## ต่อยอด

สั่ง planner เพิ่ม task เรื่อง BOM ใน CSV แล้วทำตาม — ซ้อม handoff ต่อคิวด้วยไฟล์ล้วน ถ้า SQL ยังติดให้เทียบกับเฉลย `node scripts/catch-up.js w3` แบบอ่าน ไม่ใช่คัดลอก

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w3
```

ได้แผน SQL และ `server.js` ช่วงสรุป ถ้าไม่มี DuckDB ให้วิทยากรตามด้วยชุดที่ใส่ CSV สะอาด (`w7`) ก่อน Module 06 เท่านั้น อย่าใช้ `w7` ถ้ายังอยากเห็นไฟล์ดิบด้วยตัวเอง

## รู้เพิ่ม

สายการผลิตหมายถึงของชิ้นก่อนต้องอยู่บนไฟล์ ชิ้นถัดไปถึงจะเริ่ม คนตรวจของจริงอยู่แล็บหน้า ไม่ใช่คนเดียวกับคนเพิ่งเขียน
