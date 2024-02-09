import { Icon } from '@iconify/react';

interface LinkProps {
  href: string;
  text: string;
}

export default function Link({ href, text }: LinkProps) {
  return (
    <a
      target="_blank"
      href={href}
      rel="noopener noreferrer"
      className="flex flex-1 items-center gap-x-1 rounded px-2 capitalize transition duration-300 hover:bg-gray-200 hover:text-primary focus-visible:bg-gray-200 focus-visible:text-primary dark:hover:bg-slate-700 dark:focus-visible:bg-slate-700"
    >
      {text}
      <Icon aria-hidden="true" icon="ci:link" />
    </a>
  );
}
