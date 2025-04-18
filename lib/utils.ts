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
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Logout function to remove user data from localStorage
export function logout() {
  if (isBrowser) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
  }
}

// Store the current URL before redirecting to login
export function storeRedirectUrl() {
  if (isBrowser) {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('redirectUrl', currentPath);
  }
}

// Get and clear the stored redirect URL
export function getAndClearRedirectUrl() {
  if (isBrowser) {
    const url = localStorage.getItem('redirectUrl');
    localStorage.removeItem('redirectUrl');
    return url || '/'; // Return home if no redirect URL is stored
  }
  return '/';
}