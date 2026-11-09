# Module 09 — กันคำสั่งอันตราย และกันงบบาน

**ทำไปเพื่ออะไร:** ปล่อยให้ผู้ช่วยทำงานต่อได้ โดยยังมีรั้วกั้นคำสั่งลบของและเพดานค่าใช้จ่ายของห้อง

| เวลา | เครื่องมือ |
|---|---|
| **45 นาที** | Claude Code วางรั้ว, OpenCode ใช้เส้นสิทธิ์จาก Module 04, สคริปต์งบใช้ร่วมกัน |

ทำในโฟลเดอร์แอป ด่านควรเป็น 6/6 อยู่แล้วจาก Module 06

## ก่อนเริ่ม

`npm run gate` ขึ้น 6/6 อ่านเพดานห้องที่ [scripts/gate-cost.md](../../scripts/gate-cost.md) ใน repo บทเรียน: ไม่เกิน 2 ดอลลาร์ และไม่เกิน 20,000 output tokens ต่อรอบที่บันทึก

## แบบฝึกหัด

### 1. ให้ Claude วางรั้วที่ไม่บล็อกงานปกติ

เปิด `claude` ที่โฟลเดอร์แอป วาง:

```text
สร้าง .claude/hooks/block-dangerous-bash.js ที่อ่าน JSON จาก stdin แล้ว exit 2 เมื่อคำสั่งอันตราย
ให้บล็อก rm -rf, taskkill, Remove-Item แบบ Recurse และคำสั่งที่ pipe เข้า sh
ให้ผ่าน node server.js และ node scripts/quality-gate.js
สร้าง .claude/hooks/task-completed-gate.js ที่ exit 2 ถ้า qualityGatePassed ไม่ใช่ true
ผสาน .claude/settings.json ให้เรียกสอง hook นี้ และยังคง deny การแก้ scripts/quality-gate.js กับ git push จากแบบฝึกหัดเส้นสิทธิ์ใน Module 04
ห้ามแก้ scripts/quality-gate.js
จากนั้นรัน npm run gate อีกครั้ง ต้องยังเป็น 6/6
เขียนไฟล์ hook และแก้ settings.json จริง อย่าตอบเป็นข้อความอย่างเดียว
```

ถ้าได้แต่คำอธิบาย ให้สั่งว่า "สร้างไฟล์ hook และแก้ settings.json จริง" แล้วตรวจว่ามีไฟล์จริงใน `.claude/hooks/` ก่อนทดลอง

**ทดสอบ hook ด้วยมือก่อนผ่านแชท** — เขียน payload เป็นไฟล์แบบไม่มี BOM แล้วป้อนเข้า stdin (`echo '...' | node hook.js` ใน PowerShell 5.1 ส่ง payload พังโดย hook จะ exit 0 เงียบ ๆ = ไม่ได้ทดสอบอะไรเลย; `Set-Content -Encoding UTF8` ใส่ BOM ทำ `JSON.parse` พัง):

```powershell
[IO.File]::WriteAllText("$pwd\payload-block.json", '{"tool_name":"Bash","tool_input":{"command":"rm -rf data"}}', (New-Object System.Text.UTF8Encoding($false)))
$proc = Start-Process node -ArgumentList ".claude/hooks/block-dangerous-bash.js" -RedirectStandardInput "payload-block.json" -NoNewWindow -Wait -PassThru
$proc.ExitCode
```

ผลที่คาดหวัง: ข้อความบล็อกบน stderr และ exit `2` จากนั้นทดสอบในแชท — สร้างโฟลเดอร์ทิ้งไว้ก่อน (`New-Item -ItemType Directory -Force hook-test-dummy`) แล้วสั่ง "Run this exact bash command: rm -rf hook-test-dummy" กดอนุญาตในกล่องถ้ามี — ตัวที่บล็อกต่อจากนั้นต้องเป็น hook แล้วยืนยันด้วยมือว่า `Test-Path hook-test-dummy` เป็น `True`

> ⚠️ **อย่าทดสอบด้วย `rm -rf data` ตรง ๆ** — ถ้า hook ยังไม่ถูกผูกจริง ข้อมูลชุดสะอาดหายทั้งชุด ใช้โฟลเดอร์ทิ้งเสมอ

### 2. ลองเพดานงบด้วยไฟล์ตัวอย่าง

ใน repo บทเรียนมีไฟล์ตัวอย่างใต้ `solutions/w7/fixtures/` ให้ก็อปสามไฟล์ไปที่โฟลเดอร์แอป หรือสั่งผู้ช่วยก็อปเฉพาะไฟล์เหล่านี้ แล้วรันสคริปต์ที่ผู้ช่วยสร้างชื่อ `scripts/cost-gate.js`

วางให้ Claude หรือ OpenCode:

```text
สร้าง scripts/cost-gate.js ที่อ่านไฟล์ JSON ที่ส่งเป็นอาร์กิวเมนต์
exit 2 ถ้า total_cost_usd เกิน 2 หรือ output_tokens เกิน 20000
exit 0 ถ้าอยู่ในเพดาน พิมพ์ PASS หรือ FAIL ให้ชัด
ห้ามเรียกเน็ต ห้ามแก้ quality gate
```

ทดลองกับไฟล์ที่ต่ำกว่างบ ต้อง exit 0 ไฟล์ที่เกินงบหรือเกินโทเคนต้อง exit 2 — ถ้าจะสร้าง `usage.json` ทดสอบเอง เขียนแบบไม่มี BOM ด้วย `UTF8Encoding($false)` เท่ากัน

### 3. ฝั่ง OpenCode

เปิด `opencode` แล้วขอให้ยืนยันว่า `opencode.json` ยังห้าม `git push` และห้ามแก้ด่าน ถ้าเส้นสิทธิ์ใน Module 04 หลุด ให้ใส่กลับ ไม่ต้องสร้าง hook ซ้ำทั้งชุด

## ผ่านเมื่อ

- คำสั่งลบข้อมูลถูกบล็อก และโฟลเดอร์ `data/raw` ยังอยู่
- สคริปต์งบแดงเมื่อเกิน 2 ดอลลาร์ และเขียวเมื่อไม่เกิน
- `npm run gate` ยังเป็น 6/6
- แก้แล้วตรวจซ้ำไม่เกิน 2 รอบ ถ้ายังพังให้เรียกวิทยากร

จากเครื่องทดสอบจริง (7 พฤศจิกายน 2026): ได้ทั้งสอง hook และ `scripts/cost-gate.js` ต่อคำสั่ง ทดลอง `rm -rf data` → hook บล็อก `data/raw/dbd-2558.parquet` ยังอยู่ครบ cost-gate สามไฟล์: `under-budget.json` exit 0, `over-budget.json` exit 2 (3.5 > 2), `over-tokens.json` exit 2 (25,000 > 20,000) ฝั่ง opencode ยืนยัน deny 3 กฎ (`scripts/quality-gate.js`, `git push`, `git push *`) ยังอยู่ครบ ปิดท้าย gate **6/6 exit 0**

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| ทดสอบ hook แล้ว exit 0 เงียบ ๆ | payload ไปไม่ถึง (pipe พัง/BOM) | เขียนไฟล์ payload ด้วย `UTF8Encoding($false)` แล้วป้อนด้วย `Start-Process -RedirectStandardInput` ตามขั้น 1 |
| hook ทำงานตอนทดสอบมือ แต่ไม่บล็อกในแชท | `settings.json` ยังไม่ผูก PreToolUse หรือยังไม่ปิดเปิดใหม่ | ตรวจ settings แล้วปิดเปิด `claude` ใหม่ |
| cost-gate exit ทั้งที่งบต่ำ | ไฟล์ usage มี BOM นำหน้า | สร้างใหม่แบบไม่มี BOM |
| ผู้ช่วยแก้ `scripts/quality-gate.js` | พรอมต์ไม่มีประโยคห้าม | `git checkout -- scripts/quality-gate.js` แล้วสั่งใหม่ |

## ถ้าตามไม่ทัน

```bash
รันจาก repo บทเรียน (build-ai-multi-agent-hybrid) ไม่ใช่จากโฟลเดอร์แอป:
node scripts/catch-up.js w7
```

ได้รั้ว งบ และ CSV สะอาด ไฟล์ข้อมูลที่สะอาดจะทับของเดิม

## รู้เพิ่ม

รั้วกันอุบัติเหตุ ไม่กันคนที่ตั้งใจปิดรั้วเอง งบของห้องคือเพดานฝึก ไม่ใช่ใบเสร็จจาก Anthropic
