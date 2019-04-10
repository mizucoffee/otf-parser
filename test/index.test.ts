import * as OtfParser from '../src'
import * as fs from 'fs'

describe('F5.6 - OTF', () => {
  const font = fs.readFileSync('./test/f5.6.otf')
  const result = OtfParser.parse(font)

  describe('Header', () => {
    test('OffsetTable', () => {
      const t = result.offsetTable
      expect(t.sfntVersion).toBe(0x4F54544F)
      expect(t.numTables).toBe(12)

      let i = 0
      for (;2**(i+1) <= t.numTables; i++);
      expect(t.searchRange).toBe(2**i * 16)
      expect(t.entrySelector).toBe(Math.log2(2**i))
      expect(t.rangeShift).toBe(t.numTables * 16 - t.searchRange)
    })
    test('TableRecord', () => {
      const t = result.tables
      expect(t[0].tableTag).toEqual('CFF ')
      expect(t[0].checkSum).toBe(2022354963)
      expect(t[0].offset).toBe(1664)
      expect(t[0].length).toBe(9244)
    })
  })
})

describe('RetroScape - TTF', () => {
  const font = fs.readFileSync('./test/retroscape.ttf')
  const result = OtfParser.parse(font)

  describe('Header', () => {
    test('OffsetTable', () => {
      const t = result.offsetTable
      expect(t.sfntVersion).toBe(0x00010000)
      expect(t.numTables).toBe(10)

      let i = 0
      for (;2**(i+1) <= t.numTables; i++);
      expect(t.searchRange).toBe(2**i * 16)
      expect(t.entrySelector).toBe(Math.log2(2**i))
      expect(t.rangeShift).toBe(t.numTables * 16 - t.searchRange)
    })
    test('TableRecord', () => {
      const t = result.tables
      expect(t[0].tableTag).toEqual('OS/2')
      expect(t[0].checkSum).toBe(278272361)
      expect(t[0].offset).toBe(2768)
      expect(t[0].length).toBe(96)
    })
  })
})