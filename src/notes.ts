// via https://github.com/tonaljs/tonal/blob/main/packages/midi/index.ts

export function midiToFreq(midi: number, tuning = 440): number {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}

const pcs = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export function midiToNoteName(midi: number): string {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pc = pcs[midi % 12];
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}
