import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, letting later Tailwind classes win over earlier ones. */
export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
