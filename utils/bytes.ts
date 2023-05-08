// given an array of byte values, concatenate them into a single
// numerical value accounting for bit shifts
export function concatenateBytes(byteArray: number[]): number {
  let result = 0
  const numBytes = byteArray.length

  for (let i = 0; i < numBytes; i++) {
    const shift = (numBytes - i - 1) * 8
    result = result | (byteArray[i] << shift)
  }

  return result
}
