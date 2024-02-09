import { Switch } from '@headlessui/react';

interface CheckBoxProps {
  checked: boolean;
  text: string;
  onChange: (checked: boolean) => void;
}

export default function CheckBox({ text, onChange, checked }: CheckBoxProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className="flex flex-1 items-center justify-between rounded px-2 capitalize transition-all hover:bg-gray-200  focus-visible:bg-gray-200 dark:hover:bg-slate-700 dark:focus-visible:bg-slate-700"
    >
      {text}
    </Switch>
  );
}
