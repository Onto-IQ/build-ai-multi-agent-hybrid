# Build AI Multi-Agent — Claude Code + OpenCode

หลักสูตร 2 วันแบบไฮบริดสำหรับจงสถิตย์ **12–13 พฤศจิกายน 2026** (ลูกค้า 9Expert, ผู้เรียนในห้อง 11 คน ส่วนใหญ่ไม่ใช่สายไอที)

โจทย์คือแอป **Registry Insight** แดชบอร์ดธุรกิจจดทะเบียนใหม่จากข้อมูลจริงของ data.go.th เริ่มแดง **0/6** แล้วพาให้ผ่านด่านคุณภาพ **6/6** จากนั้นเปิดให้คนอื่นดูบน Vercel

- บทเรียนอยู่ที่ repo นี้: https://github.com/Onto-IQ/build-ai-multi-agent-hybrid
- แอปอยู่ที่อีก repo: https://github.com/Onto-IQ/multi-agent-workshop-hybrid

เปิด Claude Code และ OpenCode ที่โฟลเดอร์แอปเท่านั้น โฟลเดอร์นี้มีเฉลย ผู้ช่วยจะเห็นคำตอบถ้าเปิดผิดที่

## ได้อะไรจากสองวันนี้

1. เครื่องพร้อมก่อนวันเรียน เข้าห้องแล้วเช็กประมาณ 15 นาที
2. สั่งผู้ช่วยให้อ่านกติกาก่อนลงมือ แล้วสำรวจงานพร้อมกันโดยยังไม่ให้แก้ของ
3. สร้างผู้เชี่ยวชาญบนทั้ง Claude Code และ OpenCode แล้วล็อกสิ่งที่ห้ามแตะ
4. แบ่งงานเป็นสายการผลิตด้วย OpenCode จนข้อมูลสะอาด แล้วให้ Claude ตรวจและปิดด่าน 6/6
5. กันคำสั่งอันตรายและงบ ทำเช็กลิสต์งานซ้ำ และจำข้อตกลงข้ามรอบ
6. สรุปให้ผู้บริหารอ่านได้ไม่เกิน 400 คำ แล้วได้ลิงก์จริงบน Vercel โดยไม่ใส่คีย์โมเดลขึ้นไป

## สอง repo

| Repo | ใช้ทำอะไร |
|---|---|
| **hybrid** (repo นี้) | บทเรียน แบบฝึกหัด สคริปต์ตรวจ และชุดตามให้ทัน |
| **multi-agent-workshop-hybrid** | แอป Registry Insight ที่รัน `claude` และ `opencode` |

## ตารางสองวัน (สอนประมาณ 6 ชั่วโมงต่อวัน)

ลำดับโฟลเดอร์อยู่ที่ `Lessons/01` ถึง `Lessons/13` แบบเดียวกับคอร์ส Claude อย่างเดียว เส้นสิทธิ์ของห้องไฮบริดเป็นพาร์ตท้ายของ Module 04 ใน `LAB.md` เดียวกัน

วันที่ 1 — รู้จักงาน แล้วเดินสายการผลิต

| ช่วง | นาที | เครื่องมือ |
|---|---|---|
| เช็กเครื่องในห้อง ([Module 01](Lessons/01-environment-setup/LAB.md)) | 15 | ทั้งคู่ |
| บรรยายแนวคิดผู้ช่วยหลายคน และทำไมต้องใช้สองเครื่องมือ | 60 | วิทยากร |
| [Module 02 รู้จักแอป](Lessons/02-agent-foundations/LAB.md) | 40 | Claude แล้ว OpenCode อ่านต่อ |
| [Module 03 สำรวจพร้อมกัน](Lessons/03-swarm/LAB.md) | 50 | Claude Code |
| [Module 04 ผู้เชี่ยวชาญคนละสายงาน](Lessons/04-specialty-agents/LAB.md) | 50 | Claude Code + OpenCode |
| [พาร์ตรั้วเส้นสิทธิ์ (ขั้น 4 ของ Module 04)](Lessons/04-specialty-agents/LAB.md) | 30 | ทั้งคู่ |
| [Module 05 สายการผลิต](Lessons/05-sequential-orchestration/LAB.md) | 70–80 | OpenCode วางแผน · Claude ทีมลงมือ |
| สรุปวันและเวลาเผื่อ | 55 | — |

วันที่ 2 — ปิดด่าน สรุปผู้บริหาร แล้วส่งของจริง

| ช่วง | นาที | เครื่องมือ |
|---|---|---|
| ทบทวนของเมื่อวาน | 15 | — |
| [Module 06 แก้ปมและมีคนตรวจ](Lessons/06-fix-and-qa/LAB.md) | 50 | Claude Code |
| [Module 07 เช็กลิสต์ปล่อยของ](Lessons/07-skills/LAB.md) | 25 | Claude Code |
| สาธิต MCP ([Module 08 วิทยากรเท่านั้น](Lessons/08-mcp/LAB.md)) | 15 | วิทยากร |
| [Module 09 กันความเสี่ยงและงบ](Lessons/09-guardrails-hooks/LAB.md) | 45 | ทั้งคู่ |
| [Module 10 ความจำข้ามรอบ](Lessons/10-context-memory/LAB.md) | 20 | OpenCode |
| [Module 11 ฟีเจอร์ของตัวเอง](Lessons/11-feature/LAB.md) **ย่อได้** | 60 | เลือกเอง |
| [Module 12 ทีมปิดงาน](Lessons/12-capstone/LAB.md) | 60 | Claude ทำของ, OpenCode สรุป |
| [Module 13 ขึ้น Vercel](Lessons/13-deploy-preflight/LAB.md) | 40 | สั่ง CLI ผ่าน prompt |
| ปิดห้อง | 30 | — |

ถ้าห้องช้า ให้ย่อ Module 11 เหลือ 30 นาทีหรือทำเป็นกลุ่ม ส่วนความจำใน Module 10 ให้วิทยากรสาธิตได้

ตัดออกจากห้องนี้: บอร์ด Flux, A2A, แล็บเลือกทำ MCP เทียบ CLI, Coolify และ Hostinger

## ก่อนวันเรียน

ทำ [SETUP.md](SETUP.md) ให้จบ แล้วรันสคริปต์ตรวจความพร้อม วันเรียนไม่ลงโปรแกรมทั้งห้อง

## ถ้าตามไม่ทัน

จาก repo บทเรียน:

```bash
node scripts/catch-up.js w1
```

รหัสชุดกับแล็บอยู่ที่ [solutions/README.md](solutions/README.md) ชุด `w7` และ `w9` จะวางไฟล์ข้อมูลที่สะอาดทับของเดิม

ตรวจชุดอ้างอิงโดยไม่ต้องมีแอป:

```bash
node scripts/check-solutions.mjs
node scripts/gate-quality.mjs
```

## สิ่งที่ปรับจากแผนตั้งต้น

- Module 03 ผ่านเมื่อมีรายงานสำรวจ โหมดทีมของ Claude เป็นขั้นต่อยอด ไม่ใช่เงื่อนไขผ่าน
- Module 05 เป็นคิวไฟล์บน OpenCode ไม่ใช้โหมดเพื่อนร่วมทีมของ Claude
- Module 12 ใช้ 5 บทบาท ไม่ใช่ 6 คนบน Claude คนเดียว คนสรุปอยู่ที่ OpenCode
- DuckDB เตือนไว้ก่อน Module 05 ไม่ทำให้การบ้านทั้งก้อนตก uv ใช้เฉพาะสาธิตของวิทยากร
- โน้ตบน Vercel เป็นอ่านอย่างเดียว อธิบายไว้ใน Module 13 ของบนเครื่องยังต้องเซฟลงไฟล์เพื่อผ่านด่าน 6/6

รายการที่ปิดแล้วใน repo แอปอยู่ที่ [reference/workshop-followups.md](reference/workshop-followups.md)
