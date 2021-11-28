import styled from "styled-components";
import React from "react";

export const ControlBody = styled.label`
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
`;
export const ControlLabelText = styled.span`
  padding-right: 1em;
  white-space: nowrap;
`;
export const ControlValueText = styled.span`
  padding-left: 1em;
  white-space: nowrap;
  width: 5em;
  text-align: right;
`;
export const ControlInput = styled.input`
  flex: 1;
`;
export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
