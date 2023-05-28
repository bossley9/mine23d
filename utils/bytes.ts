// given an array of byte values, concatenate them into a single
// numerical value accounting for endian-ness.
// end is exclusive.
export function concatenateBytes(
  data: DataView,
  start: number,
  end: number,
): number {
  let result = 0
  for (let i = start; i < end; i++) {
    result = (result << 8) + data.getUint8(i)
  }
  return result
}

export function getByteString(
  data: DataView,
  startIndex: number,
  length: number,
): string {
  let s = ''
  for (let i = startIndex; i < startIndex + length; i++) {
    s += String.fromCharCode(data.getUint8(i))
  }
  return s
}
