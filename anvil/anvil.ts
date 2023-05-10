import { concatenateBytes } from '@/utils/bytes.ts'
import { epochToDate } from '@/utils/date.ts'
import {
  type Chunk,
  type ChunkLocation,
  type CompressionType,
} from '@/anvil/types.ts'

export class Anvil {
  private data: DataView
  private chunks: Chunk[]

  constructor(anvilFilePath: string) {
    try {
      const byteArray = Deno.readFileSync(anvilFilePath)
      this.data = new DataView(byteArray.buffer)
      // file begins with an 8KiB header
      const chunkLocations = this.getChunkLocations()
      this.chunks = this.getChunkData(chunkLocations)
    } catch (e) {
      throw new Error(`unable to read anvil file ${anvilFilePath}: ${e}`)
    }
  }

  private getChunkLocations() {
    const chunkLocations: ChunkLocation[] = []
    // first 4 KiB of header specifies chunk offsets within file
    // each chunk offset is 4 bytes
    for (let _i = 0; _i < 4096 / 4; _i++) {
      const index = _i * 4
      // second 4 KiB of header specifies chunk last updated timestamps
      const tIndex = index + 4096

      const offset = concatenateBytes(this.data, index, index + 3)
      const timeEpoch = concatenateBytes(this.data, tIndex, tIndex + 4)

      const chunkLocation: ChunkLocation = {
        offset,
        sectorCount: this.data.getInt8(index + 3),
        timestamp: epochToDate(timeEpoch),
      }

      // if offset and sector count are both zero,
      // the chunk has not been generated
      if (chunkLocation.offset !== 0 && chunkLocation.sectorCount !== 0) {
        chunkLocations.push(chunkLocation)
      }
    }
    return chunkLocations
  }

  private getChunkData(chunkLocations: ChunkLocation[]): Chunk[] {
    return chunkLocations.map(({ offset: locationOffset, timestamp }) => {
      // offset is measured in 4KiB sectors
      const offset = 4096 * locationOffset

      // first 4 bytes specify payload length
      const dataLength = concatenateBytes(this.data, offset, offset + 4)
      const compressionType: CompressionType = this.data.getUint8(offset + 4)

      const data = this.data.buffer.slice(
        offset + 5,
        offset + 5 + dataLength - 1,
      )

      return {
        compressionType,
        lastUpdated: timestamp,
        data,
      }
    })
  }
}
