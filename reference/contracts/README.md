# สัญญาตัวอย่าง

ไฟล์ในนี้เป็นตัวอย่างโครง ไม่ใช่คำตอบของแอป ผู้เรียนส่วนใหญ่ส่งงานด้วยไฟล์ Markdown ใน repo แอป (`docs/EXPLORATION-REPORT.md`, `docs/QA-REPORT.md`, `docs/EXECUTIVE-SUMMARY.md`)

ถ้ารอบไหนอยากส่งต่องานเป็น JSON ให้วางไฟล์ใน `workspace/contracts/` ของ repo บทเรียน แล้วรัน:

```bash
node scripts/validate-json.mjs
```

| ไฟล์ | ใช้เมื่อ |
|---|---|
| `handoff.example.json` | ส่งจาก OpenCode (สายการผลิต) ไปให้ Claude (คนตรวจ) |
| `audit-result.example.json` | ผลด่าน 6/6 และด่านงบ |
| `synthesize-report.example.json` | สรุปผู้บริหารโดย OpenCode ไม่เกิน 400 คำ |
| `capstone-ship.example.json` | URL จริงบน Vercel และโน้ตแบบอ่านอย่างเดียว |

ไม่มีสัญญาสำหรับบอร์ดคัมบังในคลาสนี้
