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

เปิด `opencode` วาง:

```text
สร้าง .opencode/agents/planner.md ที่เขียนได้เฉพาะ docs/TASKS.md และห้ามเขียนโค้ด
จากนั้นปิดคำแนะนำนี้ไว้ก่อน: ให้ฉันเปิดรอบใหม่แล้วเรียก planner
```

ปิดแล้วเปิด `opencode` ใหม่:

```text
ให้ planner อ่าน docs/EXPLORATION-REPORT.md กับ data/README.md แล้วเขียน docs/TASKS.md
แบ่งเป็นสามสาย data, backend, frontend บอกว่าใครถือไฟล์ไหน
เขียนชัดว่าห้ามแก้ scripts/quality-gate.js
ห้ามวางแผนไปแก้ /api/notes หรือ /api/health ในแล็บนี้
```

เปิด `docs/TASKS.md` ด้วยตา ถ้ายังไม่มีสามสาย อย่าไปขั้นถัดไป

### 2. ทำทีละสาย ห้ามข้าม

สายข้อมูล:

```text
ทำเฉพาะสาย data จาก docs/TASKS.md
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
ทำเฉพาะสาย backend จาก docs/TASKS.md
แก้เฉพาะการคำนวณ /api/summary ใน server.js ให้ใช้ lib/csv.js
นับเฉพาะแถวที่ผ่านกฎใน data/README.md
ห้ามแก้การพังของ JSON, ห้ามเอา sample token ออกจาก /api/health, ห้ามทำให้โน้ตทนต่อการรีสตาร์ท
ห้ามแก้ scripts/quality-gate.js
```

สายหน้าเว็บ:

```text
ทำเฉพาะสาย frontend จาก docs/TASKS.md
ปรับ web/ ให้โชว์จำนวนกิจการและทุนจาก /api/summary และมีข้อความบอกแหล่งข้อมูล
ห้ามแก้ scripts/quality-gate.js
```

### 3. ตรวจด่าน แล้วยอมรับว่ายังไม่ครบ

ปิด `npm start` ถ้ายังเปิดอยู่

```powershell
npm run gate
```

ต้องเห็น `PASS | data-quality` และ `PASS | summary-matches-valid-rows` ข้อที่เกี่ยวกับโน้ตและ health ยังแดงได้ นั่นคืองาน Module 06

ตัวเลขที่ควรเริ่มตรงคือ 16,772 กิจการ และทุนรวม 45,341,868,784 บาท ถ้ายังไม่ตรง อย่าไป Module 06

## ผ่านเมื่อ

- มี `docs/TASKS.md`, `docs/DESIGN.md` และ `scripts/clean-export.sql`
- ด่านมี PASS สองข้อด้านข้อมูลและยอดสรุป
- ยังไม่ได้ “ช่วย” ปิดบั๊กโน้ตหรือ health

## ถ้าตามไม่ทัน

```bash
node scripts/catch-up.js w3
```

ได้แผน SQL และ `server.js` ช่วงสรุป ถ้าไม่มี DuckDB ให้วิทยากรตามด้วยชุดที่ใส่ CSV สะอาด (`w7`) ก่อน Module 06 เท่านั้น อย่าใช้ `w7` ถ้ายังอยากเห็นไฟล์ดิบด้วยตัวเอง

## รู้เพิ่ม

สายการผลิตหมายถึงของชิ้นก่อนต้องอยู่บนไฟล์ ชิ้นถัดไปถึงจะเริ่ม คนตรวจของจริงอยู่แล็บหน้า ไม่ใช่คนเดียวกับคนเพิ่งเขียน
