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

interface EventsFilterProps {
  locale: string;
}

export default function EventsFilter({ locale }: EventsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minParticipants: searchParams.get("minParticipants") || "",
    maxParticipants: searchParams.get("maxParticipants") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    minDuration: searchParams.get("minDuration") || "",
    maxDuration: searchParams.get("maxDuration") || "",
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

    router.push(`/${locale}/events?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      minParticipants: "",
      maxParticipants: "",
      startDate: "",
      endDate: "",
      minDuration: "",
      maxDuration: "",
    });
    router.push(`/${locale}/events`);
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
            <CardTitle>Filter Events</CardTitle>
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

          {/* Second Row: Search, Category, and Action Buttons */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
            {/* Search */}
            <div className="w-full lg:flex-1 space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="w-full lg:w-auto lg:min-w-[200px] space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="yacht-charter">Yacht Charter</SelectItem>
                  <SelectItem value="wine-tasting">Wine Tasting</SelectItem>
                  <SelectItem value="olive-oil-tasting">
                    Olive Oil Tasting
                  </SelectItem>
                  <SelectItem value="cultural-tour">Cultural Tour</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="culinary">Culinary</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
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
                <Label>Price Range</Label>
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

              {/* Participants Range */}
              <div className="space-y-2">
                <Label>Participants</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minParticipants"
                    type="number"
                    placeholder="Min"
                    value={filters.minParticipants}
                    onChange={(e) =>
                      handleFilterChange("minParticipants", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="Max"
                    value={filters.maxParticipants}
                    onChange={(e) =>
                      handleFilterChange("maxParticipants", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Duration Range */}
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="minDuration"
                    type="number"
                    placeholder="Min"
                    value={filters.minDuration}
                    onChange={(e) =>
                      handleFilterChange("minDuration", e.target.value)
                    }
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    id="maxDuration"
                    type="number"
                    placeholder="Max"
                    value={filters.maxDuration}
                    onChange={(e) =>
                      handleFilterChange("maxDuration", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
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
