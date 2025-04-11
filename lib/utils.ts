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

// API Base URL configuration
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || " https://583b-105-119-1-95.ngrok-free.app";

// Logout function to remove user data from localStorage
export function logout() {
  if (isBrowser) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
  }
}