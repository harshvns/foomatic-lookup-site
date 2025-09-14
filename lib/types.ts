export interface Driver {
  id: string
  name: string
  url?: string
  comments?: string
  execution?: {
    ghostscript?: string | null
    filter?: string | null
    prototype: string
  }
}

export interface Printer {
  id: string
  manufacturer: string
  model: string
  series?: string
  connectivity?: string[]
  recommended_driver?: string
  drivers?: Driver[]
  type?: string
  status?: string
  notes?: string
}

// Lightweight version for the index map
export interface PrinterSummary {
  id: string
  manufacturer: string
  model: string
  type?: string
  status?: string
  driverCount?: number
}
