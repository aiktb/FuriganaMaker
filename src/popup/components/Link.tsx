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
      className="flex grow items-center gap-x-1 rounded px-2 capitalize transition duration-300 hover:text-primary focus-visible:text-primary"
    >
      {text}
      <Icon aria-hidden="true" icon="ci:link" />
    </a>
  );
}
