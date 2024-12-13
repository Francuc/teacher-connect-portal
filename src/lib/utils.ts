import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string): string {
  if (!price || isNaN(parseFloat(price))) return '0€';
  return `${parseFloat(price)}€`;
}

export function formatDate(date: string): string {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy');
}