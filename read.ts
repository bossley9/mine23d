import { parseNBTFile } from './nbt.ts'

export async function readSaveFolder(saveFolder: string) {
  const levelDataFilePath = saveFolder.replace(/\/$/, '') + '/level.dat'

  await parseNBTFile(levelDataFilePath)
}
