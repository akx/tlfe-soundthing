import React from "react";
import { useInterval } from "react-use";
import { Viz } from "./components/Viz";
import Slider from "./components/Slider";
import NoteGrid from "./components/NoteGrid";
import styled from "styled-components";
import Toggle from "./components/Toggle";
import {
  AudioBits,
  createAudioBits,
  filterTypeOptions,
  oscTypeOptions,
  useAuSequence,
} from "./audioBits";

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

function App() {
  const [au] = React.useState(() => createAudioBits());
  const [song, setSong] = React.useState("44 66 89 30");
  const [tempo, setTempo] = React.useState(120);
  const [filterFreq, setFilterFreq] = React.useState(800);
  const [filterQ, setFilterQ] = React.useState(1);
  const [filterType, setFilterType] =
    React.useState<BiquadFilterType>("lowpass");
  const [oscType, setOscType] = React.useState<OscillatorType>("square");
  const [noteIndex, setNoteIndex] = React.useState(0);
  const auRef = React.useRef<AudioBits>(au);
  auRef.current = au;
  const tick = React.useCallback(() => {
    setNoteIndex((ni) => ni + 1);
  }, []);
  useInterval(tick, 60000 / (tempo * 4));
  useAuSequence(auRef, song, noteIndex);
  React.useEffect(() => {
    const au = auRef.current;
    au.oscNode.type = oscType;
    au.filterNode.frequency.value = filterFreq;
    au.filterNode.Q.value = filterQ;
    au.filterNode.type = filterType;
  }, [filterFreq, filterQ, filterType, oscType]);
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
