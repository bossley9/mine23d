import { getRegions } from '@/anvil/region.ts'

async function main(saveFolder: string | undefined) {
  if (!saveFolder) {
    console.error('%cUsage: mine23d [save folder]', 'color: yellow')
    Deno.exit(0)
  }

  try {
    await getRegions(saveFolder)
  } catch (e) {
    console.error(`%c${e}`, 'color: red')
    Deno.exit(1)
  }
}

main(Deno.args?.[0])
