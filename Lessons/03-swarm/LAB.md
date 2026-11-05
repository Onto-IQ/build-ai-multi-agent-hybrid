# Module 03 — ให้หลายคนสำรวจพร้อมกัน

**ทำไปเพื่ออะไร:** ได้ภาพรวมของแอปและข้อมูลเร็ว โดยยังไม่ให้ใครแก้ของ

| เวลา | เครื่องมือ |
|---|---|
| **50 นาที** | Claude Code |

ทำในโฟลเดอร์แอป

## ก่อนเริ่ม

มี `CLAUDE.md` จาก Module 02 ด่านยังเป็น exit 2

## แบบฝึกหัด

### 1. สั่งสำรวจ แล้วให้รวมเป็นรายงานเดียว

เปิด `claude` ที่โฟลเดอร์แอป วางทั้งก้อน:

```text
Explore this Registry Insight repo with three parallel read-only explorers. Do not edit files.
Explorer A: how server.js serves /api/summary, /api/health, and POST /api/notes. Cite file:line.
Explorer B: what is wrong with data/dataset.csv compared with data/README.md. Name real columns.
Explorer C: what scripts/quality-gate.js checks, and why the starter is expected to fail.
Write one file docs/EXPLORATION-REPORT.md in Thai with these headings:
## โครงสร้าง
## คุณภาพข้อมูล
## จุดเสี่ยง
End with the sentence: ห้ามแก้ไฟล์ในรอบสำรวจ
Include the paths server.js, data/dataset.csv, scripts/quality-gate.js, data/raw/dbd-2558.parquet, and the endpoints /api/summary and /api/notes.
```

ถนัดไทย ให้วางก้อนนี้แทนได้ คำสั่งเดียวกัน:

```text
สำรวจ repo นี้ด้วยผู้ช่วยอ่านอย่างเดียวสามคนพร้อมกัน ห้ามแก้ไฟล์
คนที่หนึ่งอธิบาย server.js เรื่อง /api/summary, /api/health และ POST /api/notes โดยอ้างไฟล์และบรรทัด
คนที่สองบอกว่า data/dataset.csv พังตรงไหนเมื่อเทียบกับ data/README.md
คนที่สามบอกว่า scripts/quality-gate.js ตรวจอะไร และทำไมชุดเริ่มต้องไม่ผ่าน
เขียนไฟล์เดียว docs/EXPLORATION-REPORT.md เป็นภาษาไทย มีหัวข้อ ## โครงสร้าง ## คุณภาพข้อมูล ## จุดเสี่ยง
ปิดท้ายด้วยประโยค ห้ามแก้ไฟล์ในรอบสำรวจ
ต้องมีชื่อ server.js, data/dataset.csv, scripts/quality-gate.js, data/raw/dbd-2558.parquet, /api/summary และ /api/notes
```

### 2. เปิดไฟล์ด้วยตา

อย่าเชื่อเฉพาะข้อความในแชท เปิด `docs/EXPLORATION-REPORT.md` แล้วหาสามหัวข้อ ถ้าผู้ช่วยเล่าในแชทแต่ไม่มีไฟล์ ให้สั่งว่า "เขียนลง `docs/EXPLORATION-REPORT.md` ด้วยเครื่องมือ Write จริง"

## ผ่านเมื่อ

- มีไฟล์รายงานครบสามหัวข้อ และมีประโยคห้ามแก้ไฟล์
- ในรายงานมีชื่อไฟล์และ endpoint ตามที่สั่ง
- `git status` ไม่มี `server.js` หรือ CSV ในรายการที่ถูกแก้

โหมดเพื่อนร่วมทีมของ Claude เป็นขั้นต่อยอด ถ้าเหลือเวลาให้ถามรายงานเดิมว่าข้อไหนที่สามคนเห็นตรงกัน ไม่ทำก็ยังผ่านแล็บนี้

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w1
```

จาก repo บทเรียน จะได้รายงานอ้างอิง ให้อ่านแล้วค่อยสั่งรอบสำรวจสั้น ๆ เอง เพื่อให้เห็นว่าผู้ช่วยอ้างไฟล์จริง

## รู้เพิ่ม

สำรวจพร้อมกันเหมาะกับงานอ่าน คนละมุมแล้วค่อยรวมเล่ม งานที่ต้องเรียงลำดับ เช่น วางแผนก่อนแล้วค่อยแก้ของ จะไปทำใน Module 05
