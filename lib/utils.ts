import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PrinterSummary, Printer, PrinterStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAccurateStatus(
  printer: PrinterSummary | Printer
): PrinterStatus {
  const functionality =
    printer.functionality ||
    (printer as Printer).status?.toLowerCase()

  // ---- FIXED PART ----
  const driverCount =
    "driverCount" in printer
      ? printer.driverCount
      : "drivers" in printer
      ? printer.drivers?.length ?? 0
      : 0
  // --------------------

  if (!functionality || functionality === "?" || functionality === "unknown") {
    if (driverCount === 0) {
      return "Unsupported"
    }
    return "Unknown"
  }

  const func =
    typeof functionality === "string"
      ? functionality.toUpperCase()
      : functionality

  switch (func) {
    case "A":
    case "PERFECT":
      return "Perfect"

    case "B":
    case "GOOD":
    case "C":
    case "PARTIAL":
      return "Partial"

    case "UNSUPPORTED":
      return "Unsupported"

    default:
      if (driverCount === 0) {
        return "Unsupported"
      }
      return "Unknown"
  }
}
