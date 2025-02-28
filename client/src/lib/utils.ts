import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function isValidVideoUrl(url: string): boolean {
  try {
    new URL(url);
    // Basic check for common video file extensions
    return /\.(mp4|webm|ogg)$/i.test(url);
  } catch {
    return false;
  }
}
