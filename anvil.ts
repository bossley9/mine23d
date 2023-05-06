export class Anvil {
  private anvilFileData: Uint8Array

  constructor(anvilFilePath: string) {
    try {
      this.anvilFileData = Deno.readFileSync(anvilFilePath)
    } catch {
      throw new Error(`unable to read anvil file ${anvilFilePath}.`)
    }

    console.debug('raw anvil data is', this.anvilFileData)
  }
}
