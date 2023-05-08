import { isValidFolder } from '@/utils/io.ts'
import { Anvil } from '@/anvil/anvil.ts'

const regionFileFormat = new RegExp(/^r\.-?\d+\.-?\d+\.mca$/)

export async function getRegions(saveFolder: string) {
  const regionPath = saveFolder.replace(/\/$/, '') + '/region'
  if (!(await isValidFolder(regionPath))) {
    throw new Error(`unable to find ${regionPath} folder.`)
  }

  for (const regionDirEntry of Deno.readDirSync(regionPath)) {
    if (!regionFileFormat.test(regionDirEntry.name)) {
      console.log(
        `%cWarning: file ${regionDirEntry.name} does not match anvil file naming format.`,
      )
      continue
    }
    const anvil = new Anvil(`${regionPath}/${regionDirEntry.name}`)

    console.log(anvil)
  }
}
