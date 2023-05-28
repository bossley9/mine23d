import { getByteString } from '@/utils/bytes.ts'
import { parseTagPayload } from '@/nbt/payload.ts'
import { ParsedTag, TagType } from '@/nbt/types.ts'

export function parseTag(
  data: DataView,
  startIndex: number,
): ParsedTag {
  const tagType = data.getUint8(startIndex)

  // end tags can also represent empty lists
  if (tagType === TagType.TAG_End) {
    return {
      tag: tagType,
      end: startIndex,
      name: '',
      data: [],
    }
  }

  // index = tag type
  // index + 1, index + 2 = tag name length
  // index + 3 = tag name
  // index + 3 + tag name length = payload

  const tagNameLength = data.getUint16(startIndex + 1)
  const tagName = getByteString(data, startIndex + 3, tagNameLength)
  const payloadStartIndex = startIndex + 3 + tagNameLength

  if (tagType === TagType.TAG_Compound) {
    let nextIndex = payloadStartIndex

    const payload: ParsedTag[] = []
    while (data.getUint8(nextIndex) !== TagType.TAG_End) {
      const parsedData = parseTag(data, nextIndex)
      payload.push(parsedData)
      nextIndex = parsedData.end + 1
    }
    return {
      tag: tagType,
      end: nextIndex + 1, // include TAG_End
      name: tagName,
      data: payload,
    }
  }

  const result = parseTagPayload(data, tagType, payloadStartIndex)

  return {
    tag: tagType,
    end: result.endIndex,
    name: tagName,
    data: result.payload,
  }
}
