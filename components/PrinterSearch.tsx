"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Search, Filter } from "lucide-react"

interface PrinterSearchProps {
  manufacturers: string[]
  onSearch: (query: string) => void
  onManufacturerFilter: (manufacturer: string) => void
  onTypeFilter: (type: string) => void
  onStatusFilter: (status: string) => void
  onDriverFilter: (driverFilter: string) => void
}

export default function PrinterSearch({ 
  manufacturers, 
  onSearch, 
  onManufacturerFilter,
  onTypeFilter,
  onStatusFilter,
  onDriverFilter
}: PrinterSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    onSearch(debouncedSearchQuery)
  }, [debouncedSearchQuery, onSearch])

  return (
    <Card className="mb-8 bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground">Search and Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by model or manufacturer..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
          
          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Manufacturer Filter */}
            <div className="relative">
              <Select onValueChange={onManufacturerFilter} defaultValue="all">
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Manufacturer" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gradient-card border-border max-h-[300px]">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/50">
                    All Manufacturers
                  </SelectItem>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer} className="text-foreground hover:bg-muted/50">
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Select onValueChange={onTypeFilter} defaultValue="all">
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Printer Type" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-card border-border">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/50">
                    All Types
                  </SelectItem>
                  <SelectItem value="laser" className="text-foreground hover:bg-muted/50">
                    Laser
                  </SelectItem>
                  <SelectItem value="inkjet" className="text-foreground hover:bg-muted/50">
                    Inkjet
                  </SelectItem>
                  <SelectItem value="dot-matrix" className="text-foreground hover:bg-muted/50">
                    Dot Matrix
                  </SelectItem>
                  <SelectItem value="unknown" className="text-foreground hover:bg-muted/50">
                    Unknown
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Select onValueChange={onStatusFilter} defaultValue="all">
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-card border-border">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/50">
                    All Status
                  </SelectItem>
                  <SelectItem value="recommended" className="text-foreground hover:bg-muted/50">
                    Recommended
                  </SelectItem>
                  <SelectItem value="basic" className="text-foreground hover:bg-muted/50">
                    Basic
                  </SelectItem>
                  <SelectItem value="partial" className="text-foreground hover:bg-muted/50">
                    Partial
                  </SelectItem>
                  <SelectItem value="unsupported" className="text-foreground hover:bg-muted/50">
                    Unsupported
                  </SelectItem>
                  <SelectItem value="deprecated" className="text-foreground hover:bg-muted/50">
                    Deprecated
                  </SelectItem>
                  <SelectItem value="unknown" className="text-foreground hover:bg-muted/50">
                    Unknown
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Driver Availability Filter */}
            <div className="relative">
              <Select onValueChange={onDriverFilter} defaultValue="all">
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Driver Support" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-card border-border">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/50">
                    All Printers
                  </SelectItem>
                  <SelectItem value="has_drivers" className="text-foreground hover:bg-muted/50">
                    Has Drivers
                  </SelectItem>
                  <SelectItem value="no_drivers" className="text-foreground hover:bg-muted/50">
                    No Drivers
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
