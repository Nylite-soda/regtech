import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function save(name:string, item:any){
  localStorage.setItem(name, JSON.stringify(item))
}

export function getItem(name:string){
  return JSON.parse(localStorage.getItem(name)!)
}