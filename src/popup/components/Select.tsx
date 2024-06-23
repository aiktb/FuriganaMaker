import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";

import ToolTip from "./ToolTip";

interface SelectProps {
  selected: string;
  options: { label: string; value: string }[];
  tip?: string;
  onChange: (selected: string) => void;
}

export default function Select({ selected, options, tip, onChange }: SelectProps) {
  function ListBoxButton() {
    return (
      <ListboxButton className="group peer flex w-full items-center justify-between rounded px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 ui-open:bg-gray-200 dark:hover:bg-slate-700 dark:focus-visible:bg-slate-700 dark:ui-open:bg-slate-700">
        {options.find((option) => option.value === selected)?.label}
        <span
          className="hidden group-hover:flex group-focus-visible:flex ui-open:flex -rotate-90 i-[material-symbols--arrow-back-ios-new-rounded]"
          aria-hidden="true"
        />
      </ListboxButton>
    );
  }

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-full">
        {tip ? (
          <ToolTip tip={tip}>
            <ListBoxButton />
          </ToolTip>
        ) : (
          <ListBoxButton />
        )}
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <ListboxOptions
            as="div"
            className="absolute left-0 z-40 mt-1 flex w-full flex-col rounded-md border-2 border-gray-300 bg-white py-1 shadow dark:border-slate-700 dark:bg-slate-900"
          >
            {options.map((item) => (
              <ListboxOption key={item.value} value={item.value}>
                {({ focus, selected }) => (
                  <li
                    className={`${focus ? "text-sky-500" : "text-current"}
                    ${selected ? "text-sky-500" : ""}
                    box-content flex cursor-pointer items-center justify-between px-[6px] capitalize transition-all hover:bg-gray-200 focus:z-10 focus:bg-gray-200 ui-active:bg-gray-200 dark:hover:bg-slate-700 dark:focus:bg-slate-700 dark:ui-active:bg-slate-700`}
                  >
                    {item.label}
                    {selected && <span className="ep-select" aria-hidden="true" />}
                  </li>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
