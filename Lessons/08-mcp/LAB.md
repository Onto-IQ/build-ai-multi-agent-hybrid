# Module 08 — ต่อ MCP DuckDB อ่านอย่างเดียว แล้ววิเคราะห์ข้อมูลจริง

**ทำไปเพื่ออะไร:** สร้าง `.mcp.json` ระดับโปรเจกต์ด้วยตัวเอง ผูกเข้า `data-researcher` แล้วให้ผู้ช่วยวิเคราะห์ SQL จนได้ตารางยอดต่อภาค เป็นชุดตัวเลขอ้างอิงของคนสรุปใน Module 12

| เวลา | เครื่องมือ |
|---|---|
| **20–30 นาที** (ครั้งแรก `uvx` จะดาวน์โหลดแพ็กเกจ) | Claude Code + มือคุณรัน `duckdb` |

ทำในโฟลเดอร์แอป ต้องมี `data-researcher` จาก Module 04 ข้อมูลสะอาดจาก Module 05 และ `uv` ที่ติดตั้งตาม [SETUP.md](../../SETUP.md) แล้ว

## ก่อนเริ่ม

- ติดตั้ง `uv` แล้ว (`winget install --id=astral-sh.uv -e` บน Windows / `curl -LsSf https://astral.sh/uv/install.sh | sh` บน Mac) แล้วคำสั่ง `uv --version` ใช้ได้
- `npm run gate` ผ่านอย่างน้อย `data-quality` กับ `summary-matches-valid-rows`
- **ยังไม่มี** `.mcp.json` ถ้ามีค้างจากรอบก่อน ให้ลบก่อนเริ่มแล็บนี้

## 1) สร้าง `.mcp.json` ที่รากแอป (คัดลอกทั้งก้อน — pin `--python 3.12` ห้ามตัด)

Python ใหม่กว่านี้ทำ build ของ `cryptography` ล้ม จึง pin เป๊ะ ๆ และห้ามมี `--read-write` (อ่านอย่างเดียวตามดีไซน์)

**PowerShell:**

```powershell
@'
{
  "mcpServers": {
    "data-duckdb": {
      "command": "uvx",
      "args": [
        "--python",
        "3.12",
        "mcp-server-motherduck",
        "--db-path",
        "data/warehouse.duckdb"
      ]
    }
  }
}
'@ | Set-Content -Path .mcp.json -Encoding utf8
```

**Git Bash / macOS / Linux:**

```bash
cat > .mcp.json <<'EOF'
{
  "mcpServers": {
    "data-duckdb": {
      "command": "uvx",
      "args": [
        "--python",
        "3.12",
        "mcp-server-motherduck",
        "--db-path",
        "data/warehouse.duckdb"
      ]
    }
  }
}
EOF
```

ตรวจด้วยตา: `Get-Content .mcp.json` (Windows) หรือ `cat .mcp.json` (Mac) — ต้องมีเซิร์ฟเวอร์ชื่อ `data-duckdb` · คำสั่ง `uvx` · `--python 3.12` · `--db-path data/warehouse.duckdb` · **ไม่มี** `--read-write`

> 📚 **รู้เพิ่ม:** นี่คือ MCP แบบ **project scope** — ไฟล์อยู่ใน repo ทั้งทีมได้คอนฟิกเดียวกัน ไม่ต้อง `claude mcp add` คนละเครื่อง ครั้งแรกที่เปิด TUI Claude จะถามอนุมัติเซิร์ฟเวอร์จากไฟล์นี้

## 2) เปิด TUI แล้วอนุมัติ MCP

```bash
claude
```

เมื่อขึ้นกล่อง **New MCP server found: data-duckdb** ให้เลือกอนุญาตใช้ในโปรเจกต์นี้ อย่าเลือก Continue without

ตรวจรายการ (เทอร์มินัลลูกนอก TUI ก็ได้):

```bash
claude mcp list
```

ผลที่คาดหวัง: รายการมี `data-duckdb`

## 3) ผูก MCP เข้า data-researcher แล้วรีสตาร์ทเซสชัน

ใน TUI (เลือกอย่างหนึ่ง) แล้วกดอนุญาตแก้ไฟล์เอเจนต์:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Add mcpServers: data-duckdb to the frontmatter of .claude/agents/data-researcher.md. Keep the tools line exactly as it is.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
เพิ่ม mcpServers: data-duckdb ใน frontmatter ของ .claude/agents/data-researcher.md คงบรรทัด tools เดิมไว้
```

**ปิด TUI แล้วเปิด `claude` ใหม่** — MCP และ frontmatter โหลดตอนเซสชันเริ่มเท่านั้น

frontmatter ที่ถูกต้องต้องมีบรรทัด:

```yaml
mcpServers: data-duckdb
```

## 4) เรียก SQL จริงผ่าน MCP

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Use the data-duckdb MCP execute_query tool to run: SELECT month, count(*) AS companies, sum(TRY_CAST(replace(replace(capital, ',', ''), ' ', '') AS BIGINT)) AS capital_thb FROM read_csv('data/dataset.csv', header = true, columns = {'month': 'VARCHAR', 'seq': 'VARCHAR', 'reg_no': 'VARCHAR', 'company_name': 'VARCHAR', 'reg_date': 'VARCHAR', 'capital': 'VARCHAR', 'objective': 'VARCHAR', 'address': 'VARCHAR', 'province': 'VARCHAR'}) GROUP BY month ORDER BY month. Report the table. Do not edit files.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
ใช้ tool execute_query ของ MCP data-duckdb รัน: SELECT month, count(*) AS companies, sum(TRY_CAST(replace(replace(capital, ',', ''), ' ', '') AS BIGINT)) AS capital_thb FROM read_csv('data/dataset.csv', header = true, columns = {'month': 'VARCHAR', 'seq': 'VARCHAR', 'reg_no': 'VARCHAR', 'company_name': 'VARCHAR', 'reg_date': 'VARCHAR', 'capital': 'VARCHAR', 'objective': 'VARCHAR', 'address': 'VARCHAR', 'province': 'VARCHAR'}) GROUP BY month ORDER BY month แล้วรายงานตาราง ห้ามแก้ไฟล์
```

> 📚 **รู้เพิ่ม:** ใช้ `TRY_CAST` ไม่ใช่ `CAST` เพราะข้อมูลดิบมีแถวหัวตารางปนอยู่ — `CAST` ล้มทั้ง query ทันทีที่เจอค่าที่แปลงไม่ได้ ส่วน `TRY_CAST` ให้ NULL แล้วข้าม

ผลที่คาดหวัง: ตารางรายเดือนจากข้อมูลจริง — ม.ค. 18,620,752,814 · ก.พ. 14,815,712,210 · มิ.ย. 11,905,403,760 บาท

## 5) สร้าง `scripts/analysis.sql` — ยอดต่อภาค

สั่ง claude ใน TUI (เลือกอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
Create scripts/analysis.sql for DuckDB: join data/dataset.csv province against a province-to-region mapping table written as a VALUES list, group by region, and COPY the result (region, companies, capital_thb) to docs/region-capital.csv. Order by capital descending. Run nothing yet.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
สร้าง scripts/analysis.sql สำหรับ DuckDB: จับคู่คอลัมน์ province จาก data/dataset.csv กับตารางแผนที่จังหวัดเป็นภาคแบบ VALUES list แล้ว GROUP BY region และ COPY ผล (region, companies, capital_thb) ไปที่ docs/region-capital.csv เรียงทุนมากไปน้อย ยังไม่ต้องรัน
```

## 6) รันด้วยมือคุณเอง

```powershell
duckdb -c ".read scripts/analysis.sql"
echo $LASTEXITCODE
```

ผลที่คาดหวัง: `docs/region-capital.csv` มี 6 แถว ยอดรวม 16,772 กิจการ / 45,341,868,784 บาท โดย กลาง 10,068 กิจการ / **31,680,888,983** บาท

> 📚 **ปมจาก Module 03 ปิดตรงนี้:** รอบสำรวจ M03 เคยคำนวณภาคกลางได้ `31,680,988,983` และสงสัยว่า `data/README.md` (ที่เขียน `31,680,888,983`) พิมพ์ผิด คำตอบคือ SQL มาตรฐานบนไฟล์สะอาดให้ `...888,983` ตรง README เป๊ะ — เลข 988,983 มาจากการคำนวณ ad-hoc บนไฟล์ดิบที่กรองแถวไม่เหมือนกัน บทเรียนคือตัวเลขต้องมาจาก pipeline เดียวกับด่าน ไม่ใช่จากการคำนวณครั้งเดียวแล้วทิ้ง

## 7) เขียน `docs/ANALYSIS.md`

สั้น ๆ — ตารางจาก `docs/region-capital.csv` + ข้อสังเกตหนึ่งประโยคที่อ้างตัวเลขจากไฟล์เท่านั้น สั่งใน TUI (เลือกอย่างหนึ่ง) แล้วกดอนุญาต:

**เวอร์ชันอังกฤษ (แนะนำ):**

```text
@data-researcher Read docs/region-capital.csv only. Write docs/ANALYSIS.md in Thai with: (1) a short title and one sentence stating the source files (dataset.csv clean · analysis.sql · region-capital.csv), (2) a markdown table of all six regions with companies and capital_thb exactly as in the CSV, (3) one observation sentence that cites numbers from that table only. Do not invent totals or regions. Do not edit scripts/analysis.sql or .mcp.json.
```

**เวอร์ชันไทย (ใช้ได้ผลเท่ากัน):**

```text
@data-researcher อ่านเฉพาะ docs/region-capital.csv แล้วเขียน docs/ANALYSIS.md เป็นภาษาไทย โดยมี (1) ชื่อเรื่องสั้น + ประโยคหนึ่งบอกแหล่งที่มา (dataset.csv สะอาด · analysis.sql · region-capital.csv) (2) ตาราง markdown ทั้ง 6 ภาค พร้อมจำนวนกิจการและทุน ตาม CSV เป๊ะ (3) ข้อสังเกตหนึ่งประโยคที่อ้างตัวเลขจากตารางนั้นเท่านั้น ห้ามเดายอดหรือภาคเพิ่ม ห้ามแก้ scripts/analysis.sql หรือ .mcp.json
```

ผลที่คาดหวัง: `docs/ANALYSIS.md` มีตาราง 6 ภาคตรง CSV (กลาง 10,068 / 31,680,888,983 เป็นต้น) และข้อสังเกตหนึ่งประโยคที่ไม่ invent ตัวเลข

📦 **Handoff:** `docs/region-capital.csv` + `docs/ANALYSIS.md` = ชุดตัวเลขอ้างอิงของ synthesizer ใน Module 12 — ห้ามเดาตัวเลขนอกไฟล์นี้

## ผ่านเมื่อ

- สร้าง `.mcp.json` เองจากบล็อกด้านบน (มี `--python` `3.12` · ไม่มี `--read-write`)
- `claude mcp list` มี `data-duckdb` และกดอนุญาตใน TUI แล้ว
- `data-researcher` มี `mcpServers: data-duckdb` ใน frontmatter
- ได้ตารางรายเดือนจาก MCP จริง
- `scripts/analysis.sql` รันผ่าน duckdb จริง exit `0`
- `docs/region-capital.csv` มี 6 ภาค รวม 16,772 กิจการ / 45,341,868,784 บาท
- `docs/ANALYSIS.md` อ้างเฉพาะตัวเลขจากไฟล์

## ถ้าติดขัด

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| MCP ไม่ตอบ | ยังไม่กดอนุญาต หรือยังไม่ได้ติดตั้ง uv | ติดตั้ง uv ตาม SETUP.md แล้วกดอนุญาตตอน claude ถาม |
| uvx ครั้งแรกโหลดนานหรือล้ม | ดาวน์โหลดแพ็กเกจครั้งแรก / เครือข่ายองค์กรบล็อก | รอให้จบรอบแรก · ถ้าเน็ตบล็อกจริง ให้วิทยากรสาธิตบนเครื่องที่ผ่านแทน (แผนสำรองเดิมของห้อง) |
| build cryptography ล้ม | ไม่ได้ pin Python 3.12 | ใช้บล็อก `.mcp.json` ในขั้นที่ 1 เป๊ะ ๆ |
| `duckdb: command not found` | DuckDB CLI ยังไม่อยู่บน PATH | ติดตั้งตาม SETUP.md |
| ไม่มี tool `mcp__data-duckdb__*` | ยังไม่รีสตาร์ทหลังสร้างไฟล์ / ยังไม่ผูก frontmatter | ปิด TUI เปิดใหม่ ตรวจ `.mcp.json` + `mcpServers` |
| ยอดไม่ตรงเอกสาร | join จังหวัดพลาด หรือเทียบกับยอดพิมพ์ผิดใน `data/README.md` | ใช้คอลัมน์ `province` จากไฟล์สะอาดเป็นตัว join และเทียบกับตัวเลขจากการคำนวณตามขั้น 6 |
| CSV ออกมาว่าง | รันจากโฟลเดอร์อื่น | ต้องรันจากราก repo แอป |

## ถ้าตามไม่ทัน

จาก repo บทเรียน (ไฟล์ถูก copy ลง repo แอป รวม `.mcp.json`):

```bash
node scripts/catch-up.js w6
```

ได้ `.mcp.json` + `scripts/analysis.sql` + `docs/ANALYSIS.md` ฉบับอ้างอิง ตรวจด้วย `node solutions/w6/check.js` (จาก repo บทเรียน)

## ต่อยอด

เพิ่มตาราง "จังหวัดที่ทุนสูงสุด 10 อันดับ" ลง `docs/ANALYSIS.md` โดยเขียน SQL เอง — แล้วเทียบกับ `/api/summary` ให้ตรงกัน

## รู้เพิ่ม

MCP คือปลั๊กให้เอเจนต์อ่านของที่มีอยู่ — ขอบเขตของห้องนี้คือ DuckDB แบบอ่านอย่างเดียว ไม่มี `--read-write` และไม่มีเซิร์ฟเวอร์อื่น ตัวตรวจและตัววิเคราะห์ยังต้องแยกกัน: SQL ที่ดีต้องรันด้วยมือคุณ (หลักฐาน) ส่วน MCP คือทางให้เอเจนต์**ถามเอง**ได้โดยไม่ต้องรอคุณก็อปผลให้
