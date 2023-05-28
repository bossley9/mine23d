import { ParsedTag, TagType } from '@/nbt/types.ts'

export class NBT {
  private data: DataView
  private parsedData: ParsedTag

  constructor(buffer: ArrayBuffer) {
    this.data = new DataView(buffer)
    this.parsedData = this.parseDataAt(0)
  }

  private parseStringData(startIndex: number, length: number): string {
    let s = ''
    for (let i = startIndex; i < startIndex + length; i++) {
      s += String.fromCharCode(this.data.getUint8(i))
    }
    return s
  }

  private parseDataAt(
    index: number,
  ): ParsedTag {
    const tag = this.data.getUint8(index)

    // TODO determine if needed and remove if unnecessary
    if (tag === TagType.TAG_End) {
      return {
        tag,
        end: index,
        name: '',
        data: '',
      }
    }

    // index = tag type
    // index + 1, index + 2 = tag name length
    // index + 3 = tag name
    // index + 3 + tag name length = payload

    const nameLength = this.data.getUint16(index + 1)
    const name = this.parseStringData(index + 3, nameLength)
    const payloadIndex = index + 3 + nameLength

    switch (tag) {
      case TagType.TAG_Byte: {
        return {
          tag,
          end: payloadIndex,
          name,
          data: this.data.getInt8(payloadIndex),
        }
      }
      case TagType.TAG_Short: {
        return {
          tag,
          end: payloadIndex + 1,
          name,
          data: this.data.getInt16(payloadIndex),
        }
      }
      case TagType.TAG_Int: {
        return {
          tag,
          end: payloadIndex + 3,
          name,
          data: this.data.getInt32(payloadIndex),
        }
      }
      case TagType.TAG_Long: {
        return {
          tag,
          end: payloadIndex + 7,
          name,
          // TODO serialize bigints
          // data: this.data.getBigInt64(payloadIndex),
          data: 'TODO',
        }
      }
      case TagType.TAG_Float: {
        return {
          tag,
          end: payloadIndex,
          name,
          data: 'tag float',
        }
      }
      case TagType.TAG_Double: {
        return {
          tag,
          end: payloadIndex + 7,
          name,
          data: this.data.getFloat64(payloadIndex),
        }
      }
      case TagType.TAG_Byte_Array: {
        return {
          tag,
          end: payloadIndex,
          name,
          data: 'tag byte array',
        }
      }
      case TagType.TAG_String: {
        return {
          tag,
          end: payloadIndex,
          name,
          data: 'tag string',
        }
      }
      case TagType.TAG_List: {
        return {
          tag,
          end: payloadIndex,
          name,
          data: 'tag list',
        }
      }

      case TagType.TAG_Compound: {
        let nextIndex = payloadIndex

        const data: ParsedTag[] = []
        while (this.data.getUint8(nextIndex) !== TagType.TAG_End) {
          const parsedData = this.parseDataAt(nextIndex)
          data.push(parsedData)
          nextIndex = parsedData.end + 1
        }
        return {
          tag,
          end: nextIndex + 1, // includes TAG_End
          name,
          data,
        }
      }

      case TagType.TAG_Int_Array: {
        return {
          tag,
          end: payloadIndex,
          name,
          data: 'tag int array',
        }
      }
      case TagType.TAG_Long_Array: {
        return {
          tag,
          end: index,
          name,
          data: 'tag long array',
        }
      }
      default: {
        return {
          tag,
          end: index,
          name: 'invalid tag',
          data: null,
        }
      }
    }
  }

  public toString() {
    return JSON.stringify(this.parsedData, null, 2)
  }
}
