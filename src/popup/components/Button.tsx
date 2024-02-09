interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      className="flex grow items-center justify-start gap-x-1 rounded px-2 capitalize transition-all hover:bg-gray-200 focus-visible:bg-gray-200 dark:hover:bg-slate-700 dark:focus-visible:bg-slate-700"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
