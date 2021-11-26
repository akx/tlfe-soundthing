import React from "react";
import { getArrMax } from "../utils";
import { useInterval } from "react-use";

export function Viz({ vizNode }: { vizNode: AnalyserNode }) {
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
