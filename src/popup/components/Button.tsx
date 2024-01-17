interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      className="flex grow items-center justify-start gap-x-1 rounded px-2 capitalize"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
