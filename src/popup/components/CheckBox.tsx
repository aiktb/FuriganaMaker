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
      className="flex grow items-center justify-between rounded px-2 capitalize"
    >
      {text}
    </Switch>
  );
}
