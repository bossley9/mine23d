import { isValidFolder } from './validate.ts'
import { Anvil } from './anvil.ts'

const regionFileFormat = new RegExp(/^r\.-?\d+\.-?\d+\.mca$/)

export async function getRegions(saveFolder: string) {
  const regionPath = saveFolder.replace(/\/$/, '') + '/region'
  if (!(await isValidFolder(regionPath))) {
    throw new Error(`unable to find ${regionPath} folder.`)
  }

  for (const regionDirEntry of Deno.readDirSync(regionPath)) {
    if (!regionFileFormat.test(regionDirEntry.name)) {
      continue
    }
    const [, rawRegionX, rawRegionZ] = regionDirEntry.name.split('.')
    const regionX = Number(rawRegionX)
    const regionZ = Number(rawRegionZ)

    console.debug(
      `region file found for region x=${regionX} and z=${regionZ}.`,
    )

    const anvilFilePath = `${regionPath}/${regionDirEntry.name}`

    console.debug(`anvil file path is ${anvilFilePath}.`)

    const anvil = new Anvil(anvilFilePath)
  }
}
