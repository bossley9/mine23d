import { ParsedTag } from '@/nbt/types.ts'
import { getByteString } from '@/utils/bytes.ts'
import { parseTag } from '@/nbt/tag.ts'

export class NBT {
  private data: DataView
  private parsedData: ParsedTag

  constructor(buffer: ArrayBuffer) {
    this.data = new DataView(buffer)
    this.parsedData = this.parseDataAt(0)
  }

  private parseDataAt(
    index: number,
  ): ParsedTag {
    const tag = this.data.getUint8(index)

    const nameLength = this.data.getUint16(index + 1)
    const name = getByteString(this.data, index + 3, nameLength)
    const payloadIndex = index + 3 + nameLength

    const result = parseTag(this.data, payloadIndex)

    return {
      tag,
      end: result.end,
      name,
      data: result.data,
    }
  }

  public toString() {
    return JSON.stringify(
      this.parsedData,
      // bigint serialization compatibility
      (_, v) => typeof v === 'bigint' ? v.toString() : v,
      2,
    )
  }
}
