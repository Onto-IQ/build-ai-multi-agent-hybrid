# Module 12 — ปิดงานเป็นทีม แล้วสรุปให้คนที่ไม่เขียนโค้ด

**ทำไปเพื่ออะไร:** ได้รายงานสั้นจากข้อมูลจริง ที่เอาไปเล่าต่อได้โดยไม่ต้องเปิดโปรแกรม

| เวลา | เครื่องมือ |
|---|---|
| **60 นาที** | Claude Code สี่บทบาท · OpenCode คนสรุป |

ทำในโฟลเดอร์แอป ด่านต้องเป็น 6/6 ก่อนเริ่มสรุป

## ก่อนเริ่ม

รัน `npm run gate` ต้อง exit 0 ก่อนตั้งทีมเสมอ — ทีมที่วิ่งบนของแดง จะสร้างของเสียสองชั้น (งานที่ทำไปกับข้อมูลเสีย และงานที่ต้องทำใหม่)

ยอดที่อนุญาตให้ใช้มีชุดเดียว: **16,772** กิจการ และทุนรวม **45,341,868,784** บาท จังหวัดทุนสูงสุดคือกรุงเทพมหานคร ภาคทุนสูงสุดคือภาคกลาง ถ้าทำฟีเจอร์ของตัวเองใน Module 11 ไว้ ระบุด้วยว่ามันต้องรอดถึงรอบ release นี้

ห้ามให้ Claude เขียนสรุปผู้บริหาร คนสรุปคือ OpenCode

## แบบฝึกหัด

### 1. ให้ Claude จัดของให้ตรงกัน

เปิด `claude` แล้ววาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the four roles in .claude/agents — if any file is missing, create it with the Write tool for real; do not reply with text only: planner, data-researcher, developer, qa.
Follow this order only: a task that consumes another agent's output must not run before that agent finishes.
planner writes docs/PRODUCT-SPEC.md and docs/TASKS.md to match the app as it is now, and if there is a Module 11 feature, records that it must survive the release.
data-researcher is read-only and delivers its figures as a short shared file for the team.
developer may edit only when the /api/summary figures do not match 16,772 and 45341868784.
qa runs npm run gate and must never claim a pass unless it is exit 0.
Do not create the executive summary. Do not edit scripts/quality-gate.js.
Never put in a key.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
ใช้สี่บทบาทใน .claude/agents ถ้าไฟล์ไหนยังไม่มีให้สร้างด้วยเครื่องมือ Write จริง อย่าตอบเป็นข้อความอย่างเดียว: planner, data-researcher, developer, qa
ทำตามลำดับนี้เท่านั้น งานที่ต้องใช้ผลของอีกตัวห้ามรันก่อนตัวนั้นเสร็จ
planner เขียน docs/PRODUCT-SPEC.md กับ docs/TASKS.md ให้ตรงกับแอปตอนนี้ และถ้ามี feature จาก Module 11 ให้บันทึกว่าต้องรอดถึง release
data-researcher อ่านอย่างเดียว ส่งยอดเป็นไฟล์สั้นให้ทีมใช้ร่วมกัน
developer แก้ได้เฉพาะเมื่อยอด /api/summary ไม่ตรง 16,772 และ 45341868784
qa รัน npm run gate และห้ามบอกผ่านถ้าไม่ใช่ exit 0
ห้ามสร้างสรุปผู้บริหาร ห้ามแก้ scripts/quality-gate.js
ห้ามใส่คีย์
```

### 2. ให้ OpenCode เขียนสรุป

เปิด `opencode` แล้ววาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .opencode/agents/synthesizer.md at exactly this path — not agents/ at the project root.
The frontmatter must have description, mode: subagent, and permission: bash: deny.
File body: you may write only docs/EXECUTIVE-SUMMARY.md — no code, no commands. Use only figures from the handoff files (docs/PRODUCT-SPEC.md · docs/QA-REPORT.md · docs/ANALYSIS.md and docs/region-capital.csv if present). Never guess a number.
Then have synthesizer read those handoff files first, then write a Thai summary of at most 400 words for people who do not write code.
It must contain the figures 16,772 and 45,341,868,784.
It must name กรุงเทพมหานคร and the word กลาง.
It must have the headings ## ภาพรวมทุนจดทะเบียน and ## ข้อเสนอแนะ.
Never invent new figures. Do not edit server.js.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
สร้าง .opencode/agents/synthesizer.md ที่พาธนี้เป๊ะ ๆ ไม่ใช่ agents/ ที่รากโปรเจกต์
frontmatter ต้องมี description, mode: subagent และ permission: bash: deny
เนื้อหาในไฟล์: เขียนได้เฉพาะ docs/EXECUTIVE-SUMMARY.md ไฟล์เดียว ห้ามเขียนโค้ด ห้ามรันคำสั่ง ยึดตัวเลขจากไฟล์ handoff เท่านั้น (docs/PRODUCT-SPEC.md · docs/QA-REPORT.md · docs/ANALYSIS.md และ docs/region-capital.csv ถ้ามี) ห้ามเดาตัวเลข
จากนั้นให้ synthesizer อ่านไฟล์ handoff เหล่านั้นก่อน แล้วเขียนสรุปภาษาไทยไม่เกิน 400 คำ สำหรับคนที่ไม่เขียนโปรแกรม
ต้องมียอด 16,772 และ 45,341,868,784
ต้องมีชื่อกรุงเทพมหานครและคำว่ากลาง
ต้องมีหัวข้อ ## ภาพรวมทุนจดทะเบียน และ ## ข้อเสนอแนะ
ห้ามแต่งตัวเลขชุดใหม่ ห้ามแก้ server.js
```

เปิด `.opencode/agents/synthesizer.md` ด้วยตา ต้องเห็น frontmatter ครบ ถ้าโมเดลสร้างผิดที่ ให้ย้ายไฟล์เองก่อนเรียกใช้ แล้วเปิดไฟล์สรุปด้วยตา นับคร่าว ๆ ว่าไม่ยาวเกินหนึ่งหน้าจอ

### 3. ตรวจด่านอีกรอบ และเทียบเลขสรุปกับ API

ปิด `npm start` ถ้าเปิดค้างอยู่ แล้ว:

```powershell
npm run gate
echo $LASTEXITCODE
```

ต้องยังเป็น 6/6 exit 0 แล้วเปิด `docs/EXECUTIVE-SUMMARY.md` เทียบตัวเลขกับ `/api/summary` — **เลขคนละชุดระหว่างสรุปผู้บริหารกับ API คือของเสียชิ้นใหญ่ที่สุดของงานแบบนี้** เทียบทุกครั้งก่อนส่ง

## ผ่านเมื่อ

- มีสรุปภาษาไทยที่มีสองหัวข้อและสองยอดข้างต้น
- ความยาวไม่เกิน 400 คำ และเลขตรงกับ `/api/summary` เป๊ะ
- ฟีเจอร์จาก Module 11 (ถ้ามี) ยังอยู่บนหน้าเว็บในรอบ release
- ด่านยังเป็น 6/6 exit 0 และ `scripts/quality-gate.js` ไม่ถูกแก้
- คนสรุปเป็น OpenCode ตามไฟล์ `.opencode/agents/synthesizer.md`

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ทีมจบแต่ไฟล์ไม่เกิด | เป็นแผน ไม่ได้สั่งทำ | เติม "Execute, do not only plan" แล้วสั่งใหม่ |
| หมดเทิร์นกลางสเปก | งานยาว | อยู่ใน TUI และสั่งว่าห้ามสำรวจซ้ำ |
| feature หายจากหน้าเว็บหลังทีมทำงาน | ไม่ได้ใส่ไว้ใน TASKS | สั่ง developer "คืน feature จาก Module 11 ตาม docs/PRODUCT-SPEC.md" |
| ยอดในสรุปไม่ตรง API | คนสรุปไม่ได้อ่าน handoff / ไม่เทียบ JSON | สั่ง qa เขียนยอดจาก `/api/summary` ลงไฟล์สั้น ๆ แล้วสั่ง synthesizer อ่านไฟล์นั้นใหม่ |
| `Agent type not found: planner` | ยังไม่รีสตาร์ท / ยังไม่เปิด `/agents` ให้ระบบเห็นไฟล์ใหม่ | รีสตาร์ทหรือเปิด `/agents` แล้วเรียกใหม่ |
| งบหมดกลางทาง | ทีมแพงประมาณ 15 เท่าของแชทเดี่ยว | ยุบเหลือ planner, developer, qa |
| คิดเงินรายครั้ง | `ANTHROPIC_API_KEY` ค้าง | unset ก่อนเปิด TUI |

## ต่อยอด

- สั่ง release-manager จาก Module 07 รัน release checklist กับฉบับนี้ — ผล PASS/FAIL เป็นของที่ Module 13 ใช้ต่อก่อน deploy
- **สร้าง `writer.md` ฝั่ง Claude** (tools เป็น Read, Grep, Glob, Write, Bash — ต่างจาก synthesizer ตรงที่เรียก API สดได้) แล้วสั่งให้เขียนสรุปฉบับของตัวเอง เมื่อเซิร์ฟเวอร์เปิดอยู่ให้ตรวจยอดเองด้วย `powershell -NoProfile -Command "Invoke-RestMethod http://127.0.0.1:3000/api/summary | ConvertTo-Json -Compress"` จากนั้นเปิดสรุปสองฉบับ (synthesizer vs writer) เทียบกัน — คนละโมเดลคนละเครื่องมือ แต่**ยอดต้องตรงกันเป๊ะ** ถ้าไม่ตรง คือของเสียที่ต้องจับให้เจอ

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w9
```

ได้ชุดของปิดงานครบ รวมไฟล์ที่ใช้ขึ้น Vercel (โน้ตเป็นโหมดอ่านอย่างเดียว) และ CSV สะอาดที่วางทับของเดิม — ใช้ก่อน Module 13 ได้ถ้าด่านยังไม่เขียว

## รู้เพิ่ม

ห้าบทบาทพอสำหรับห้องนี้ ไม่ต้องมีบทบาทที่หก คนสรุปอยู่คนละเครื่องมือ เพื่อให้เห็นว่าส่งงานต่อด้วยไฟล์ได้จริง
