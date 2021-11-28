import React from "react";
import {
  ControlBody,
  ControlInput,
  ControlLabelText,
  ControlValueText,
  InputProps,
} from "./ControlParts";

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
    <ControlBody>
      <ControlLabelText>{label}</ControlLabelText>
      <ControlInput
        {...rest}
        type="range"
        onChange={onInputChange}
        value={value}
      />
      <ControlValueText>
        {value}
        {unit ? ` ${unit}` : null}
      </ControlValueText>
    </ControlBody>
  );
}

export default Slider;
