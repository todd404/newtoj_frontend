export const typeReg: { [key: string]: RegExp } = {
  int: /-?[1-9]\d*/,
  'int[]': /^\[(-?\d)+(?:,\s*-?\d+)*\]$|\[\]/
}
