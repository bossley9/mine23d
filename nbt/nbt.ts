import { ParsedTag, TagType } from '@/nbt/types.ts'
import { getByteString } from '@/utils/bytes.ts'

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
    const name = getByteString(this.data, index + 3, nameLength)
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
          end: payloadIndex + 3,
          name,
          data: this.data.getFloat32(payloadIndex),
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
        const len = this.data.getInt32(payloadIndex)
        let endIndex = payloadIndex + 3

        const data: number[] = []
        for (let i = 0; i < len; i++) {
          data.push(this.data.getInt8(endIndex + 1))
          endIndex = endIndex + 1
        }

        return {
          tag,
          end: endIndex,
          name,
          data,
        }
      }
      case TagType.TAG_String: {
        const strLen = this.data.getUint16(payloadIndex + 1)
        const str = getByteString(this.data, payloadIndex + 1, strLen)
        return {
          tag,
          end: payloadIndex,
          name,
          data: str,
        }
      }
      case TagType.TAG_List: {
        const listTag = this.data.getUint8(payloadIndex)
        const listLength = this.data.getInt32(payloadIndex + 1)
        let endIndex = payloadIndex + 1 + 3

        // TODO handle other tag types
        if (listTag === TagType.TAG_String) {
          const data: string[] = []
          for (let i = 0; i < listLength; i++) {
            const strLen = this.data.getUint16(endIndex + 1)
            const str = getByteString(this.data, endIndex + 3, strLen)
            data.push(str)
            endIndex = endIndex + 3 + strLen
          }

          return {
            tag,
            end: payloadIndex,
            name,
            data,
          }
        } else {
          return {
            tag,
            end: payloadIndex,
            name,
            data: 'TODO',
          }
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
