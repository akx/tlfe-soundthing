import React from "react";
import notes from "./notes";
import { useInterval } from "react-use";

interface Asdf {
  audioContext: AudioContext;
  filterNode: BiquadFilterNode;
  oscNode: OscillatorNode;
}

function init(): Asdf {
  const audioContext = new AudioContext();

  const oscNode = audioContext.createOscillator();
  oscNode.type = "sine";
  //
  const filterNode = audioContext.createBiquadFilter();
  filterNode.frequency.value = 800;
  filterNode.type = "lowpass";

  oscNode.connect(filterNode);
  filterNode.connect(audioContext.destination);
  return { audioContext, oscNode, filterNode };
}

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
    return notes[note] || 432;
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
      <input
        type="range"
        min={20}
        max={300}
        value={tempo}
        onChange={(e) => setTempo(e.target.valueAsNumber)}
      />
      {tempo}
      <hr />

      <input
        type="range"
        min={400}
        max={22000}
        value={filterFreq}
        onChange={(e) => setFilterFreq(e.target.valueAsNumber)}
      />

      <hr />

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {Object.keys(notes).map((note) => (
          <button onClick={() => appendNote(note)}>{note}</button>
        ))}
      </div>
    </div>
  );
}

export default App;
