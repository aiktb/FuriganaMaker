import React from 'react';

interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export default function RangeSlider({ value, min, max, step, onChange }: RangeSliderProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value);
    onChange(value);
  }
  return (
    <div className="relative flex h-5 grow items-center justify-start gap-x-1 rounded px-2 leading-5">
      <input
        className="absolute left-1/2 top-1/2 z-10 w-[90%] -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-0"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
      />
      <div className="flex h-[3px] w-full justify-center rounded-lg bg-current" aria-hidden="true">
        <div className="relative h-[3px] w-[90%] rounded-lg bg-current">
          <div
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-primary"
            style={{ left: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
