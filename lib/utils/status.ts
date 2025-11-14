import type { PrinterSummary, Printer } from "@/lib/types"

/**
 * Calculates accurate printer status based on driver availability and functionality
 * Status priority:
 * - If no drivers: unsupported
 * - Otherwise use the provided status with appropriate mappings
 */
export function calculateAccurateStatus(printer: PrinterSummary | Printer): string {
  let driverCount = 0
  if ('driverCount' in printer) {
    driverCount = printer.driverCount ?? 0
  } else if ('drivers' in printer) {
    driverCount = printer.drivers?.length ?? 0
  }
  
  const currentStatus = printer.status?.toLowerCase() || 'unknown'

  if (driverCount === 0) {
    return 'unsupported'
  }

  // Map 'perfect' to 'recommended' for better UX (as per the styling)
  if (currentStatus === 'perfect') {
    return 'recommended'
  }

  // Map 'good' to 'basic' for consistency
  if (currentStatus === 'good') {
    return 'basic'
  }

  // Return the status as-is if it's valid
  const validStatuses = ['recommended', 'basic', 'partial', 'unsupported', 'deprecated', 'unknown']
  if (validStatuses.includes(currentStatus)) {
    return currentStatus
  }

  // Default to 'unknown' if status is invalid
  return 'unknown'
}

