# Module 07 — งานซ้ำทำให้เป็นมาตรฐาน

**ทำไปเพื่ออะไร:** ครั้งหน้าไม่ต้องอธิบายขั้นตอนปล่อยของใหม่ทั้งก้อน — พิมพ์ความตั้งใจแล้วให้ skill ถูกหยิบเอง

| เวลา | เครื่องมือ |
|---|---|
| **25 นาที** | Claude Code ทำเช็กลิสต์ |

ถ้าเวลาไม่พอ ให้ทำเช็กลิสต์จนจบ ความจำข้ามรอบอยู่ที่ [Module 10](../10-context-memory/LAB.md) วิทยากรสาธิตส่วนนั้นได้ ส่วนที่ยุบได้ทั้งแล็บคือ [Module 11](../11-feature/LAB.md)

ทำในโฟลเดอร์แอป

## ก่อนเริ่ม

ด่าน 6/6 จาก Module 06 รั้วกั้นคำสั่งอยู่ใน Module 09 ทำก่อนหรือหลังเช็กลิสต์นี้ได้

## แบบฝึกหัด

### 1. สร้าง skill และ release-manager (เอเจนต์ใหม่ที่มาพร้อม skill)

release-manager ไม่มีอยู่ก่อนหน้านี้ — ไฟล์นี้ถูกสร้างใหม่ในแล็บนี้เอง พรอมต์เดียวได้สองไฟล์ เปิด `claude` วางด้านล่าง (เลือกอย่างใดอย่างหนึ่ง) แล้วกดอนุญาตเมื่อถามเขียนไฟล์:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .claude/skills/release-checklist/SKILL.md.
English description: Use before releasing the Registry Insight app.
Body: run four checks in order — the server boots, /api/health has no sk- (never print the value), the server is stopped before running the gate, run npm run gate and record the real exit code.
Then create .claude/agents/release-manager.md that uses this skill (frontmatter has skills: release-checklist), includes Bash in tools, and never prints any sk- value.
Write both real files with the Write tool — do not reply with text only.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
สร้าง .claude/skills/release-checklist/SKILL.md
description ภาษาอังกฤษ: Use before releasing the Registry Insight app
เนื้อหาให้ตรวจสี่อย่างตามลำดับ: เซิร์ฟเวอร์เปิดได้, /api/health ไม่มี sk- โดยห้ามพิมพ์ค่า, ปิดเซิร์ฟเวอร์ก่อนรันด่าน, รัน npm run gate แล้วบันทึก exit code จริง
จากนั้นสร้าง .claude/agents/release-manager.md ที่ใช้ skill นี้ (frontmatter มี skills: release-checklist) มี Bash ใน tools แต่ห้ามพิมพ์ค่า sk-
เขียนสองไฟล์จริงด้วยเครื่องมือ Write อย่าตอบเป็นข้อความอย่างเดียว
```

เปิดทั้งสองไฟล์ด้วยตา: `SKILL.md` ต้องมี `description` อังกฤษกับสี่ขั้น, `release-manager.md` ต้องมีบรรทัด `skills: release-checklist` กับ `Bash` ใน tools (ต่างจาก data-researcher เพราะต้องรันเซิร์ฟเวอร์กับ gate)

> 📚 **รู้เพิ่ม:** `description` ต้องเป็นอังกฤษเพราะเป็นสิ่งที่ Claude ใช้จับคู่งานกับ skill — ประโยคที่คุณพิมพ์ต้องตรงกับคำใน description ถึงจะถูกหยิบเอง

### 2. พิสูจน์ว่าถูกหยิบเอง

ปิดแล้วเปิด `claude` ใหม่ แล้วพิมพ์แค่ความตั้งใจ ไม่เอ่ยชื่อ skill (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@release-manager Help me release the Registry Insight app now. Walk me through it.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
@release-manager ช่วย Release "Registry Insight App" ตอนนี้ พาฉันทำทีละขั้น
```

ผลที่คาดหวัง: คำตอบเดินครบสี่ขั้น ถ้าไม่ถูกหยิบเอง ดูสองจุด: คำใน `description` ตรงกับประโยคที่พิมพ์หรือไม่ หรือเอ่ยชื่อ `release-checklist` ตรง ๆ ก่อน แล้ว**จดว่ารอบของคุณถูกหยิบเองหรือต้องเอ่ยชื่อ** — นี่คือข้อมูลสดของห้อง

### 3. ให้ release-manager เดินเช็กลิสต์เอง

วาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@release-manager Run the release checklist now. Report PASS or FAIL for each check with evidence, and if you run the gate, report its real exit code.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
@release-manager รัน release checklist เลย รายงานผลข้อละ PASS หรือ FAIL พร้อมหลักฐาน ถ้ารัน gate ให้บอก exit code จริง
```

ผลที่คาดหวัง: เดินสี่ขั้นเองโดยคุณไม่ต้องเอ่ยชื่อ skill กดอนุญาตคำสั่งที่มันขอ แล้วเทียบไฟล์กับ data-researcher:

```powershell
Get-Content .claude/agents/release-manager.md
Get-Content .claude/agents/data-researcher.md
```

จุดที่ต้องเห็น: ต่างกันที่ `description` (งาน release), `tools` (มี Bash) และ `skills: release-checklist` — เหตุผลที่ไม่เอาหน้าที่ปล่อยของไปแปะที่ตัวอ่านอย่างเดียว

📦 **Handoff:** ผล PASS/FAIL ของ release-manager คือสิ่งที่ Module 13 เรียกดูอีกครั้งก่อน deploy

## ผ่านเมื่อ

- มี `.claude/skills/release-checklist/SKILL.md` ครบสี่ขั้น `description` อังกฤษ
- `.claude/agents/` ครบ 4 ตัวตามที่แต่ละโมดูลสร้าง: `data-researcher` (M04), `developer` (M05), `qa` (M06), `release-manager` (M07)
- จดแล้วว่า skill ถูกหยิบเองหรือต้องเอ่ยชื่อ
- release-manager เดินเช็กลิสต์เองโดยไม่ต้องเอ่ยชื่อ skill และรายงาน exit code จริงของด่าน

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ไม่ถูกหยิบเอง | `description` ไม่ตรงกับประโยคที่พิมพ์ | เอ่ยชื่อ `release-checklist` ตรง ๆ หรือปรับ description |
| `Agent type not found` | ยังไม่ปิดเปิดใหม่ | ปิดแล้วเปิด `claude` ใหม่ |
| release-manager หยุดกลางเช็กลิสต์ | ยังไม่กดอนุญาตคำสั่ง node | กดอนุญาตในกล่อง TUI |
| ได้แต่คำอธิบายไม่มีไฟล์ | โมเดลตอบข้อความล้วน | สั่ง "สร้างสองไฟล์จริงด้วยเครื่องมือ Write" |

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w5
```

ได้เช็กลิสต์และไฟล์ความจำอ้างอิง ให้อ่านเช็กลิสต์แล้วเรียกใช้เองหนึ่งรอบ ไฟล์ความจำใช้ใน Module 10

## ต่อยอด

สั่ง release-manager ตรวจซ้ำหลังแก้ตาม Module 07 — รอบถัดไปที่ของเปลี่ยน ให้ดูว่า FAIL ไหนกลายเป็น PASS

## รู้เพิ่ม

เช็กลิสต์คือวิธีทำงานที่ทำซ้ำได้ ไม่ใช่ที่เก็บคีย์ อย่าเขียนค่าหรือตัวอย่างโทเคนลงไฟล์ skill เด็ดขาด
