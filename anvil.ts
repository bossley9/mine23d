import { concatenateBytes } from '@/utils/bytes.ts'
import { epochToDate } from '@/utils/date.ts'

type ChunkLocation = {
  offset: number
  sectorCount: number
  timestamp: Date
}

export class Anvil {
  private header: Uint8Array
  private chunkLocations: ChunkLocation[] = []

  private parseHeader(header: Uint8Array) {
    // first 4 KiB of header specifies chunk offsets within file
    // each chunk offset is 4 bytes
    for (let _i = 0; _i < 4096 / 4; _i++) {
      const index = _i * 4
      const tIndex = index + 4096

      const offset = concatenateBytes([
        header[index],
        header[index + 1],
        header[index + 2],
      ])
      const timeEpoch = concatenateBytes([
        header[tIndex],
        header[tIndex + 1],
        header[tIndex + 2],
        header[tIndex + 3],
      ])

      const chunkLocation: ChunkLocation = {
        offset,
        sectorCount: header[index + 3],
        timestamp: epochToDate(timeEpoch),
      }

      // if offset and sector count are both zero,
      // the chunk has not been generated
      if (chunkLocation.offset !== 0 && chunkLocation.sectorCount !== 0) {
        this.chunkLocations.push(chunkLocation)
      }
    }
  }

  constructor(anvilFilePath: string) {
    try {
      const data = Deno.readFileSync(anvilFilePath)
      // file begins with an 8KB header
      this.header = data.slice(0, 8192)
      this.parseHeader(this.header)
    } catch {
      throw new Error(`unable to read anvil file ${anvilFilePath}.`)
    }
  }
}
