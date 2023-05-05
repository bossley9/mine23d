import { isValidFolder } from './validate.ts'

const regionFileFormat = new RegExp(/^r\.-?\d+\.-?\d+\.mca$/)

export async function getRegions(saveFolder: string) {
  const regionPath = saveFolder.replace(/\/$/, '') + '/region'
  if (!(await isValidFolder(regionPath))) {
    throw new Error(`unable to find ${regionPath} folder.`)
  }

  for (const regionFile of Deno.readDirSync(regionPath)) {
    if (!regionFileFormat.test(regionFile.name)) {
      continue
    }
    const [, x, z] = regionFile.name.split('.')

    console.log(`region file found for coordinates x=${x} and z=${z}.`)
  }
}
