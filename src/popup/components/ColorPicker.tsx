import { Popover, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import React, { Fragment, useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover className="relative flex grow">
      <Popover.Button className="group flex grow items-center justify-between rounded px-2">
        Select color
        <div
          className="hidden size-3 rounded-full group-hover:block group-focus-visible:block"
          style={{ backgroundColor: color }}
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel focus className="fixed inset-0 z-50 bg-white dark:bg-slate-900">
          <ColorPickerPanel color={color} onChange={onChange}>
            <Popover.Button className="flex items-center justify-center gap-2 rounded border-none px-1.5 font-sans shadow-sm outline-none ring-1 ring-gray-300 transition-all hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary dark:ring-slate-700">
              Close Picker Panel
              <Icon
                className="size-4"
                aria-hidden="true"
                icon="line-md:circle-to-confirm-circle-transition"
              />
            </Popover.Button>
          </ColorPickerPanel>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

interface ColorPickerPanelProps {
  color: string;
  children: React.ReactNode;
  onChange: (color: string) => void;
}

function ColorPickerPanel({ color, children, onChange }: ColorPickerPanelProps) {
  const [input, setInput] = useState(tinycolor(color).toHexString());

  useEffect(() => {
    setInput(tinycolor(color).toHexString());
  }, [color]);

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  function handleSaturationCanvasPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const saturationCanvas = event.currentTarget;
    const { width, height, left, top } = saturationCanvas.getBoundingClientRect();
    onChange(
      tinycolor({
        h: tinycolor(color).toHsv().h,
        s: clamp((event.clientX - left) / width, 0, 1),
        v: clamp(1 - (event.clientY - top) / height, 0, 1),
      }).toHexString(),
    );
    saturationCanvas.setPointerCapture(event.pointerId);
    saturationCanvas.addEventListener('pointermove', handlePointerMove);
    saturationCanvas.addEventListener('pointerup', handlePointerUp);

    function handlePointerMove(event: PointerEvent) {
      onChange(
        tinycolor({
          h: tinycolor(color).toHsv().h,
          s: clamp((event.clientX - left) / width, 0, 1),
          v: clamp(1 - (event.clientY - top) / height, 0, 1),
        }).toHexString(),
      );
    }
    function handlePointerUp() {
      saturationCanvas.releasePointerCapture(event.pointerId);
      saturationCanvas.removeEventListener('pointermove', handlePointerMove);
      saturationCanvas.removeEventListener('pointerup', handlePointerUp);
    }
  }

  function handleHueCanvasPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const hueCanvas = event.currentTarget;
    const { width, left } = hueCanvas.getBoundingClientRect();
    onChange(
      tinycolor({
        h: clamp(((event.clientX - left) / width) * 360, 0, 359),
        s: tinycolor(color).toHsv().s,
        v: tinycolor(color).toHsv().v,
      }).toHexString(),
    );
    hueCanvas.setPointerCapture(event.pointerId);
    hueCanvas.addEventListener('pointermove', handlePointerMove);
    hueCanvas.addEventListener('pointerup', handlePointerUp);
    function handlePointerMove(event: PointerEvent) {
      onChange(
        tinycolor({
          h: clamp(((event.clientX - left) / width) * 360, 0, 359),
          s: tinycolor(color).toHsv().s,
          v: tinycolor(color).toHsv().v,
        }).toHexString(),
      );
    }
    function handlePointerUp() {
      hueCanvas.releasePointerCapture(event.pointerId);
      hueCanvas.removeEventListener('pointermove', handlePointerMove);
      hueCanvas.removeEventListener('pointerup', handlePointerUp);
    }
  }
  return (
    <div className="flex size-full flex-col justify-between px-2.5 py-3">
      <div className="relative aspect-[4/3] w-full cursor-crosshair rounded-sm">
        <div
          onPointerDown={handleSaturationCanvasPointerDown}
          className="absolute inset-0 rounded-sm shadow-inner"
          style={{
            background: `linear-gradient(to right, white, ${tinycolor({
              h: tinycolor(color).toHsv().h,
              s: 100,
              v: 100,
            }).toHexString()})`,
          }}
        >
          <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-transparent to-black" />
          {/* Saturation and value picker */}
          <div
            className="absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full "
            style={{
              boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 1.5px, rgba(0, 0, 0, 0.3) 0px 0px 1px 1px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 2px',
              left: `${tinycolor(color).toHsv().s * 100}%`,
              top: `${100 - tinycolor(color).toHsv().v * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="flex gap-1">
        <div
          onPointerDown={handleHueCanvasPointerDown}
          className="relative h-4 flex-1 cursor-crosshair rounded-sm"
          style={{
            background:
              'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)',
          }}
        >
          {/* Hue picker */}
          <div
            className="absolute top-1/2 h-3.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-white "
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.6) 0px 0px 2px',
              left: `${(tinycolor(color).toHsv().h / 360) * 100}%`,
            }}
          />
        </div>
        <div
          className="size-4 rounded-sm"
          style={{
            boxShadow:
              'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 0px 4px inset',
            backgroundColor: color,
          }}
        />
      </div>
      <div>
        <div className="flex items-center justify-between text-sm">
          <label>
            <span>HEX </span>
            <input
              className="h-6 w-[5rem] rounded border-none px-1.5 text-sm uppercase shadow-sm ring-1 ring-inset ring-gray-300 focus:border-none focus:ring-2 focus:ring-primary dark:bg-slate-950 dark:ring-slate-700"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && tinycolor(input).isValid()) {
                  onChange(input);
                }
              }}
            />
          </label>
          <button
            className="flex h-6 items-center justify-center gap-0.5 rounded border-none px-1.5 font-sans shadow-sm outline-none ring-1 ring-gray-300 transition-all hover:text-primary focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-950 dark:ring-slate-700"
            onClick={() => {
              onChange('currentColor');
            }}
          >
            Reset
            <Icon className="text-lg" aria-hidden="true" icon="material-symbols:refresh-rounded" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-around gap-2.5">
        {
          // prettier-ignore
          [
          '#d0021b', '#f5a623', '#f8e71c', '#8b572a', '#7ed321', '#417505', '#bd10e0', '#9013fe',
          '#4a90e2', '#08f3f2', '#b8e986', '#1273de', '#000000', '#4a4a4a', '#9b9b9b', '#ffffff',
        ].map((color) => {
          const baseShadow = 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset';
          const focusShadow = `${baseShadow} ,${color} 0px 0px 6px`;
          return (
            <button
              key={color}
              title={color}
              className="size-4 cursor-pointer rounded-sm outline-none"
              style={{
                boxShadow: baseShadow,
                backgroundColor: color,
              }}
              onFocus={(event) => {
                event.currentTarget.style.boxShadow = focusShadow;
              }}
              onBlur={(event) => {
                event.currentTarget.style.boxShadow = baseShadow;
              }}
              onClick={()=>{
                onChange(color);
              }}
            >
              <span className="sr-only">{color}</span>
            </button>
          );
        })
        }
      </div>
      {children}
    </div>
  );
}
