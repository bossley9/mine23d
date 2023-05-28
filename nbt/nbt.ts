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

    // index = tag type
    // index + 1, index + 2 = tag name length
    // index + 3 = tag name
    // index + 3 + tag name length = payload

    switch (tag) {
      case TagType.TAG_End: {
        return {
          tag,
          end: index,
          name: '',
          data: '',
        }
      }
      case TagType.TAG_Byte: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag byte',
        }
      }
      case TagType.TAG_Short: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag short',
        }
      }
      case TagType.TAG_Int: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag int',
        }
      }
      case TagType.TAG_Long: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag long',
        }
      }
      case TagType.TAG_Float: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag float',
        }
      }
      case TagType.TAG_Double: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag double',
        }
      }
      case TagType.TAG_Byte_Array: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag byte array',
        }
      }
      case TagType.TAG_String: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag string',
        }
      }
      case TagType.TAG_List: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag list',
        }
      }

      case TagType.TAG_Compound: {
        const nameLength = this.data.getUint16(index + 1)
        const name = this.parseStringData(index + 3, nameLength)
        let nextIndex = index + 3 + nameLength

        const data: ParsedTag[] = []
        while (this.data.getUint8(nextIndex) !== TagType.TAG_End) {
          const parsedData = this.parseDataAt(nextIndex)
          data.push(parsedData)
          nextIndex = parsedData.end + 1
        }
        return {
          tag,
          end: nextIndex,
          name,
          data,
        }
      }

      case TagType.TAG_Int_Array: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag int array',
        }
      }
      case TagType.TAG_Long_Array: {
        return {
          tag,
          end: index,
          name: '',
          data: 'tag long array',
        }
      }
      default: {
        return {
          tag,
          end: index,
          name: 'invalid tag',
          data: '',
        }
      }
    }
  }

  public toString() {
    return JSON.stringify(this.parsedData, null, 2)
  }
}
