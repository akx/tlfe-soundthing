import React from "react";
import notes from "./notes";
import { useInterval } from "react-use";

interface Asdf {
  audioContext: AudioContext;
  filterNode: BiquadFilterNode;
  oscNode: OscillatorNode;
  vizNode: AnalyserNode;
}

function init(): Asdf {
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

function getArrMax(arr: Float32Array | Uint8Array) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    max = Math.max(Math.abs(arr[i]), max);
  }
  return max;
}

function Viz({ vizNode }: { vizNode: AnalyserNode }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const update = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const waveArr = new Float32Array(512);
    const freqArr = new Uint8Array(256);
    vizNode.getFloatTimeDomainData(waveArr);
    vizNode.getByteFrequencyData(freqArr);
    const ctx = canvas.getContext("2d")!;
    canvas.width = +canvas.width;
    const { width, height } = canvas;
    const halfHeight = height / 2;
    const waveMax = getArrMax(waveArr);
    ctx.beginPath();
    ctx.strokeStyle = "1px solid black";
    for (let i = 0; i < waveArr.length; i++) {
      const x = (i / waveArr.length) * width;
      const y = halfHeight + (waveArr[i] / waveMax) * halfHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.fillStyle = "orangered";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const freqMax = getArrMax(freqArr);
    for (let i = 0; i < freqArr.length; i++) {
      const x = (i / freqArr.length) * width;
      const y = (freqArr[i] / freqMax) * height;
      ctx.lineTo(x, height - y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }, [vizNode]);
  useInterval(update, 30);
  return (
    <canvas
      width={800}
      height={300}
      style={{ width: "40%", border: "1px solid orange" }}
      ref={canvasRef}
    />
  );
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
          <button key={note} onClick={() => appendNote(note)}>
            {note}
          </button>
        ))}
      </div>

      <hr />
      <Viz vizNode={audioContext.vizNode} />
    </div>
  );
}

export default App;
