import { isValidSaveFolder } from './validate.ts'

async function main(saveFolder: string | undefined) {
  if (!saveFolder) {
    console.error('%cUsage: mine23d [save folder]', 'color: yellow')
    Deno.exit(0)
  }

  if (await isValidSaveFolder(saveFolder)) {
    console.log('valid')
  } else {
    console.error('%cError: invalid save folder supplied.', 'color: red')
    Deno.exit(1)
  }
}

main(Deno.args?.[0])
