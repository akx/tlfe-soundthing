import { mapRange } from "../utils";
import { midiToNoteName } from "../notes";
import React from "react";
import styled from "styled-components";

interface NoteGridProps {
  onClickNote: (note: string) => void;
}

const NoteGridContainer = styled.div({
  display: "grid",
  gridTemplateColumns: new Array(12).fill("1fr").join(" "),
  gap: "3px",
});

const NoteGridButton = styled.button({
  padding: ".5em",
});

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
    <NoteGridContainer>
      {mapRange(MIN_OCT * 12, MAX_OCT * 12, (note) => (
        <NoteGridButton key={note} data-note={note} onClick={handleClick}>
          {midiToNoteName(note)}
        </NoteGridButton>
      ))}
    </NoteGridContainer>
  );
}
