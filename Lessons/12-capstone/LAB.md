# Module 12 — ปิดงานเป็นทีม แล้วสรุปให้คนที่ไม่เขียนโค้ด

**ทำไปเพื่ออะไร:** ได้รายงานสั้นจากข้อมูลจริง ที่เอาไปเล่าต่อได้โดยไม่ต้องเปิดโปรแกรม

| เวลา | เครื่องมือ |
|---|---|
| **60 นาที** | OpenCode: planner, synthesizer · Claude Code: คุมทีมและรันทั้งกระบวน |

ทำในโฟลเดอร์แอป ด่านต้องเป็น 6/6 ก่อนเริ่มสรุป

## ก่อนเริ่ม

รัน `npm run gate` ต้อง exit 0 ก่อนตั้งทีมเสมอ — ทีมที่วิ่งบนของแดง จะสร้างของเสียสองชั้น (งานที่ทำไปกับข้อมูลเสีย และงานที่ต้องทำใหม่)

ยอดที่อนุญาตให้ใช้มีชุดเดียว: **16,772** กิจการ และทุนรวม **45,341,868,784** บาท จังหวัดทุนสูงสุดคือกรุงเทพมหานคร ภาคทุนสูงสุดคือภาคกลาง ถ้าทำฟีเจอร์ของตัวเองใน Module 11 ไว้ ระบุด้วยว่ามันต้องรอดถึงรอบ release นี้

ห้ามให้ Claude เขียนสรุปผู้บริหาร คนสรุปคือ OpenCode

## แบบฝึกหัด

### 1. ให้ planner บน OpenCode วางสัญญาของทีม

สัญญาสองไฟล์นี้คือสิ่งที่ทีมทั้งกระบวนอ้างถึง ผู้เขียนต้องเป็น `planner` ฝั่ง OpenCode (ตัวเดียวกับ Module 04–05) ไม่ใช่ Claude

แต่ planner ที่สร้างตอน Module 04 ถูกปิดสิทธิ์ไว้ให้เขียนได้แค่ `docs/TASKS.md` ไฟล์เดียว — ต้องขยายสิทธิ์ให้เขียน `docs/PRODUCT-SPEC.md` ด้วยก่อน ไม่งั้นมันจะปฏิเสธงานตามนิยามของตัวเอง เปิด `opencode` แล้ววาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Update .opencode/agents/planner.md: the body must now say you may write only docs/TASKS.md and docs/PRODUCT-SPEC.md — still no code, no commands.
Keep everything else (frontmatter, bash deny) unchanged.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
แก้ .opencode/agents/planner.md: เนื้อหาไฟล์ต้องบอกว่าเขียนได้แค่ docs/TASKS.md และ docs/PRODUCT-SPEC.md — ยังห้ามเขียนโค้ด ห้ามรันคำสั่ง
เก็บส่วนอื่นไว้ครบ (frontmatter, bash deny ไม่เปลี่ยน)
```

เปิดไฟล์ด้วยตายืนยันว่าเห็นชื่อไฟล์ทั้งสอง แล้วสั่ง `@planner` (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@planner Update docs/PRODUCT-SPEC.md and docs/TASKS.md to match the app as it is now.
If there is a Module 11 feature, record that it must survive the release.
TASKS must be an ordered list the Claude team can follow without chatting with you.
Do not edit code in this round.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
@planner อัปเดต docs/PRODUCT-SPEC.md กับ docs/TASKS.md ให้ตรงกับแอปตอนนี้
ถ้ามี feature จาก Module 11 ให้บันทึกว่าต้องรอดถึง release
TASKS ต้องเป็นลิสต์ที่เรียงลำดับแล้ว ทีม Claude ทำตามได้โดยไม่ต้องคุยกลับมา
ห้ามแก้โค้ดในรอบนี้
```

เปิดทั้งสองไฟล์ด้วยตาก่อนไปขั้นถัดไป — ทีมจะทำตามสัญญานี้เป๊ะ ๆ ถ้าขาดอะไรให้สั่ง planner แก้ก่อน

### 2. สร้างคนสรุปฝั่ง OpenCode

เปิด `opencode` แล้ววาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create .opencode/agents/synthesizer.md at exactly this path — not agents/ at the project root.
The frontmatter must have description, mode: subagent, and permission: bash: deny.
File body: you may write only docs/EXECUTIVE-SUMMARY.md — no code, no commands. Use only figures from the handoff files (docs/PRODUCT-SPEC.md · docs/QA-REPORT.md · docs/ANALYSIS.md and docs/region-capital.csv if present). Never guess a number.
The summary must be Thai, at most 400 words, for people who do not write code.
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
สรุปต้องเป็นภาษาไทย ไม่เกิน 400 คำ สำหรับคนที่ไม่เขียนโปรแกรม
ต้องมียอด 16,772 และ 45,341,868,784
ต้องมีชื่อกรุงเทพมหานครและคำว่ากลาง
ต้องมีหัวข้อ ## ภาพรวมทุนจดทะเบียน และ ## ข้อเสนอแนะ
ห้ามแต่งตัวเลขชุดใหม่ ห้ามแก้ server.js
```

เปิด `.opencode/agents/synthesizer.md` ด้วยตา ต้องเห็น frontmatter ครบ ถ้าโมเดลสร้างผิดที่ ให้ย้ายไฟล์เองก่อนเรียกใช้ — ขั้นถัดไปจะเรียกตัวนี้แบบ headless

### 3. พรอมต์เดียวบน Claude รันทั้งกระบวน แล้วส่งงานให้ synthesizer แบบ headless

เปิด `claude` แล้ววาง (เลือกอย่างใดอย่างหนึ่ง):

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Run the whole closing pipeline using the roles in .claude/agents — if any file is missing, create it with the Write tool for real; do not reply with text only: data-researcher, developer, qa.
The contract is docs/TASKS.md written by the OpenCode planner — follow it, do not rewrite it.
Follow this order only: a task that consumes another agent's output must not run before that agent finishes.
data-researcher is read-only and delivers its figures as a short shared file for the team.
developer may edit only when the /api/summary figures do not match 16,772 and 45341868784.
qa runs npm run gate and must never claim a pass unless it is exit 0.
When qa reports exit 0, dispatch the summarizer on OpenCode headless with exactly:
opencode run "@synthesizer Read docs/PRODUCT-SPEC.md, docs/QA-REPORT.md, docs/ANALYSIS.md and docs/region-capital.csv if present, then write docs/EXECUTIVE-SUMMARY.md per your instructions."
Do not write docs/EXECUTIVE-SUMMARY.md yourself. Do not edit scripts/quality-gate.js. Never print any sk- value.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
รันกระบวนปิดงานทั้งหมดด้วยบทบาทใน .claude/agents ถ้าไฟล์ไหนยังไม่มีให้สร้างด้วยเครื่องมือ Write จริง อย่าตอบเป็นข้อความอย่างเดียว: data-researcher, developer, qa
สัญญาคือ docs/TASKS.md ที่ planner ฝั่ง OpenCode เขียนไว้ — ทำตาม ห้ามเขียนใหม่เอง
ทำตามลำดับนี้เท่านั้น งานที่ต้องใช้ผลของอีกตัวห้ามรันก่อนตัวนั้นเสร็จ
data-researcher อ่านอย่างเดียว ส่งยอดเป็นไฟล์สั้นให้ทีมใช้ร่วมกัน
developer แก้ได้เฉพาะเมื่อยอด /api/summary ไม่ตรง 16,772 และ 45341868784
qa รัน npm run gate และห้ามบอกผ่านถ้าไม่ใช่ exit 0
พอ qa รายงาน exit 0 ให้ส่งงานให้คนสรุปบน OpenCode แบบ headless ด้วยคำสั่งนี้เป๊ะ ๆ:
opencode run "@synthesizer อ่าน docs/PRODUCT-SPEC.md, docs/QA-REPORT.md, docs/ANALYSIS.md และ docs/region-capital.csv ถ้ามี แล้วเขียน docs/EXECUTIVE-SUMMARY.md ตามข้อกำหนดของเธอ"
ห้ามเขียน docs/EXECUTIVE-SUMMARY.md เอง ห้ามแก้ scripts/quality-gate.js ห้ามพิมพ์ค่า sk-
```

หนึ่งพรอมต์จบทั้งกระบวน: ทีม Claude ทำตามสัญญาจนด่านเขียว แล้ว Claude เป็นคนยิง `opencode run` ส่งงานข้ามเครื่องมือให้ synthesizer — ฝั่ง OpenCode ไม่ต้องเปิดหน้าจอรอ

### 4. ตรวจด่านอีกรอบ และเทียบเลขสรุปกับ API

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
