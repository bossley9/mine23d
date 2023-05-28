import { getByteString } from '@/utils/bytes.ts'
import { TagType } from '@/nbt/types.ts'

type PayloadResult = {
  payload: unknown
  endIndex: number
}
export function parseTagPayload(
  data: DataView,
  tagType: TagType,
  startIndex: number,
): PayloadResult {
  switch (tagType) {
    case TagType.TAG_Byte: {
      return {
        endIndex: startIndex,
        payload: data.getInt8(startIndex),
      }
    }
    case TagType.TAG_Short: {
      return {
        endIndex: startIndex + 1,
        payload: data.getInt16(startIndex),
      }
    }
    case TagType.TAG_Int: {
      return {
        endIndex: startIndex + 3,
        payload: data.getInt32(startIndex),
      }
    }
    case TagType.TAG_Long: {
      return {
        endIndex: startIndex + 7,
        payload: data.getBigInt64(startIndex),
      }
    }
    case TagType.TAG_Float: {
      return {
        endIndex: startIndex + 3,
        payload: data.getFloat32(startIndex),
      }
    }
    case TagType.TAG_Double: {
      return {
        endIndex: startIndex + 7,
        payload: data.getFloat64(startIndex),
      }
    }
    case TagType.TAG_Byte_Array: {
      const arrayLen = data.getInt32(startIndex)
      let endIndex = startIndex + 3

      const payload: unknown[] = []
      for (let i = 0; i < arrayLen; i++) {
        const res = parseTagPayload(data, TagType.TAG_Int, endIndex + 1)
        payload.push(res.payload)
        endIndex = res.endIndex
      }

      return {
        endIndex,
        payload,
      }
    }
    case TagType.TAG_String: {
      const strLen = data.getUint16(startIndex)
      const str = getByteString(data, startIndex + 2, strLen)
      return {
        endIndex: startIndex + 2 + strLen,
        payload: str,
      }
    }
    case TagType.TAG_List: {
      const listTagType = data.getUint8(startIndex)
      const listLength = data.getInt32(startIndex + 1)
      let endIndex = startIndex + 1 + 3

      const payload: unknown[] = []
      for (let i = 0; i < listLength; i++) {
        const res = parseTagPayload(data, listTagType, endIndex + 1)
        payload.push(res.payload)
        endIndex = res.endIndex
      }

      return {
        endIndex,
        payload,
      }
    }
    case TagType.TAG_Int_Array: {
      const arrayLen = data.getInt32(startIndex)
      let endIndex = startIndex + 3

      const payload: unknown[] = []
      for (let i = 0; i < arrayLen; i++) {
        const res = parseTagPayload(data, TagType.TAG_Int, endIndex + 1)
        payload.push(res.payload)
        endIndex = res.endIndex
      }

      return {
        endIndex,
        payload,
      }
    }
    case TagType.TAG_Long_Array: {
      const arrayLen = data.getInt32(startIndex)
      let endIndex = startIndex + 3

      const payload: unknown[] = []
      for (let i = 0; i < arrayLen; i++) {
        const res = parseTagPayload(data, TagType.TAG_Int, endIndex + 1)
        payload.push(res.payload)
        endIndex = res.endIndex
      }

      return {
        endIndex,
        payload,
      }
    }
    default: {
      return { payload: null, endIndex: startIndex }
    }
  }
}
