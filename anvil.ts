export class Anvil {
  private header: Uint8Array

  constructor(anvilFilePath: string) {
    try {
      const data = Deno.readFileSync(anvilFilePath)
      // file begins with an 8KB header
      this.header = data.slice(0, 8192)
    } catch {
      throw new Error(`unable to read anvil file ${anvilFilePath}.`)
    }
  }
}
