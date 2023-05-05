// See specification here:
// https://web.archive.org/web/20110723210920/http://www.minecraft.net/docs/NBT.txt

export async function parseNBTFile(filepath: string) {
  const stream = (await Deno.open(filepath))
    .readable
    // decompress from gzip
    .pipeThrough(new DecompressionStream('gzip'))

  const reader = stream.getReader()

  let state = await reader.read()
  while (!state.done) {
    parseNamedTag(state.value, 0)
    state = await reader.read()
  }
}

enum NamedTagType {
  TAG_End = 0,
  TAG_Byte = 1,
  TAG_Short = 2,
  TAG_Int = 3,
  TAG_Long = 4,
  TAG_Float = 5,
  TAG_Double = 6,
  TAG_Byte_Array = 7,
  TAG_String = 8,
  TAG_List = 9,
  TAG_Compound = 10,
}

type AbstractNamedTag = {
  type: NamedTagType
  name: string
  payload: unknown
}

function parseNamedTag(data: Uint8Array, index: number): AbstractNamedTag {
  const tagType = data[index]

  switch (tagType) {
    case NamedTagType.TAG_End: {
      console.log('end tag')
      break
    }
    case NamedTagType.TAG_Byte: {
      console.log('byte tag')
      break
    }
    case NamedTagType.TAG_Short: {
      console.log('short tag')
      break
    }
    case NamedTagType.TAG_Int: {
      console.log('int tag')
      break
    }
    case NamedTagType.TAG_Long: {
      console.log('long tag')
      break
    }
    case NamedTagType.TAG_Float: {
      console.log('float tag')
      break
    }
    case NamedTagType.TAG_Double: {
      console.log('double tag')
      break
    }
    case NamedTagType.TAG_Byte_Array: {
      console.log('byte array tag')
      break
    }
    case NamedTagType.TAG_String: {
      console.log('string tag')
      break
    }
    case NamedTagType.TAG_List: {
      console.log('list tag')
      break
    }
    case NamedTagType.TAG_Compound: {
      console.log('next bytes are', data)
      return {
        type: NamedTagType.TAG_Compound,
        name: 'shfdjskfhsaklfhsaj',
        payload: 'fhdjaskfhlas',
      }
    }
    default: {
      throw new Error(`invalid tag type ${tagType}`)
    }
  }

  // TODO remove
  return {
    type: NamedTagType.TAG_Compound,
    name: 'shfdjskfhsaklfhsaj',
    payload: 'fhdjaskfhlas',
  }
}
