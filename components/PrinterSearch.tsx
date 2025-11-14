"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { Search, Filter, X, RotateCcw } from "lucide-react"

interface PrinterSearchProps {
  manufacturers: string[]
  onSearch: (query: string) => void
  searchQuery: string
  selectedManufacturer: string
  selectedType: string
  selectedStatus: string
  selectedDriverFilter: string
  itemsPerPage: number
  onManufacturerFilter: (manufacturer: string) => void
  onTypeFilter: (type: string) => void
  onStatusFilter: (status: string) => void
  onDriverFilter: (driverFilter: string) => void
  onItemsPerPageChange: (value: string) => void
  onResetFilters: () => void
}

export default function PrinterSearch({ 
  manufacturers, 
  onSearch,
  searchQuery: externalSearchQuery,
  selectedManufacturer,
  selectedType,
  selectedStatus,
  selectedDriverFilter,
  itemsPerPage,
  onManufacturerFilter,
  onTypeFilter,
  onStatusFilter,
  onDriverFilter,
  onItemsPerPageChange,
  onResetFilters
}: PrinterSearchProps) {
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Sync external search query
  useEffect(() => {
    setSearchQuery(externalSearchQuery)
  }, [externalSearchQuery])

  useEffect(() => {
    onSearch(debouncedSearchQuery)
  }, [debouncedSearchQuery, onSearch])

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== "" ||
    selectedManufacturer !== "all" ||
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    selectedDriverFilter !== "all"

  return (
    <Card className="mb-8 bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">Search and Filter</CardTitle>
          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
                <SelectTrigger className="w-[100px] sm:w-[120px] h-9 bg-muted/50 border-border/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border shadow-lg">
                  <SelectItem value="20" className="text-foreground hover:bg-muted/80 cursor-pointer">20</SelectItem>
                  <SelectItem value="50" className="text-foreground hover:bg-muted/80 cursor-pointer">50</SelectItem>
                  <SelectItem value="100" className="text-foreground hover:bg-muted/80 cursor-pointer">100</SelectItem>
                  <SelectItem value="200" className="text-foreground hover:bg-muted/80 cursor-pointer">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <Button
                onClick={onResetFilters}
                variant="outline"
                size="sm"
                className="h-9 gap-2 bg-muted/50 border-border/50 text-foreground hover:bg-muted/80"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search by model or manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Manufacturer Filter */}
            <div className="relative">
              <Select value={selectedManufacturer} onValueChange={onManufacturerFilter}>
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Manufacturer" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border shadow-lg max-h-[300px]">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    All Manufacturers
                  </SelectItem>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer} className="text-foreground hover:bg-muted/80 cursor-pointer">
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Select value={selectedType} onValueChange={onTypeFilter}>
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Printer Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border shadow-lg">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    All Types
                  </SelectItem>
                  <SelectItem value="laser" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Laser
                  </SelectItem>
                  <SelectItem value="inkjet" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Inkjet
                  </SelectItem>
                  <SelectItem value="dot-matrix" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Dot Matrix
                  </SelectItem>
                  <SelectItem value="unknown" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Unknown
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Select value={selectedStatus} onValueChange={onStatusFilter}>
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border shadow-lg">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    All Status
                  </SelectItem>
                  <SelectItem value="recommended" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Recommended
                  </SelectItem>
                  <SelectItem value="basic" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Basic
                  </SelectItem>
                  <SelectItem value="partial" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Partial
                  </SelectItem>
                  <SelectItem value="unsupported" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Unsupported
                  </SelectItem>
                  <SelectItem value="deprecated" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Deprecated
                  </SelectItem>
                  <SelectItem value="unknown" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Unknown
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Driver Availability Filter */}
            <div className="relative">
              <Select value={selectedDriverFilter} onValueChange={onDriverFilter}>
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue placeholder="Driver Support" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border shadow-lg">
                  <SelectItem value="all" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    All Printers
                  </SelectItem>
                  <SelectItem value="has_drivers" className="text-foreground hover:bg-muted/80 cursor-pointer">
                    Has Drivers
                  </SelectItem>
                  <SelectItem value="no_drivers" className="text-foreground hover:bg-muted/80 cursor-pointer">
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
