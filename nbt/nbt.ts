import { ParsedTag, TagType } from '@/nbt/types.ts'
import { getByteString } from '@/utils/bytes.ts'
import { getTagPayload } from '@/nbt/payload.ts'

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
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Short: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Int: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Long: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Float: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Double: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Byte_Array: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_String: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_List: {
        const listTag = this.data.getUint8(payloadIndex)
        const listLength = this.data.getInt32(payloadIndex + 1)
        let endIndex = payloadIndex + 1 + 3

        if (listLength === 0) {
          return {
            tag,
            end: endIndex,
            name,
            data: [],
          }
        }

        // TODO handle other tag types
        if (listTag === TagType.TAG_String) {
          const data: unknown[] = []
          for (let i = 0; i < listLength; i++) {
            const res = getTagPayload(
              this.data,
              listTag,
              endIndex + 1,
            )
            data.push(res.payload)
            endIndex = res.endIndex
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
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      case TagType.TAG_Long_Array: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return { tag, end: res.endIndex, name, data: res.payload }
      }
      default: {
        const res = getTagPayload(
          this.data,
          tag,
          payloadIndex,
        )
        return {
          tag,
          end: res.endIndex,
          name: 'invalid tag',
          data: res.payload,
        }
      }
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
