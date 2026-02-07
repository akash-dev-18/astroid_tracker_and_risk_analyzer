import { useState } from "react";
import { Calendar as CalendarIcon, Filter, X, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import type { AsteroidFeedParams } from "@/types/api";

interface FilterPanelProps {
  onFilterChange: (filters: Partial<AsteroidFeedParams>) => void;
  currentFilters: Partial<AsteroidFeedParams>;
}

export function FilterPanel({ onFilterChange, currentFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [diameterRange, setDiameterRange] = useState<[number, number]>([0, 5]);
  const [minVelocity, setMinVelocity] = useState("");
  const [maxVelocity, setMaxVelocity] = useState("");
  const [minDistance, setMinDistance] = useState("");
  const [maxDistance, setMaxDistance] = useState("");

  const applyFilters = () => {
    const filters: Partial<AsteroidFeedParams> = {
      ...currentFilters,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      min_diameter: diameterRange[0] > 0 ? diameterRange[0] : undefined,
      max_diameter: diameterRange[1] < 5 ? diameterRange[1] : undefined,
    };
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDiameterRange([0, 5]);
    setMinVelocity("");
    setMaxVelocity("");
    setMinDistance("");
    setMaxDistance("");
    onFilterChange({
      limit: currentFilters.limit,
      offset: 0,
      sort_by: "approach_date",
    });
  };

  const activeFilterCount = [
    startDate,
    endDate,
    diameterRange[0] > 0,
    diameterRange[1] < 5,
    currentFilters.is_hazardous,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Filter Toggle Button */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="cosmic" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Sort Dropdown */}
        <Select
          value={currentFilters.sort_by || "approach_date"}
          onValueChange={(value) =>
            onFilterChange({ ...currentFilters, sort_by: value, offset: 0 })
          }
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approach_date">Approach Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="velocity">Velocity</SelectItem>
            <SelectItem value="miss_distance">Miss Distance</SelectItem>
          </SelectContent>
        </Select>

        {/* Results Per Page */}
        <Select
          value={String(currentFilters.limit || 20)}
          onValueChange={(value) =>
            onFilterChange({ ...currentFilters, limit: Number(value), offset: 0 })
          }
        >
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Show" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expandable Filter Panel */}
      {isOpen && (
        <div className="glass-panel rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Filter Options</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Diameter Range Slider */}
          <div className="space-y-2">
            <Label>
              Diameter Range: {diameterRange[0].toFixed(2)} - {diameterRange[1].toFixed(2)} km
            </Label>
            <Slider
              min={0}
              max={5}
              step={0.01}
              value={diameterRange}
              onValueChange={(value) => setDiameterRange(value as [number, number])}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="cosmic" onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active:</span>
          {startDate && (
            <Badge variant="secondary" className="gap-1">
              📅 {format(startDate, "MMM d")}
              {endDate && ` - ${format(endDate, "MMM d")}`}
            </Badge>
          )}
          {(diameterRange[0] > 0 || diameterRange[1] < 5) && (
            <Badge variant="secondary" className="gap-1">
              💎 {diameterRange[0].toFixed(2)}-{diameterRange[1].toFixed(2)} km
            </Badge>
          )}
          {currentFilters.is_hazardous && (
            <Badge variant="destructive" className="gap-1">
              ⚠️ Hazardous Only
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
