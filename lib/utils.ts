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

/**
 * Gets the stored redirect URL from localStorage and clears it
 * @returns The redirect URL or "/dashboard" as default
 */
export function getAndClearRedirectUrl(): string {
  if (typeof window === 'undefined') return '/dashboard';
  
  const redirectUrl = localStorage.getItem("redirectUrl") || "/dashboard";
  localStorage.removeItem("redirectUrl");
  return redirectUrl;
}

/**
 * Checks if a user is currently signed in
 * @returns boolean indicating if a user is signed in
 */
export function isUserSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  
  const accessToken = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");
  
  return !!(accessToken && user);
}

type SessionData = {
  email: string;
  password: string;
  companyName: string;
  companyId: number;
};

// utils.ts
export const secureStorage = {
  setSession: (data: SessionData) => {
    sessionStorage.setItem('company_session', JSON.stringify(data));
  },
  encryptSet: (key: string, value: string) => {
    const encrypted = btoa(unescape(encodeURIComponent(value)));
    localStorage.setItem(key, encrypted);
  },
  decryptGet: (key: string) => {
    const value = localStorage.getItem(key);
    return value ? decodeURIComponent(escape(atob(value))) : null;
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};