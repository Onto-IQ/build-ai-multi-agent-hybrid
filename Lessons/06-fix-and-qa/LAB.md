# Module 06 — มีคนตรวจก่อนเชื่อว่าเสร็จ

**ทำไปเพื่ออะไร:** ไม่ส่งของเพราะผู้ช่วยบอกว่าเสร็จแล้ว มีคนไล่บั๊กให้เห็น แล้วค่อยแก้จนด่านครบ

| เวลา | เครื่องมือ |
|---|---|
| **50 นาที** | Claude Code |

ทำในโฟลเดอร์แอป ต้องมีผล Module 05 แล้ว (ข้อมูลสะอาดและยอดสรุปเขียว) และมี `.claude/agents/developer.md` จาก Module 05 พร้อมใช้

## ก่อนเริ่ม

`npm run gate` ผ่านอย่างน้อย `data-quality` กับ `summary-matches-valid-rows` ข้อที่ยังควรแดงมีสี่ชื่อ: `bad-json-does-not-crash`, `health-no-secrets`, `notes-validation`, `notes-persists`

## แบบฝึกหัด

### 0. ดูของแดงก่อนแก้

```powershell
npm run gate
```

จดบรรทัด FAIL ทั้งสี่: `bad-json-does-not-crash`, `health-no-secrets`, `notes-validation`, `notes-persists` — นี่คือสัญญาว่าต้องแก้อะไร ห้ามแก้โค้ดก่อนมีรายงาน

### 1. ให้คนตรวจเขียนรายงาน ไม่ให้แก้ของ

เปิด `claude` วาง:

```text
สร้าง .claude/agents/qa.md
frontmatter: name เป็น qa, description ว่า Use when implementation claims to be done. Reproduces the bug, writes the QA report, and re-verifies after the fix, tools เป็น Read, Grep, Glob, Bash, model เป็น sonnet
เนื้อหา: คุณคือ QA ต้องรีโปรดิวส์บั๊กด้วย HTTP request จริงก่อนเขียนอะไร ทุก finding ใน docs/QA-REPORT.md ต้องอ้าง server.js:บรรทัด พร้อมวิธีรีโปรดิวส์ หลังมีการแก้ ให้รันรีโปรดิวส์เดิมซ้ำแล้ว append ผล ห้ามแก้ server.js และ data/dataset.csv
จากนั้นให้ qa ยิงแอปตามสคริปต์ด่าน แล้วเขียน docs/QA-REPORT.md เป็นภาษาไทย
ต้องชี้สามจุด: POST ที่ไม่ใช่ JSON ทำให้โปรเซสล่ม, /api/health ปล่อยค่าตัวอย่างที่ขึ้นต้น sk- (ห้ามพิมพ์ค่า), โน้ตไม่ถูกเซฟลงไฟล์จึงหายเมื่อเปิดใหม่
อ้างไฟล์และบรรทัด ห้ามแก้ server.js ในรอบนี้ ห้ามแก้ scripts/quality-gate.js
```

เปิดรายงานด้วยตา ถ้าไม่มีสามจุด อย่าให้ใครแก้โค้ด ถ้าได้แต่คำอธิบายไม่มีไฟล์ ให้สั่งว่า "เขียน `docs/QA-REPORT.md` จริงด้วยเครื่องมือ Write"

### 2. ให้ developer แก้ตามรายงานเท่านั้น (เอเจนต์จาก Module 05)

ปิด Claude แล้วเปิดใหม่ วาง:

```text
ใช้ agent developer อ่าน docs/QA-REPORT.md แล้วแก้ server.js เฉพาะจุดในรายงาน
POST /api/notes ด้วยของที่ไม่ใช่ JSON หรือไม่ใช่ object ต้องตอบ 400 { error: 'INVALID_JSON' } และโปรเซสไม่ตาย
ถ้า text ขาดหรือว่างต้องตอบ 400 { error: 'INVALID_TEXT' }
โน้ตที่ถูกต้องตอบ 201 และเขียนลง data/notes.json และมี GET /api/notes คืนโน้ตที่เก็บไว้ จึงอยู่รอดหลังรีสตาร์ท
/api/health ตอบแค่ { ok: true } ไม่มี sk- และไม่มี sampleToken
อย่าเปลี่ยนอย่างอื่น อย่าแตะ scripts/quality-gate.js อย่าทำยอดสรุปให้เพี้ยนจาก Module 05
เสร็จแล้วรัน npm run gate แล้วรายงาน exit code จริง
```

### 3. ดูผลด่านเอง

```powershell
npm run gate
echo $LASTEXITCODE
```

บน Mac ใช้ `echo $?` ต้องได้ 0 และบรรทัด `quality gate: 6/6 passed`

### 4. ปิดวงจร: ให้ qa ตรวจซ้ำกับของที่แก้แล้ว

ปิด Claude แล้วเปิดใหม่ วาง:

```text
ใช้ agent qa รันวิธีรีโปรดิวส์ใน docs/QA-REPORT.md ซ้ำกับ server.js ตัวที่แก้แล้ว แล้ว append ผลเข้าไฟล์เดิมในหัวข้อ Evidence after fix อ้างผลคำสั่งจริง ห้ามแก้ server.js ห้ามแก้ scripts/quality-gate.js
```

📦 **Handoff ปิดวงจร:** รายงานเดียวมีทั้ง finding ก่อนแก้และหลักฐานหลังแก้ — ไฟล์นี้คือที่มาของหลักฐานก่อน deploy ใน Module 13

## รอบ B — encode สัญญาเดิมเป็น conductor prompt (ต่อยอดบังคับใจ)

ทำหลังผ่านรอบ A แล้ว หรือใช้จับภาพห้องถัดไปหลัง catch-up — วางก้อนเดียวแล้วหยุดตามที่มันบอก:

```text
รันวงจรแก้ด้วย QA โดยใช้ specialty agent อย่างเดียว (ห้ามเปิด Agent Teams)
1) เรียก @qa — รีโปรดิวส์สี่เคสแดง (bad-json-does-not-crash, health-no-secrets, notes-validation, notes-persists) เขียน docs/QA-REPORT.md สาม findings อ้าง server.js:บรรทัด และวิธีรีโปรดิวส์ ห้ามแก้ server.js หรือ quality-gate.js
2) เรียก @developer — อ่านรายงานนั้นแล้วแก้เฉพาะ findings ห้ามแตะ scripts/quality-gate.js
3) หยุด แล้วบอกให้ฉันรัน: npm run gate
ห้ามประกาศว่า gate ผ่านจนกว่าฉันจะวางผล gate เอง หลังฉันยืนยัน 6/6 ให้เรียก @qa append หัวข้อ Evidence after fix ในไฟล์เดิม
```

จุดสอน: orchestrator ไม่หาย — ย้ายจากนิ้วคุณไปเป็น conductor prompt ที่วิ่ง**สัญญาเดิม** และยังมีจุดหยุดให้คนปิดด้วย gate เสมอ

จากเครื่องทดสอบจริง (claude 2.1.319, 7 พฤศจิกายน 2026):

- รอบ qa: ได้ทั้ง `.claude/agents/qa.md` และ `docs/QA-REPORT.md` ในคำสั่งเดียว รายงานยิงด่านจริงเอง (ระบุ exit 2, PASS 2/6) แล้วตารางรายเคสอ้าง `server.js:บรรทัด` ครบสามจุด ไม่แตะโค้ดในรอบนี้จริง
- รอบแก้: server.js เปลี่ยน +45/−10 บรรทัด จบด้วย `npm run gate` **6/6 exit 0** ทุกเคส (`notes-persists` ยังเข้ม: survives-restart=yes จากไฟล์ `data/notes.json`)
- หลังมันทดสอบเอง มักมี **ไฟล์ขยะชื่อ `nul`** ตกค้างที่รากโปรเจกต์ (จากคำสั่ง `... > nul` สไตล์ cmd ที่รันใน Git Bash) `git add -A` จะพังด้วย "short read while indexing nul" ให้ลบทิ้งก่อน commit
- ปิด claude ทุกครั้งก่อนสลับไป opencode — รอบทดสอบพลาดพิมพ์คำสั่งตอน opencode ยังเปิด ทำให้พรอมต์ของ Claude หลุดเข้า session opencode เปล่า ๆ

## ผ่านเมื่อ

- รันด่านเห็น FAIL สี่ชื่อก่อนแก้ (จดไว้)
- มี `.claude/agents/qa.md` ที่ tools มี Bash และมี `docs/QA-REPORT.md` ที่ชี้สามจุดก่อนแก้ พร้อม `server.js:บรรทัด` และวิธีรีโปรดิวส์
- POST ที่ไม่ใช่ JSON ได้ 400 `INVALID_JSON` และโปรเซสไม่ตาย / text ว่างได้ 400 `INVALID_TEXT` / health ตอบ `{ ok: true }` ไม่มี `sk-`
- ด่านขึ้น 6/6 exit 0 โดยที่ `scripts/quality-gate.js` ไม่ถูกแก้
- ลองโพสต์โน้ตแล้วรีสตาร์ทเซิร์ฟเวอร์ โน้ตยังอยู่ (ไฟล์ `data/notes.json`)
- `docs/QA-REPORT.md` มีหัวข้อ Evidence after fix แล้ว

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| qa เล่าแต่ไม่รีโปรดิวส์จริง | ไม่ได้สั่งให้ยิง request ก่อน | เติม "ทดสอบด้วย request จริงก่อนเขียนรายงาน" |
| developer แก้เกินขอบเขต | ไม่ได้กำหนดขอบเขต | สั่งซ้ำ "แก้เฉพาะจุดในรายงาน ไม่มีอย่างอื่น" |
| gate ยัง 2/6 ทั้งที่แก้แล้ว | เซิร์ฟเวอร์ตัวเก่าค้าง | ปิด `npm start` แล้วรัน gate ใหม่ |
| `notes-persists` ยังแดง | เก็บโน้ตในตัวแปร ไม่ลงไฟล์ | ชี้ finding ที่สามแล้วสั่งแก้ต่อ |
| ไฟล์ขยะชื่อ `nul` ติดมาที่รากโปรเจกต์ | คำสั่ง `... > nul` สไตล์ cmd ที่รันใน Git Bash | ลบทิ้งก่อน commit — `git add -A` จะพังด้วย short read ถ้าปล่อยไว้ |
| `Agent type not found` | ยังไม่ปิดเปิดใหม่หลังสร้าง qa.md | ปิดแล้วเปิด `claude` ใหม่ |
| รอบ B ประกาศผ่านก่อนมีผล gate | พรอมต์ไม่บังคับจุดหยุด | ย้ำ "หยุด แล้วบอกให้ฉันรัน npm run gate" แล้ววางผลเอง |
| รอบ B เปิด Agent Teams เอง | สับสนกับ Module 03/05 | สั่งซ้ำ "specialty agent อย่างเดียว ห้ามเปิด Agent Teams" |
| พรอมต์หลุดเข้า session ผิด | เปิด claude กับ opencode พร้อมกันสลับกันพิมพ์ | ปิดเครื่องมือที่ไม่ใช้ก่อนพิมพ์อีกตัว |

## ต่อยอด

สั่ง qa เพิ่ม finding ที่สี่จากรายงานสำรวจใน Module 03 (เช่นพฤติกรรม 404 หรือ method แปลก) ลงใน QA-REPORT เดิม — เก็บไว้ให้ Module 07 ใช้ต่อ

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w4
```

ได้เซิร์ฟเวอร์ที่ปิดสี่จุดนี้ ถ้ายอดข้อมูลยังแดง เพราะยังไม่ได้ไฟล์สะอาด ให้ใช้ `node scripts/catch-up.js w7` ซึ่งใส่ทั้งของที่แก้แล้วและ CSV สะอาด พร้อมเครื่องกันของ Module 09

## รู้เพิ่ม

คนตรวจกับคนแก้ไม่ควรเป็นคำสั่งเดียวกันในรอบแรก รายงานคือของที่ส่งต่อ ถ้าไม่มีรายงาน จะไม่มีทางรู้ว่าแก้ครบหรือแก้เกิน
