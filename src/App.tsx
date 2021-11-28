import React, { useEffect } from "react";
import { midiToFreq, midiToNoteName } from "./notes";
import { useInterval } from "react-use";
import { mapRange } from "./utils";
import { Viz } from "./components/Viz";
import Slider from "./components/Slider";

interface AudioBits {
  audioContext: AudioContext;
  filterNode: BiquadFilterNode;
  oscNode: OscillatorNode;
  vizNode: AnalyserNode;
}

function init(): AudioBits {
  const audioContext = new AudioContext();

  const oscNode = audioContext.createOscillator();
  oscNode.type = "square";
  //
  const filterNode = audioContext.createBiquadFilter();
  filterNode.frequency.value = 800;
  filterNode.type = "lowpass";

  const vizNode = audioContext.createAnalyser();
  vizNode.fftSize = 512;
  vizNode.smoothingTimeConstant = 0.3;

  oscNode.connect(filterNode);
  filterNode.connect(audioContext.destination);
  filterNode.connect(vizNode);
  return { audioContext, oscNode, filterNode, vizNode };
}

const ROOT = 432;

function App() {
  const [audioContext] = React.useState(() => init());
  const [song, setSong] = React.useState("44 66 89 30");
  const [tempo, setTempo] = React.useState(120);
  const [filterFreq, setFilterFreq] = React.useState(800);
  const [noteIndex, setNoteIndex] = React.useState(0);
  useInterval(() => {
    setNoteIndex((ni) => ni + 1);
  }, 60000 / (tempo * 4));

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
    audioContext.oscNode.frequency.value = currentNoteFrequency;
    audioContext.filterNode.frequency.value = filterFreq;
  }, [
    audioContext.filterNode.frequency,
    audioContext.oscNode.frequency,
    currentNoteFrequency,
    filterFreq,
  ]);
  const appendNote = React.useCallback((note: string) => {
    setSong((currentSong) => (currentSong + " " + note).trim());
  }, []);
  return (
    <div className="App">
      <button
        onClick={() => {
          audioContext.audioContext.resume();
          audioContext.oscNode.start();
          console.log(audioContext.audioContext.state);
        }}
      >
        Go
      </button>
      <hr />
      <input
        type="text"
        value={song}
        onChange={(e) => setSong(e.target.value)}
      />
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

      <hr />

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {mapRange(20, 150, (note) => (
          <button key={note} onClick={() => appendNote(String(note))}>
            {midiToNoteName(note)}
          </button>
        ))}
      </div>

      <hr />
      <Viz vizNode={audioContext.vizNode} />
    </div>
  );
}

export default App;
