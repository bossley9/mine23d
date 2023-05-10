export type ChunkLocation = {
  offset: number
  sectorCount: number
  timestamp: Date
}

export enum CompressionType {
  GZipUnused = 1,
  Zlib = 2,
  Unused = 3,
}

export type Chunk = {
  compressionType: CompressionType
  lastUpdated: Date
  data: ArrayBuffer
}
