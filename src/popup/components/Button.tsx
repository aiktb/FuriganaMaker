interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      className="hover:text-azure-700 focus:text-azure-700 flex grow items-center justify-start gap-x-1 rounded px-2"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
