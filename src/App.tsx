import React from "react";
import { midiToFreq } from "./notes";
import { useInterval } from "react-use";
import { Viz } from "./components/Viz";
import Slider from "./components/Slider";
import NoteGrid from "./components/NoteGrid";
import styled from "styled-components";
import Toggle from "./components/Toggle";

const Main = styled.div({
  display: "flex",
  ">div": {
    flex: 1,
  },
  gap: "1em",
  padding: "1em",
});
const Toolbar = styled.div({
  background: "#BDC581",
  padding: "1em",
});
const SongInput = styled.input({
  width: "100%",
});

interface AudioBits {
  audioContext: AudioContext;
  filterNode: BiquadFilterNode;
  oscNode: OscillatorNode;
  vizNode: AnalyserNode;
}

function init(): AudioBits {
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

const oscTypeOptions: [OscillatorType, string][] = [
  ["sawtooth", "Saw"],
  ["sine", "Sin"],
  ["square", "Sqr"],
  ["triangle", "Tri"],
];

const filterTypeOptions: [BiquadFilterType, string][] = [
  ["bandpass", "Bandpass"],
  ["highpass", "Highpass"],
  ["lowpass", "Lowpass"],
  ["notch", "Notch"],
  ["peaking", "Peaking"],
];

const ROOT = 432;

function App() {
  const [au] = React.useState(() => init());
  const [song, setSong] = React.useState("44 66 89 30");
  const [tempo, setTempo] = React.useState(120);
  const [filterFreq, setFilterFreq] = React.useState(800);
  const [filterQ, setFilterQ] = React.useState(1);
  const [filterType, setFilterType] =
    React.useState<BiquadFilterType>("lowpass");
  const [oscType, setOscType] = React.useState<OscillatorType>("square");
  const [noteIndex, setNoteIndex] = React.useState(0);
  const lastAuRef = React.useRef<AudioBits>(au);
  lastAuRef.current = au;

  const tick = React.useCallback(() => {
    setNoteIndex((ni) => ni + 1);
  }, []);
  useInterval(tick, 60000 / (tempo * 4));

  const songNotes = React.useMemo(() => {
    return song
      .split(/\s+/)
      .map((i) => +i)
      .filter(Boolean);
  }, [song]);
  const currentNoteFrequency = React.useMemo(() => {
    const actualNoteIndex = noteIndex % songNotes.length;
    const note = songNotes[actualNoteIndex];
    return midiToFreq(note, ROOT) || ROOT;
  }, [noteIndex, songNotes]);
  React.useEffect(() => {
    const au = lastAuRef.current;
    au.oscNode.frequency.value = currentNoteFrequency;
    au.oscNode.type = oscType;
    au.filterNode.frequency.value = filterFreq;
    au.filterNode.Q.value = filterQ;
    au.filterNode.type = filterType;
  }, [currentNoteFrequency, filterFreq, filterQ, filterType, oscType]);
  const appendNote = React.useCallback((note: string) => {
    setSong((currentSong) => (currentSong + " " + note).trim());
  }, []);
  return (
    <div className="App">
      <Toolbar>
        <button
          onClick={() => {
            au.audioContext.resume();
            au.oscNode.start();
          }}
        >
          Go
        </button>
      </Toolbar>
      <Main>
        <div>
          <Slider
            label="Tempo"
            value={tempo}
            unit="BPM"
            onChange={setTempo}
            min={20}
            max={300}
          />
          <Slider
            label="Filter Frequency"
            value={filterFreq}
            unit="Hz"
            onChange={setFilterFreq}
            min={400}
            max={22000}
          />
          <Slider
            label="Filter Q"
            value={filterQ}
            onChange={setFilterQ}
            min={0}
            max={50}
            step={0.01}
          />
          <Toggle
            label="Filter Type"
            value={filterType}
            options={filterTypeOptions}
            onChange={setFilterType}
          />
          <Toggle
            label="Oscillator Type"
            value={oscType}
            options={oscTypeOptions}
            onChange={setOscType}
          />
        </div>

        <div>
          <SongInput
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
          />
          <NoteGrid onClickNote={appendNote} />
        </div>

        <div>
          <Viz vizNode={au.vizNode} />
        </div>
      </Main>
    </div>
  );
}

export default App;
