export async function isValidSaveFolder(
  saveFolder: string,
): Promise<boolean> {
  try {
    const saveInfo = await Deno.stat(saveFolder)
    return saveInfo.isDirectory
  } catch {
    return false
  }
}
