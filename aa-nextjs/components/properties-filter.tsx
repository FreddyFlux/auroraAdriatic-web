"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

interface PropertiesFilterProps {
  locale: string;
}

export default function PropertiesFilter({ locale }: PropertiesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    propertyType: searchParams.get("propertyType") || "all",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minBedrooms: searchParams.get("minBedrooms") || "",
    maxBedrooms: searchParams.get("maxBedrooms") || "",
    minBathrooms: searchParams.get("minBathrooms") || "",
    maxBathrooms: searchParams.get("maxBathrooms") || "",
    minGuests: searchParams.get("minGuests") || "",
    maxGuests: searchParams.get("maxGuests") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      }
    });

    router.push(`/${locale}/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      propertyType: "all",
      location: "",
      minPrice: "",
      maxPrice: "",
      minBedrooms: "",
      maxBedrooms: "",
      minBathrooms: "",
      maxBathrooms: "",
      minGuests: "",
      maxGuests: "",
      minArea: "",
      maxArea: "",
    });
    router.push(`/${locale}/properties`);
  };

  // Action Buttons Component with Motion layout animation
  const ActionButtons = () => (
    <motion.div
      layout
      layoutId="action-buttons"
      className="flex gap-2 w-full lg:w-auto"
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
      }}
    >
      <Button onClick={applyFilters} className="flex-1 lg:flex-none">
        Apply Filters
      </Button>
      <Button
        onClick={clearFilters}
        variant="outline"
        className="flex-1 lg:flex-none"
      >
        Clear Filters
      </Button>
    </motion.div>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8">
      <Card>
        <CardHeader className="space-y-4">
          {/* First Row: Title and Toggle Button */}
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Filter Properties</CardTitle>
            <CollapsibleTrigger asChild>
              <div className="flex flex-row items-center gap-2">
                <span className="text-foreground font-semibold hover:cursor-pointer hover:text-primary transition-all duration-300">
                  More Filters
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle filters</span>
                </Button>
              </div>
            </CollapsibleTrigger>
          </div>

          {/* Second Row: Search, Property Type, and Action Buttons */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
            {/* Search */}
            <div className="w-full lg:flex-1 space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search properties..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Property Type */}
            <div className="w-full lg:w-auto lg:min-w-[200px] space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) =>
                  handleFilterChange("propertyType", value)
                }
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons - Show when collapsed */}
            {!isOpen && <ActionButtons />}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range (€/night)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Bedrooms Range */}
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minBedrooms"
                    type="number"
                    placeholder="Min"
                    value={filters.minBedrooms}
                    onChange={(e) =>
                      handleFilterChange("minBedrooms", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxBedrooms"
                    type="number"
                    placeholder="Max"
                    value={filters.maxBedrooms}
                    onChange={(e) =>
                      handleFilterChange("maxBedrooms", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Bathrooms Range */}
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minBathrooms"
                    type="number"
                    placeholder="Min"
                    value={filters.minBathrooms}
                    onChange={(e) =>
                      handleFilterChange("minBathrooms", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxBathrooms"
                    type="number"
                    placeholder="Max"
                    value={filters.maxBathrooms}
                    onChange={(e) =>
                      handleFilterChange("maxBathrooms", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Guests Range */}
              <div className="space-y-2">
                <Label>Guests</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minGuests"
                    type="number"
                    placeholder="Min"
                    value={filters.minGuests}
                    onChange={(e) =>
                      handleFilterChange("minGuests", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxGuests"
                    type="number"
                    placeholder="Max"
                    value={filters.maxGuests}
                    onChange={(e) =>
                      handleFilterChange("maxGuests", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Area Range */}
              <div className="space-y-2">
                <Label>Area (m²)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minArea"
                    type="number"
                    placeholder="Min"
                    value={filters.minArea}
                    onChange={(e) =>
                      handleFilterChange("minArea", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxArea"
                    type="number"
                    placeholder="Max"
                    value={filters.maxArea}
                    onChange={(e) =>
                      handleFilterChange("maxArea", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  id="location"
                  placeholder="City, country..."
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Action Buttons - Show when expanded */}
            {isOpen && (
              <div className="flex justify-end mt-6">
                <ActionButtons />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
