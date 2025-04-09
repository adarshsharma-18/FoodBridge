"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Filter, MapPin, Clock, Package, X } from 'lucide-react'

// Changed to default export
export default function DonationFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [distance, setDistance] = useState<number[]>([10])
  const [foodType, setFoodType] = useState<string>("all")
  const [expiryTime, setExpiryTime] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleApplyFilters = () => {
    const newFilters = []
    
    if (distance[0] !== 10) {
      newFilters.push(`Within ${distance[0]} km`)
    }
    
    if (foodType !== "all") {
      newFilters.push(foodType)
    }
    
    if (expiryTime !== "all") {
      newFilters.push(expiryTime)
    }
    
    if (searchQuery) {
      newFilters.push(`"${searchQuery}"`)
    }
    
    setActiveFilters(newFilters)
    setIsFilterOpen(false)
  }

  const handleClearFilters = () => {
    setDistance([10])
    setFoodType("all")
    setExpiryTime("all")
    setSearchQuery("")
    setActiveFilters([])
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter))
    
    // Reset the corresponding filter
    if (filter.includes("Within")) {
      setDistance([10])
    } else if (["Cooked", "Bakery", "Raw", "Packaged", "Dairy"].includes(filter)) {
      setFoodType("all")
    } else if (["Expires soon", "Expires today", "Expires in 3 days", "Long shelf life"].includes(filter)) {
      setExpiryTime("all")
    } else if (filter.startsWith('"') && filter.endsWith('"')) {
      setSearchQuery("")
    }
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:w-64 md:w-80">
          <Input
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <Badge className="ml-1 bg-green-500 text-white">{activeFilters.length}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Donations</SheetTitle>
              <SheetDescription>
                Narrow down available donations based on your preferences
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Distance</Label>
                  <span className="text-sm text-gray-500">Within {distance[0]} km</span>
                </div>
                <Slider
                  value={distance}
                  onValueChange={setDistance}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span>10 km</span>
                  <span>20 km</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Food Type</Label>
                <Select value={foodType} onValueChange={setFoodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All food types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All food types</SelectItem>
                    <SelectItem value="Cooked">Cooked meals</SelectItem>
                    <SelectItem value="Bakery">Bakery items</SelectItem>
                    <SelectItem value="Raw">Fresh produce</SelectItem>
                    <SelectItem value="Packaged">Packaged/canned goods</SelectItem>
                    <SelectItem value="Dairy">Dairy products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Expiry Time</Label>
                <Select value={expiryTime} onValueChange={setExpiryTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any expiry time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any expiry time</SelectItem>
                    <SelectItem value="Expires soon">Expires within 6 hours</SelectItem>
                    <SelectItem value="Expires today">Expires today</SelectItem>
                    <SelectItem value="Expires in 3 days">Expires within 3 days</SelectItem>
                    {/* Fixed the ">" character by using JSX escape syntax */}
                    <SelectItem value="Long shelf life">Long shelf life ({'>'}3 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="additional-filters">
                  <AccordionTrigger>Additional Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Storage Condition</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Any storage condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any storage condition</SelectItem>
                            <SelectItem value="refrigerated">Refrigerated</SelectItem>
                            <SelectItem value="frozen">Frozen</SelectItem>
                            <SelectItem value="room-temp">Room temperature</SelectItem>
                            <SelectItem value="hot">Hot/Warm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Dietary Preferences</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Any dietary preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any dietary preference</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="gluten-free">Gluten-free</SelectItem>
                            <SelectItem value="dairy-free">Dairy-free</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Minimum Quantity</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Any quantity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any quantity</SelectItem>
                            <SelectItem value="1kg">At least 1 kg</SelectItem>
                            <SelectItem value="5kg">At least 5 kg</SelectItem>
                            <SelectItem value="10kg">At least 10 kg</SelectItem>
                            <SelectItem value="20kg">At least 20 kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <SheetFooter className="flex-col sm:flex-row gap-3 sm:justify-between">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                Clear All
              </Button>
              <SheetClose asChild>
                <Button 
                  onClick={handleApplyFilters}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600"
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter) => (
            <Badge 
              key={filter} 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800"
            >
              {filter.startsWith('"') ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>{filter.replace(/"/g, '')}</span>
                </>
              ) : filter.includes("Within") ? (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>{filter}</span>
                </>
              ) : ["Expires soon", "Expires today", "Expires in 3 days", "Long shelf life"].includes(filter) ? (
                <>
                  <Clock className="h-3 w-3" />
                  <span>{filter}</span>
                </>
              ) : (
                <>
                  <Package className="h-3 w-3" />
                  <span>{filter}</span>
                </>
              )}
              <button 
                onClick={() => removeFilter(filter)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

