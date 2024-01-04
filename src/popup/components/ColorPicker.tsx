interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex grow items-center justify-between rounded px-2">
      <input
        type="color"
        value={color}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}
