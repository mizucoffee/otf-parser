import { Parser } from 'binary-parser'

let byteCount = 0

export function parse(font: Buffer) {
  byteCount = 0
  return parseHeader(font)
}

interface IOffsetTable {
  sfntVersion: number
  numTables: number
  searchRange: number
  entrySelector: number
  rangeShift: number
}

interface ITable {
  tableTag: string
  checkSum: number
  offset: number
  length: number
  body: number
}

function parseHeader(font: Buffer) {
  byteCount = 0
  const offsetTable = parseOffsetTable(font)
  return {
    offsetTable,
    tables: parseTableRecord(font, offsetTable)
  }
}

function parseOffsetTable(font: Buffer): IOffsetTable {
  const offsetTable = new Parser()
    .skip(byteCount)
    .endianess("big")
    .uint32("sfntVersion")
    .uint16("numTables")
    .uint16("searchRange")
    .uint16("entrySelector")
    .uint16("rangeShift")

  byteCount += 12

  return offsetTable.parse(font)
}

function parseTableRecord(font: Buffer, offsetTable: IOffsetTable): ITable[] {

  let tables: ITable[] = []

  for (let i = 0; i < offsetTable.numTables; i++) {
    let tableRecord: Parser<any> = new Parser()
      .skip(byteCount)
      .endianess("big")
      .array("tableTag", { type: "uint8", length: 4 })
      .uint32("checkSum")
      .uint32("offset")
      .uint32("length")

    byteCount += 16

    const table = tableRecord.parse(font)
    table.tableTag = String.fromCharCode(...table.tableTag)

    let tableBody: Parser<any> = new Parser()
      .skip(table.offset)
      .endianess("big")
      .buffer('', { length: table.length })
    table.body = tableBody.parse(font)

    tables.push(table)
  }

  return tables
}