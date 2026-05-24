import { cn } from "@/commons/utils";
import { ToolTip } from "./ToolTip";

interface ButtonProps {
  text: string;
  tip?: string | undefined;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function Button({ text, tip, onClick, className, disabled = false }: ButtonProps) {
  function InlineButton() {
    return (
      <button
        disabled={disabled}
        className={cn(
          "flex grow cursor-pointer items-center justify-start gap-x-1 rounded-sm px-2 py-0.5 capitalize transition-all",
          disabled
            ? "cursor-not-allowed opacity-60"
            : "hover:bg-gray-200 focus-visible:bg-gray-200 dark:focus-visible:bg-slate-700 dark:hover:bg-slate-700",
          className,
        )}
        onClick={onClick}
      >
        {text}
      </button>
    );
  }
  return tip ? (
    <ToolTip tip={tip}>
      <InlineButton />
    </ToolTip>
  ) : (
    <InlineButton />
  );
}
