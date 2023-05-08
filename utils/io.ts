export async function isValidFolder(
  folder: string,
): Promise<boolean> {
  try {
    const fileinfo = await Deno.stat(folder)
    return fileinfo.isDirectory
  } catch {
    return false
  }
}
