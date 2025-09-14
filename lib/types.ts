export interface Printer {
  id: string
  manufacturer: string
  model: string
  drivers?: string[]
  description?: string
  url?: string
  functionality?: string
  color?: boolean
  resolution?: string
  ppdUrl?: string
}
