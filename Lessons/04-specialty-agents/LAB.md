# Module 04 — สร้างผู้เชี่ยวชาญทั้งสองฝั่ง

**ทำไปเพื่ออะไร:** มีผู้ช่วยเฉพาะเรื่องที่อ่านอย่างเดียว แล้วเห็นว่าสองเครื่องมือเก็บไฟล์คนละที่

| เวลา | เครื่องมือ |
|---|---|
| **50 นาที** | Claude Code และ OpenCode |

ทำในโฟลเดอร์แอป ยังไม่ต่อ MCP

## ก่อนเริ่ม

มีรายงานจาก Module 03

## แบบฝึกหัด

### 1. สร้างฝั่ง Claude

เปิด `claude` วางก้อนนี้ แล้วยอมให้เขียนไฟล์เมื่อมันถาม:

```text
สร้าง .claude/agents/data-researcher.md
เขียนไฟล์จริงด้วยเครื่องมือ Write อย่าตอบเป็นข้อความอย่างเดียว
frontmatter: name เป็น data-researcher, description ขึ้นต้น Use proactively และบอกว่าอ่านอย่างเดียว, tools เป็น Read, Grep, Glob เท่านั้น, model เป็น sonnet
เนื้อหาให้ตอบโดยอ้าง file:line และห้าม Edit, Write, Bash
ห้ามแก้ server.js หรือ CSV
```

ถ้าได้แต่คำอธิบายไม่มีไฟล์ ให้สั่งซ้ำว่า "สร้างไฟล์จริงด้วยเครื่องมือ Write เดี๋ยวนี้" แล้วตรวจว่ามี `.claude/agents/data-researcher.md` ก่อนไปต่อ

ปิด Claude แล้วเปิดใหม่ ไฟล์ผู้ช่วยถูกอ่านตอนเปิดรอบใหม่เท่านั้น จากนั้นวาง:

```text
@data-researcher อธิบายว่า POST /api/notes ทำอะไร ทุกข้ออ้างต้องมี server.js:บรรทัด ห้ามแก้ไฟล์
```

### 2. สร้างฝั่ง OpenCode

เปิด `opencode` ที่โฟลเดอร์เดียวกัน วาง:

```text
สร้าง .opencode/agents/data-researcher.md
frontmatter แบบนี้
description: Read-only researcher. Use proactively. Cite file:line.
mode: subagent
permission:
  edit: deny
  bash: deny
เนื้อหา: อ่านอย่างเดียว ห้ามแก้ไฟล์ ห้ามรันคำสั่ง ตอบโดยอ้าง file:line
ห้ามแก้ server.js
```

เปิด `.opencode/agents/data-researcher.md` ด้วยตา ต้องเห็น frontmatter ครบ ถ้าโมเดลสร้างผิดที่ ให้ย้ายไฟล์เองก่อนขั้นถัดไป ปิดแล้วเปิด `opencode` ใหม่ แล้วถามคำถามเดียวกันเรื่อง `POST /api/notes`

### 3. เทียบสั้น ๆ ในแชท

เขียนสามบรรทัดลง `docs/TOOL-COMPARE.md` ด้วยตัวเองหรือสั่งผู้ช่วยให้เขียนเฉพาะไฟล์นี้

- ไฟล์ผู้ช่วยของ Claude อยู่ที่ไหน ของ OpenCode อยู่ที่ไหน
- อันไหนอ้างบรรทัดได้ชัดกว่า
- อันไหนพยายามจะแก้ไฟล์หรือไม่

## ผ่านเมื่อ

- มี `.claude/agents/data-researcher.md` ที่ tools ไม่มี Bash, Edit, Write
- มี `.opencode/agents/data-researcher.md` ที่ห้าม edit และ bash
- คำตอบทั้งสองรอบมี `server.js:` อย่างน้อยหนึ่งจุด
- ไฟล์แอปไม่ถูกแก้ และยังไม่มี `.mcp.json`

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w2
```

ได้อ่านไฟล์ผู้ช่วยอ้างอิงทั้งสองฝั่ง แล้วให้เปิดรอบใหม่เพื่อเรียกใช้เอง

## รู้เพิ่ม

ผู้ช่วยเฉพาะเรื่องคือพนักงานที่รับงานชนิดเดียว คนอ่านข้อมูลไม่ควรมีสิทธิ์แก้โปรแกรม [LAB-permissions.md](LAB-permissions.md) จะล็อกสิทธิ์นี้ให้แน่นขึ้นอีก
