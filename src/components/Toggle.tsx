import React from "react";
import { ControlBody, ControlLabelText } from "./ControlParts";

type ToggleProps<T> = {
  label: string;
  value: T | undefined;
  options: [T, string][];
  onChange: (value: T) => void;
};

function Toggle<T>({
  label,
  options,
  onChange,
  value: selectedValue,
}: ToggleProps<T>) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) =>
      onChange(String(e.currentTarget.dataset.value)),
    [onChange],
  );
  return (
    <ControlBody>
      <ControlLabelText>{label}</ControlLabelText>
      <div style={{ display: "flex", flex: 1, gap: "1em" }}>
        {options.map(([value, text]) => (
          <button
            data-value={value}
            key={String(value)}
            onClick={handleClick}
            style={{
              flex: 1,
              fontWeight: selectedValue === value ? "bold" : undefined,
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </ControlBody>
  );
}

export default Toggle;
