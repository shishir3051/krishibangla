/**
 * xlsx.ts — Minimal reader for the first worksheet of an .xlsx file: cell values as text, by row.
 * Enough for simple published tables (TCB's daily price sheet), without a spreadsheet dependency.
 * An .xlsx is a zip of XML parts; this reads the zip's central directory, inflates the parts it
 * needs with node:zlib and pulls values out of the sheet XML. Formulas give their cached value;
 * error cells (#DIV/0!) are skipped. Not supported: zip64, encryption, dates as dates (they are
 * Excel serial numbers — see excelSerialToIso).
 */
import { inflateRawSync } from 'node:zlib';

export type SheetRow = { row: number; cells: Record<string, string> };

const MAX_PART_BYTES = 20 * 1024 * 1024; // inflated size cap per part, guards against zip bombs

/** Every file in the zip, by name, still compressed (inflated lazily by readPart). */
function zipEntries(zip: Buffer): Map<string, { method: number; data: Buffer }> {
  // End of central directory: 22 bytes plus an optional comment of up to 64 KB, at the end of the file.
  let eocd = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 22 - 0xffff); i--) {
    if (zip.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('Not a zip file');

  const count = zip.readUInt16LE(eocd + 10);
  let p = zip.readUInt32LE(eocd + 16);
  const entries = new Map<string, { method: number; data: Buffer }>();
  for (let i = 0; i < count; i++) {
    if (zip.readUInt32LE(p) !== 0x02014b50) throw new Error('Corrupt zip central directory');
    const method = zip.readUInt16LE(p + 10);
    const size = zip.readUInt32LE(p + 20);
    const nameLength = zip.readUInt16LE(p + 28);
    const extraLength = zip.readUInt16LE(p + 30);
    const commentLength = zip.readUInt16LE(p + 32);
    const local = zip.readUInt32LE(p + 42);
    const name = zip.toString('utf8', p + 46, p + 46 + nameLength);
    if (zip.readUInt32LE(local) !== 0x04034b50) throw new Error(`Corrupt zip entry ${name}`);
    const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    entries.set(name, { method, data: zip.subarray(start, start + size) });
    p += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function readPart(entries: ReturnType<typeof zipEntries>, name: string): string | null {
  const entry = entries.get(name);
  if (!entry) return null;
  if (entry.method === 0) return entry.data.toString('utf8');
  if (entry.method === 8) return inflateRawSync(entry.data, { maxOutputLength: MAX_PART_BYTES }).toString('utf8');
  throw new Error(`Unsupported zip compression method ${entry.method} for ${name}`);
}

function decodeXml(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, e: string) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[e.toLowerCase()]!;
  });
}

/** Text of a string item: plain <t> or rich-text runs; phonetic hints (<rPh>) are left out. */
function itemText(xml: string): string {
  const withoutPhonetic = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '');
  return [...withoutPhonetic.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => decodeXml(m[1])).join('');
}

/** Rows of the workbook's first worksheet; each cell's text keyed by column letters ("A", "C", "AB"). */
export function readFirstSheet(xlsx: Uint8Array): SheetRow[] {
  const entries = zipEntries(Buffer.from(xlsx.buffer, xlsx.byteOffset, xlsx.byteLength));
  const sheetName = [...entries.keys()]
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]))[0];
  const sheet = sheetName ? readPart(entries, sheetName) : null;
  if (!sheet) throw new Error('Workbook has no worksheet');

  const sharedXml = readPart(entries, 'xl/sharedStrings.xml') ?? '';
  const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => itemText(m[1]));

  const rows: SheetRow[] = [];
  for (const [, rowAttrs, rowXml = ''] of sheet.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const cells: Record<string, string> = {};
    for (const [, attrs, body = ''] of rowXml.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = attrs.match(/\br="([A-Z]+)\d+"/)?.[1];
      const type = attrs.match(/\bt="([^"]+)"/)?.[1];
      if (!ref || type === 'e') continue;
      const value = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      const text = type === 'inlineStr' ? itemText(body) : type === 's' ? shared[Number(value)] : value != null ? decodeXml(value) : undefined;
      if (text != null && text.trim() !== '') cells[ref] = text.trim();
    }
    const row = Number(rowAttrs.match(/\br="(\d+)"/)?.[1]);
    if (Object.keys(cells).length > 0 && row > 0) rows.push({ row, cells });
  }
  return rows;
}

/** Excel serial day number (1900 date system) → "YYYY-MM-DD". */
export function excelSerialToIso(serial: number): string {
  return new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86_400_000).toISOString().slice(0, 10);
}
