type ChunkLocation = {
  offset: number
  sectorCount: number
}

export class Anvil {
  private header: Uint8Array
  private chunkLocations: ChunkLocation[] = []

  private parseHeader(header: Uint8Array) {
    // first 4 KiB of header specifies chunk offsets within file
    // each chunk offset is 4 bytes
    for (let _i = 0; _i < 4096 / 4; _i++) {
      const index = _i * 4
      const chunkLocation: ChunkLocation = {
        offset: (header[index] << 16) | (header[index + 1] << 8) |
          header[index + 2],
        sectorCount: header[index + 3],
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
