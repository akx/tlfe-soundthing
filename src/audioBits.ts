import React from "react";
import { midiToFreq } from "./notes";

export interface AudioBits {
  audioContext: AudioContext;
  filterNode: BiquadFilterNode;
  oscNode: OscillatorNode;
  vizNode: AnalyserNode;
}

export function createAudioBits(): AudioBits {
  const audioContext = new AudioContext();

  const oscNode = audioContext.createOscillator();
  const filterNode = audioContext.createBiquadFilter();
  const vizNode = audioContext.createAnalyser();
  vizNode.fftSize = 512;
  vizNode.smoothingTimeConstant = 0.3;

  oscNode.connect(filterNode);
  filterNode.connect(audioContext.destination);
  filterNode.connect(vizNode);
  return { audioContext, oscNode, filterNode, vizNode };
}

export const oscTypeOptions: [OscillatorType, string][] = [
  ["sawtooth", "Saw"],
  ["sine", "Sin"],
  ["square", "Sqr"],
  ["triangle", "Tri"],
];
export const filterTypeOptions: [BiquadFilterType, string][] = [
  ["bandpass", "Bandpass"],
  ["highpass", "Highpass"],
  ["lowpass", "Lowpass"],
  ["notch", "Notch"],
  ["peaking", "Peaking"],
];
const ROOT = 432;

export function useAuSequence(
  auRef: React.MutableRefObject<AudioBits>,
  song: string,
  noteIndex: number,
) {
  const songNotes = React.useMemo(() => {
    return song
      .split(/\s+/)
      .map((i) => +i)
      .filter(Boolean);
  }, [song]);
  const currentNoteFrequency = React.useMemo(() => {
    const actualNoteIndex = noteIndex % songNotes.length;
    const note = songNotes[actualNoteIndex];
    const freq = midiToFreq(note, ROOT) || ROOT;
    return Math.min(22050, Math.max(0, freq));
  }, [noteIndex, songNotes]);
  React.useEffect(() => {
    const au = auRef.current;
    au.oscNode.frequency.value = currentNoteFrequency;
  }, [currentNoteFrequency]);
}
