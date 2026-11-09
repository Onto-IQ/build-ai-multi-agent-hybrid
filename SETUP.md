# SETUP — การบ้านก่อนวันเรียน

ทำให้จบก่อน **12 พฤศจิกายน 2026** ในห้องมีเวลาเช็กประมาณ 15 นาทีเท่านั้น

ใช้ได้ทั้ง Windows และ Mac ห้องนี้ใช้ **PowerShell** บน Windows และ **Terminal** บน Mac ไม่ใช้ Python

## ผ่านเมื่อ

- `node` เวอร์ชัน 20 ขึ้นไป และ `git` พิมพ์เวอร์ชันได้
- `claude` ล็อกอินด้วยบัญชีที่ศูนย์ฝึกให้ และ `ANTHROPIC_API_KEY` ว่าง
- `opencode` เปิดได้ และ `OPENROUTER_API_KEY` ตั้งในเครื่องแล้ว โดยค่าคีย์ไม่ถูกเขียนลงไฟล์ใน git
- โคลนครบสอง repo และที่โฟลเดอร์แอป `npm run verify` ผ่าน หรืออย่างน้อยแอปเปิดได้และ `npm run gate` จบด้วย exit 2
- สคริปต์ด้านล่างขึ้น `verify-setup: passed`
- มีบัญชี Vercel แผน Hobby ก่อนวันที่ 2 (ยังไม่ต้อง deploy)

## 1. ติดตั้ง Node.js 20 ขึ้นไป และ Git

ตรวจ:

```powershell
node --version
git --version
```

บน Mac ใช้คำสั่งเดียวกันใน Terminal เลข Node ควรขึ้นต้น `v20` `v22` หรือ `v24`

ถ้ายังไม่มี ให้ติดตั้งจาก https://nodejs.org/ (รุ่น LTS) และ https://git-scm.com/ แล้วปิดเปิดเทอร์มินัลใหม่ ถ้าไม่แน่ใจให้ถามวิทยากรก่อนกดตัวติดตั้งแปลก ๆ

## 2. โคลนสอง repo

```powershell
mkdir C:\dev
cd C:\dev
git clone https://github.com/Onto-IQ/build-ai-multi-agent-hybrid.git
git clone https://github.com/Onto-IQ/multi-agent-workshop-hybrid.git
```

บน Mac:

```bash
mkdir -p ~/dev
cd ~/dev
git clone https://github.com/Onto-IQ/build-ai-multi-agent-hybrid.git
git clone https://github.com/Onto-IQ/multi-agent-workshop-hybrid.git
```

เปิดโฟลเดอร์บทเรียนใน VS Code หรือ Cursor เมื่อจะอ่านแล็บ เปิดโฟลเดอร์แอปเมื่อจะสั่ง `claude` หรือ `opencode`

ชื่อโฟลเดอร์ต้องเป็น `multi-agent-workshop-hybrid` ถ้าโคลนมาแล้วมีแค่ README แปลว่าชุดแอปยังไม่เข้า `main` ของ repo นั้น ให้ถามวิทยากรก่อนทำแล็บ อย่าไปโคลน repo ชื่อเดิมที่ไม่มี `-hybrid`

ถ้าเก็บแอปไว้คนละที่ ให้ก็อป `.env.example` เป็น `.env` ใน repo บทเรียน แล้วใส่บรรทัด `WORKSHOP_DIR=` ตาม path จริง ไฟล์ `.env` ถูก git ignore อยู่แล้ว

## 3. Claude Code — บัญชีของศูนย์ฝึก

ทุกคนมีบัญชี Claude จากศูนย์ฝึก ใช้บัญชีนั้น ไม่ใช้คีย์ส่วนตัว

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
claude
```

ในหน้าจอพิมพ์ `/status` ต้องเป็นบัญชีของคลาส แล้วออกด้วย `/exit`

เวอร์ชันควรเป็น **2.1.296 ขึ้นไป** ถ้าต่ำกว่านี้ให้รัน `claude update`

ตรวจว่าไม่มีคีย์ทับการล็อกอิน บรรทัดแรกต้องว่าง:

```powershell
echo $env:ANTHROPIC_API_KEY
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
```

บน Mac:

```bash
echo "$ANTHROPIC_API_KEY"
unset ANTHROPIC_API_KEY
```

ถ้าเคยตั้งคีย์นี้ไว้ถาวรในโปรไฟล์ของเครื่อง ให้ลบออกจากที่นั้นด้วย ไม่งั้นรอบถัดไปจะถูกคิดเงินแบบจ่ายตามใช้ และทับบัญชีของคลาส

ทดลองครั้งเดียวหลังล็อกอิน:

```powershell
cd C:\dev\multi-agent-workshop-hybrid
claude -p "Reply with exactly: CLAUDE-OK"
```

ต้องเห็นข้อความ `CLAUDE-OK`

## 4. OpenCode — ผ่าน OpenRouter

ศูนย์ฝึกแจกคีย์ OpenRouter ในห้องหรือในจดหมาย ใส่เป็นตัวแปรของเครื่อง ห้ามวางลงใน repo ห้ามส่งในแชทกลุ่ม ห้ามใส่บน Vercel

Windows (ตั้งถาวรให้ผู้ใช้คนนี้ แล้วเปิดเทอร์มินัลใหม่):

```powershell
[System.Environment]::SetEnvironmentVariable('OPENROUTER_API_KEY','วางคีย์ที่ศูนย์ให้','User')
[System.Environment]::SetEnvironmentVariable('OPENCODE_MODEL','openrouter/anthropic/claude-sonnet-4.5','User')
```

Mac (ใส่ใน `~/.zshrc` แล้วเปิดเทอร์มินัลใหม่):

```bash
export OPENROUTER_API_KEY="วางคีย์ที่ศูนย์ให้"
export OPENCODE_MODEL="openrouter/anthropic/claude-sonnet-4.5"
```

OpenCode v2 ไม่อ่านตัวแปร `OPENCODE_MODEL` โดยตรง แต่ไฟล์ `opencode.json` ที่มากับแอปดึงค่านี้ผ่าน `{env:OPENCODE_MODEL}` ถ้าชื่อโมเดลบนกระดานต่างจากบรรทัดด้านบน ให้ใช้ชื่อบนกระดาน

ตรวจว่าตั้งแล้ว โดยไม่พิมพ์ค่าคีย์ออกมา:

```powershell
if ($env:OPENROUTER_API_KEY) { "OPENROUTER_API_KEY is set ($($env:OPENROUTER_API_KEY.Length) characters)" } else { "MISSING" }
```

```bash
if [ -n "$OPENROUTER_API_KEY" ]; then echo "OPENROUTER_API_KEY is set (${#OPENROUTER_API_KEY} characters)"; else echo MISSING; fi
```

ติดตั้ง OpenCode อย่างใดอย่างหนึ่ง แล้วเปิดเทอร์มินัลใหม่:

```powershell
npm install -g @opencode/cli
opencode --version
```

หรือตัวติดตั้งจาก https://opencode.ai ถ้ารุ่นบนกระดานของศูนย์ไม่ตรงกับคำสั่งนี้ ให้ใช้คำสั่งที่ศูนย์เขียน

สร้างไฟล์ตั้งค่าส่วนตัว (ไม่ใช่ไฟล์ในโปรเจกต์) ให้ชี้ไปที่ตัวแปร ไม่ใส่ตัวคีย์ลงไฟล์

Windows: `%USERPROFILE%\.config\opencode\opencode.json`  
Mac: `~/.config/opencode/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/anthropic/claude-sonnet-4.5",
  "providers": {
    "openrouter": {
      "settings": {
        "apiKey": "{env:OPENROUTER_API_KEY}"
      }
    }
  }
}
```

ถ้าหน้าจอ OpenCode ขอให้วางคีย์ลงในโปรเจกต์ ให้ยกเลิก แล้วกลับมาใช้ตัวแปรนี้ ถ้าชื่อโมเดลบนกระดานต่างจากบรรทัดด้านบน ให้ใช้ชื่อบนกระดาน

เปิดครั้งหนึ่งจากโฟลเดอร์แอป:

```powershell
cd C:\dev\multi-agent-workshop-hybrid
opencode
```

วาง prompt จากคอร์ส (`Reply with exactly: OC-OK` หรือ `ตอบกลับมาเป๊ะ ๆ ว่า: OC-OK`) — ต้องได้คำตอบ `OC-OK` เป๊ะ ๆ แล้วออก

## 5. เปิดแอปและด่านเริ่มต้น

ที่โฟลเดอร์แอป ไม่ต้อง `npm install`

```powershell
cd C:\dev\multi-agent-workshop-hybrid
npm start
```

เปิด http://127.0.0.1:3000 ต้องเห็นหน้า Registry Insight กด Ctrl+C เพื่อปิด

```powershell
npm run gate
echo $LASTEXITCODE
```

บน Mac หลังคำสั่ง gate ให้ดูด้วย `echo $?` ต้องได้ **2** และมีบรรทัด `FAIL | data-quality` นี่คือจุดเริ่มที่ตั้งใจไว้ ไม่ใช่เครื่องพัง

## 6. DuckDB ก่อน Module 05 และบัญชี Vercel ก่อนวันที่ 2

DuckDB ใช้ตอนทำความสะอาดข้อมูลใน Module 05 ยังไม่มีในวันนี้ได้ แต่ควรลงก่อนวันเรียน

- ดาวน์โหลด CLI จาก https://duckdb.org/docs/installation/ แล้วให้คำสั่ง `duckdb --version` ใช้ได้
- บัญชี Vercel แผน **Hobby** (ฟรี) สมัครที่ https://vercel.com/signup แนะนำสมัครด้วย GitHub อย่ากดแผน Pro
- ยังไม่ต้อง deploy และไม่ต้องใส่คีย์อะไรบน Vercel

`uv` ใช้ใน Module 08 (ต่อ MCP DuckDB) ผู้เรียนต้องติดตั้งก่อนวันเรียน: Windows `winget install --id=astral-sh.uv -e` · Mac `curl -LsS https://astral.sh/uv/install.sh | sh` แล้ว `uv --version` ต้องใช้ได้

## 7. รันสคริปต์ตรวจความพร้อม

ที่ repo บทเรียน

Windows:

```powershell
cd C:\dev\build-ai-multi-agent-hybrid
powershell -ExecutionPolicy Bypass -File scripts/readiness-check.ps1
```

Mac:

```bash
cd ~/dev/build-ai-multi-agent-hybrid
bash scripts/readiness-check.sh
```

ผ่านเมื่อบรรทัดสุดท้ายเป็น `verify-setup: passed`

คำเตือน `WARN` เรื่อง DuckDB หรือ Vercel CLI ยังเข้าห้องวันที่ 1 ได้ แต่ DuckDB ต้องมีก่อน Module 05 และบัญชี Vercel ต้องมีก่อน Module 13

ถ่ายรูปหรือก็อปเฉพาะบรรทัด `OK` / `WARN` / `FAIL` ส่งวิทยากรได้ ห้ามก็อปค่าคีย์

## ปัญหาที่พบบ่อย

| อาการ | ทำอย่างไร |
|---|---|
| `node` หรือ `claude` ไม่เจอหลังติดตั้ง | ปิดแล้วเปิดเทอร์มินัลใหม่ |
| ล็อกอิน Claude แล้วโดนคิดเงินรายครั้ง | เอา `ANTHROPIC_API_KEY` ออก แล้วเปิด `claude` ใหม่ |
| OpenCode ถามคีย์ทั้งที่ตั้งตัวแปรแล้ว | เปิดเทอร์มินัลใหม่หลังตั้งค่า แล้วตรวจความยาวคีย์ตามข้อ 4 |
| ผู้ช่วยเล่าแผนแต่ไม่สร้างไฟล์ (ทั้ง Claude และ OpenCode) | สั่งซ้ำให้ "เขียนไฟล์จริงด้วยเครื่องมือเขียนไฟล์" แล้วเปิดไฟล์ตรวจด้วยตาก่อนขั้นถัดไป |
| เปิด OpenCode แล้วเจอ `Error: Database is not empty and has no session table` | มีของ OpenCode รุ่นเก่ากับใหม่ปนกัน ปิด OpenCode ทุกหน้าต่าง ลบไฟล์ `opencode.db*` ใน `%USERPROFILE%\.local\share\opencode\` (Mac: `~/.local/share/opencode/`) แล้วตรวจ `opencode --version` ว่าเป็นรุ่นเดียว |
| โมเดลตอบ `Insufficient balance` หรือ `Rate limit reached` | งบหรือโควตาของ provider หมดหรือแน่น ใช้ชื่อโมเดลบนกระดาน หรือรอแล้วลองใหม่ ห้ามสลับไปคีย์ส่วนตัว |
| OpenCode สร้างไฟล์ผู้ช่วยผิดที่หรือไม่มี frontmatter | เปิดไฟล์ด้วยตา ย้าย/แก้เองตามแล็บ แล้วเปิด `opencode` ใหม่ ผู้ช่วยถูกอ่านตอนเปิดรอบใหม่ |
| OpenCode ค้างหรือทำงานแปลกหลังปิด TUI | ตรวจ session ค้างด้วย `opencode session list` แล้วลบด้วย `opencode session delete <id>` แล้วเริ่มรอบใหม่ |
| `verify-setup` หาแอปไม่เจอ | โคลน workshop ตามข้อ 2 หรือตั้ง `WORKSHOP_DIR` |
| `FAIL` บรรทัด `claude -p did not return CLAUDE-OK` | ยังไม่ล็อกอิน รัน `claude` แล้วสั่ง `/login` ด้วยบัญชีคลาส ถ้าเครื่องตั้ง `ANTHROPIC_API_KEY` ไว้ ให้เอาออกก่อน |
| `FAIL` บรรทัด `opencode run did not return OC-OK` | คีย์ OpenRouter ยังไม่ถูกต้องหรือเทอร์มินัลเก่า ตั้งคีย์ตามข้อ 4 แล้วปิดเปิดเทอร์มินัลใหม่ |
| พอร์ต 3000 ถูกใช้อยู่ | ปิด `npm start` เก่า หรือรัน `$env:PORT = 3001; npm start` (Mac: `PORT=3001 npm start`) |
| gate ไม่ได้ exit 2 | ต้องรันในโฟลเดอร์แอป และปิดเซิร์ฟเวอร์ก่อน |
| Wi-Fi องค์กรบล็อกหน้าล็อกอิน | ลองเน็ตโทรศัพท์ก่อนวันเรียน แล้วบอกวิทยากร |
