import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string): string {
  if (!price || isNaN(parseFloat(price))) return '0€';
  return `${parseFloat(price)}€`;
}