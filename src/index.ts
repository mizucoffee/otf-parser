import { Parser } from 'binary-parser'

export function parse(font: Buffer) {
  return parseHeader(font)
}

function parseHeader(font: Buffer) {
  return {
    offsetTable: parseOffsetTable(font)
  }
}

function parseOffsetTable(font: Buffer) {
  const offsetTable = new Parser()
    .endianess("big")
    .uint32("sfntVersion")
    .uint16("numTables")
    .uint16("searchRange")
    .uint16("entrySelector")
    .uint16("rangeShift")

  return offsetTable.parse(font)
}