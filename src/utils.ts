export function mapRange<T>(min: number, max: number, fn: (num: number) => T) {
  const out = [];
  for (let i = min; i < max; i++) {
    out.push(fn(i));
  }
  return out;
}

export function getArrMax(arr: Float32Array | Uint8Array) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    max = Math.max(Math.abs(arr[i]), max);
  }
  return max;
}
