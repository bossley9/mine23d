export async function readSaveFolder(saveFolder: string) {
  const levelDataFilePath = saveFolder.replace(/\/$/, '') + '/level.dat'

  const reader = (await Deno.open(levelDataFilePath))
    .readable
    .pipeThrough(new DecompressionStream('gzip'))
    .pipeThrough(new TextDecoderStream())
    .getReader()

  let state = await reader.read()
  while (!state.done) {
    console.log('CHUNK:', state.value)
    state = await reader.read()
  }
}
