import React from "react";
import styled from "styled-components";

const SliderBody = styled.label`
  display: flex;
  justify-content: space-between;
  width: 30em;
  padding: 0.5em;
`;

const SliderLabelText = styled.span`
  padding-right: 1em;
  white-space: nowrap;
`;
const SliderValueText = styled.span`
  padding-left: 1em;
  white-space: nowrap;
  width: 5em;
  text-align: right;
`;
const SliderInput = styled.input`
  flex: 1;
`;
type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type SliderProps = Omit<InputProps, "onChange" | "ref"> & {
  label: string;
  unit?: string;
  onChange: (n: number) => void;
};

function Slider({ label, unit, onChange, value, ...rest }: SliderProps) {
  const onInputChange = React.useCallback(
    (e) => onChange(e.target.valueAsNumber),
    [onChange],
  );
  return (
    <SliderBody>
      <SliderLabelText>{label}</SliderLabelText>
      <SliderInput
        {...rest}
        type="range"
        onChange={onInputChange}
        value={value}
      />
      <SliderValueText>
        {value}
        {unit ? ` ${unit}` : null}
      </SliderValueText>
    </SliderBody>
  );
}

export default Slider;
