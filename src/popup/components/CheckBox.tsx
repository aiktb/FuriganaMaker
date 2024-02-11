import { Switch } from '@headlessui/react';

import ToolTip from './ToolTip';

interface CheckBoxProps {
  checked: boolean;
  text: string;
  tip?: string;
  onChange: (checked: boolean) => void;
}

export default function CheckBox({ text, checked, tip, onChange }: CheckBoxProps) {
  function InlineCheckBox() {
    return (
      <Switch
        checked={checked}
        onChange={onChange}
        className={`flex items-center gap-x-1.5 rounded px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:hover:bg-slate-700 dark:focus-visible:bg-slate-700`}
      >
        <span>{text}</span>
      </Switch>
    );
  }

  return tip ? (
    <ToolTip tip={tip}>
      <InlineCheckBox />
    </ToolTip>
  ) : (
    <InlineCheckBox />
  );
}
