import React from "react";
import { getArrMax } from "../utils";
import { useInterval } from "react-use";

function drawSpectrum(ctx: CanvasRenderingContext2D, vizNode: AnalyserNode) {
  const { width, height } = ctx.canvas;
  const freqArr = new Uint8Array(256);
  vizNode.getByteFrequencyData(freqArr);
  ctx.beginPath();
  ctx.moveTo(0, height);
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
}

function drawWaveform(ctx: CanvasRenderingContext2D, vizNode: AnalyserNode) {
  const waveArr = new Float32Array(512);
  const { width, height } = ctx.canvas;
  const halfHeight = height / 2;
  vizNode.getFloatTimeDomainData(waveArr);
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
}

export function Viz({ vizNode }: { vizNode: AnalyserNode }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const update = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = +canvas.width;
    ctx.fillStyle = `hsl(${(+new Date() / 100) % 360}, 100%, 60%)`;
    drawSpectrum(ctx, vizNode);
    drawWaveform(ctx, vizNode);
  }, [vizNode]);
  useInterval(update, 30);
  return (
    <canvas
      width={800}
      height={300}
      style={{ width: "100%", border: "1px solid orange" }}
      ref={canvasRef}
    />
  );
}
