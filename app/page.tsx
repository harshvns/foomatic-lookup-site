"use client"

import { useEffect, useState } from "react"
import type { Printer } from "@/lib/types"
import PrinterSearch from "@/components/PrinterSearch"
import Printers from "@/components/Printers"
import { Skeleton } from "@/components/ui/skeleton"
import { PrinterIcon, Database, Zap, Shield } from "lucide-react"

export default function HomePage() {
  const [printers, setPrinters] = useState<Printer[]>([])
  const [filteredPrinters, setFilteredPrinters] = useState<Printer[]>([])
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      // Use process.env.NODE_ENV to determine the correct base path
      const basePath = process.env.NODE_ENV === 'production' ? '/foomatic-lookup-site' : ''
      const res = await fetch(`${basePath}/foomatic-db/printers.json`)
      const data = await res.json()
      setPrinters(data.printers)
      setFilteredPrinters(data.printers)

      const uniqueManufacturers = [...new Set(data.printers.map((p: Printer) => p.manufacturer))].sort()
      setManufacturers(uniqueManufacturers as string[])
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    let result = printers

    if (selectedManufacturer !== "all") {
      result = result.filter((p) => p.manufacturer === selectedManufacturer)
    }

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (searchQuery === "" && selectedManufacturer === "all") {
      setFilteredPrinters(result.slice(0, 20))
    } else {
      setFilteredPrinters(result)
    }
  }, [searchQuery, selectedManufacturer, printers])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-20 mb-16 animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-card border border-border/50 shadow-card backdrop-blur-sm mb-8">
              <PrinterIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground tracking-wide">OpenPrinting Project</span>
            </div>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Foomatic
            </span>
            <br />
            <span className="text-4xl lg:text-5xl text-muted-foreground font-light tracking-wide">
              Printer Database
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12 font-light">
            Discover and explore printers from the comprehensive Foomatic database maintained by the OpenPrinting
            community. Find drivers, specifications, and compatibility information for seamless Linux printing.
          </p>
          
          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-card border border-border/30 shadow-card backdrop-blur-sm">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">Open Source Drivers</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-card border border-border/30 shadow-card backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">Linux Compatible</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-card border border-border/30 shadow-card backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">Community Maintained</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <PrinterSearch 
            manufacturers={manufacturers} 
            onSearch={setSearchQuery} 
            onFilter={setSelectedManufacturer} 
          />
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="bg-gradient-card border border-border/50 rounded-2xl p-6 shadow-card backdrop-blur-sm"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-12 w-12 rounded-xl bg-muted/50" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-5 w-3/4 bg-muted/50" />
                    <Skeleton className="h-4 w-1/2 bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-md bg-muted/50" />
                    <Skeleton className="h-6 w-24 rounded-md bg-muted/50" />
                  </div>
                  <Skeleton className="h-4 w-full bg-muted/50" />
                  <Skeleton className="h-4 w-2/3 bg-muted/50" />
                  <div className="flex gap-3 pt-2">
                    <Skeleton className="h-10 flex-1 rounded-lg bg-muted/50" />
                    <Skeleton className="h-10 w-12 rounded-lg bg-muted/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPrinters.length > 0 ? (
          <div className="animate-fade-in">
            <Printers printers={filteredPrinters} />
          </div>
        ) : (
          <div className="text-center py-24 animate-fade-in">
            <div className="p-8 rounded-2xl bg-gradient-card border border-border/50 shadow-elegant backdrop-blur-sm w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <PrinterIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">No Printers Found</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              Try adjusting your search terms or filter criteria to find the printer you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}