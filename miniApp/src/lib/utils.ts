import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Event handler to stop event propagation
export function stopPropagation(e: any) {
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
}
