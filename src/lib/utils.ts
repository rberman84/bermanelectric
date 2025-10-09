import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAltText(src: string, context: string): string {
  const cleanedSource = src.split("?")[0]
  const fileName = cleanedSource.split("/").pop() ?? ""
  const baseName = fileName.split(".")[0] ?? ""

  const normalizedFromFile = baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\d+/g, " ")
    .trim()

  const hasLetters = /[a-zA-Z]/.test(normalizedFromFile)
  const fileDescription = hasLetters ? normalizedFromFile.toLowerCase() : ""

  if (!fileDescription) {
    return context
  }

  return `${context.trim()} – ${fileDescription}`.trim()
}
