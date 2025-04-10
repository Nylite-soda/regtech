import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export function save(name:string, item:any){
  if (isBrowser) {
    localStorage.setItem(name, JSON.stringify(item))
  }
}

export function getItem(name:string){
  if (isBrowser) {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  }
  return null;
}