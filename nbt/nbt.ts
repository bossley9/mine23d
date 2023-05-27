import { ParsedTag, TagType } from '@/nbt/types.ts'

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

    switch (tag) {
      case TagType.TAG_End: {
        return {
          end: index,
          name: '',
          data: 'tag end',
        }
      }
      case TagType.TAG_Byte: {
        return {
          end: index,
          name: '',
          data: 'tag byte',
        }
      }
      case TagType.TAG_Short: {
        return {
          end: index,
          name: '',
          data: 'tag short',
        }
      }
      case TagType.TAG_Int: {
        return {
          end: index,
          name: '',
          data: 'tag int',
        }
      }
      case TagType.TAG_Long: {
        return {
          end: index,
          name: '',
          data: 'tag long',
        }
      }
      case TagType.TAG_Float: {
        return {
          end: index,
          name: '',
          data: 'tag float',
        }
      }
      case TagType.TAG_Double: {
        return {
          end: index,
          name: '',
          data: 'tag double',
        }
      }
      case TagType.TAG_Byte_Array: {
        return {
          end: index,
          name: '',
          data: 'tag byte array',
        }
      }
      case TagType.TAG_String: {
        return {
          end: index,
          name: '',
          data: 'tag string',
        }
      }
      case TagType.TAG_List: {
        return {
          end: index,
          name: '',
          data: 'tag list',
        }
      }
      case TagType.TAG_Compound: {
        return {
          end: index,
          name: '',
          data: 'tag compound',
        }
      }
      case TagType.TAG_Int_Array: {
        return {
          end: index,
          name: '',
          data: 'tag int array',
        }
      }
      case TagType.TAG_Long_Array: {
        return {
          end: index,
          name: '',
          data: 'tag long array',
        }
      }
      default: {
        return {
          end: index,
          name: 'invalid tag',
          data: 'invalid tag',
        }
      }
    }
  }
}
