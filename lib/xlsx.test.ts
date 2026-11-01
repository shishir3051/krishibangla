import { readFileSync } from 'node:fs';
import { deflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { excelSerialToIso, readFirstSheet } from './xlsx';

const tcbSheet = readFileSync(new URL('../test/fixtures/tcb-2026-11-01.xlsx', import.meta.url));

/** Builds a tiny zip (deflated entries) so the reader can be tested on hand-written XML. */
function zip(files: Record<string, string>): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBytes = Buffer.from(name);
    const data = deflateRawSync(Buffer.from(text));
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt16LE(nameBytes.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    locals.push(local, nameBytes, data);
    centrals.push(central, nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const directory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

describe('readFirstSheet', () => {
  it('reads shared strings, inline strings, numbers and formula results; skips errors and blanks', () => {
    const rows = readFirstSheet(
      zip({
        'xl/sharedStrings.xml': '<sst><si><t>চাল &amp; ডাল</t></si><si><r><t>Rich </t></r><r><t>text</t></r><rPh><t>x</t></rPh></si></sst>',
        'xl/worksheets/sheet1.xml':
          '<worksheet><sheetData>' +
          '<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1"><v>42.5</v></c><c r="C1" t="e"><v>#DIV/0!</v></c></row>' +
          '<row r="2"/>' +
          '<row r="3"><c r="A3" t="s"><v>1</v></c><c r="B3" s="2"/><c r="AB3" t="inlineStr"><is><t> inline </t></is></c><c r="C3"><f>B1*2</f><v>85</v></c></row>' +
          '</sheetData></worksheet>',
      })
    );
    expect(rows).toEqual([
      { row: 1, cells: { A: 'চাল & ডাল', B: '42.5' } },
      { row: 3, cells: { A: 'Rich text', AB: 'inline', C: '85' } },
    ]);
  });

  it("reads TCB's published sheet", () => {
    const rows = readFirstSheet(tcbSheet);
    expect(rows[0].cells.A).toBe('ট্রেডিং কর্পোরেশন অব বাংলাদেশ');
    expect(rows.find((r) => r.row === 7)?.cells.C).toBe('46327');
  });

  it('rejects files that are not zips', () => {
    expect(() => readFirstSheet(Buffer.from('not a spreadsheet at all, just some text'))).toThrow('Not a zip file');
  });
});

describe('excelSerialToIso', () => {
  it('converts 1900-system serial days', () => {
    expect(excelSerialToIso(46327)).toBe('2026-11-01');
    expect(excelSerialToIso(45962)).toBe('2025-11-01');
  });
});
