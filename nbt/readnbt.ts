import { NBT } from '@/nbt/nbt.ts'
import { gunzip } from 'compress/mod.ts'

async function readnbt(nbtFile: string | undefined) {
  if (!nbtFile) {
    console.error('%cUsage: readnbt [nbt file]', 'color: yellow')
    Deno.exit(0)
  }

  try {
    const byteArray = await Deno.readFile(nbtFile)
    const uncompressedData: ArrayBuffer = gunzip(byteArray).buffer
    const nbt = new NBT(uncompressedData)
    console.log(nbt)
  } catch (e) {
    console.error(`%c${e}`, 'color: red')
    Deno.exit(1)
  }
}

readnbt(Deno.args?.[0])
