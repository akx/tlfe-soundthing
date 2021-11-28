import { mapRange } from "../utils";
import { midiToNoteName } from "../notes";
import React from "react";

interface NoteGridProps {
  onClickNote: (note: string) => void;
}

const MIN_OCT = 2;
const MAX_OCT = 11;

export default function NoteGrid({ onClickNote }: NoteGridProps) {
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickNote(String(event.currentTarget.dataset.note));
    },
    [onClickNote],
  );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: new Array(12).fill("1fr").join(" "),
      }}
    >
      {mapRange(MIN_OCT * 12, MAX_OCT * 12, (note) => (
        <button key={note} data-note={note} onClick={handleClick}>
          {midiToNoteName(note)}
        </button>
      ))}
    </div>
  );
}
