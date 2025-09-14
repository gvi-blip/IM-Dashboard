"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Filter, X, Clock, ChevronsUpDown, Check } from "lucide-react";

type TabType =
  | "im-alerts"
  | "im-hf-alerts"
  | "im-magic-alerts"
  | "stock-list-filter";

interface FilterControlsProps {
  activeTab: TabType;
  timeInterval: string[];
  onTimeIntervalChange: (value: string[]) => void;
  nifty50Enabled: boolean;
  onNifty50Change: (checked: boolean) => void;
  onFiltersChange?: (filters: {
    imAlertsType: string;
    hfFilters: string[];
    wpFilters: string[];
    mpFilters: string[];
  }) => void;
}

export function FilterControls({
  activeTab,
  timeInterval,
  onTimeIntervalChange,
  nifty50Enabled,
  onNifty50Change,
  onFiltersChange,
}: FilterControlsProps) {
  const [imAlertsType, setImAlertsType] = useState("");
  const [imAlertsSubFilter, setImAlertsSubFilter] = useState("");
  const [hfFilters, setHfFilters] = useState<string[]>([]);
  const [wpFilters, setWpFilters] = useState<string[]>([]);
  const [mpFilters, setMpFilters] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [timeMenuOpen, setTimeMenuOpen] = useState(false);

  // Notify parent component when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        imAlertsType,
        hfFilters,
        wpFilters,
        mpFilters,
      });
    }
  }, [imAlertsType, hfFilters, wpFilters, mpFilters, onFiltersChange]);

  const toggleFilter = (
    filterArray: string[],
    setFilter: (filters: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((f) => f !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  const resetAllFilters = () => {
    setImAlertsType("");
    setImAlertsSubFilter("");
    setHfFilters([]);
    setWpFilters([]);
    setMpFilters([]);
    setSelectedStrategy("");
  };

  const hasActiveFilters = () => {
    switch (activeTab) {
      case "im-alerts":
        return imAlertsType !== "" || imAlertsSubFilter !== "";
      case "im-hf-alerts":
        return hfFilters.length > 0;
      case "im-magic-alerts":
        return wpFilters.length > 0 || mpFilters.length > 0;
      case "stock-list-filter":
        if (selectedStrategy === "im-alerts") {
          return imAlertsType !== "";
        } else if (selectedStrategy === "im-hf-alerts") {
          return hfFilters.length > 0;
        } else if (selectedStrategy === "im-magic-alerts") {
          return wpFilters.length > 0 || mpFilters.length > 0;
        }
        return false;
      default:
        return false;
    }
  };

  const timeOptions = [
    "09:00-10:30",
    "10:30-12:00",
    "12:00-14:00",
    "14:00-15:30",
  ];

  const parseTimeToMinutes = (value: string): number | null => {
    const match = value.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  };

  const getTimeRangeLabel = (ranges: string[]): string => {
    if (!ranges || ranges.length === 0) return "Time: All";
    let minStart: number | null = null;
    let maxEnd: number | null = null;
    for (const r of ranges) {
      if (!r.includes("-")) continue;
      const [startStr, endStr] = r.split("-");
      const s = parseTimeToMinutes(startStr);
      const e = parseTimeToMinutes(endStr);
      if (s !== null) minStart = minStart === null ? s : Math.min(minStart, s);
      if (e !== null) maxEnd = maxEnd === null ? e : Math.max(maxEnd, e);
    }
    if (minStart === null || maxEnd === null)
      return `Time: ${ranges.join(", ")}`;
    const format = (m: number) => {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      const hh = h.toString().padStart(2, "0");
      const mmStr = mm.toString().padStart(2, "0");
      return `${hh}:${mmStr}`;
    };
    return `Time: ${format(minStart)} - ${format(maxEnd)}`;
  };

  const renderRightControls = () => (
    <div className="flex items-center gap-4 ml-auto">
      <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-3 py-1.5 border border-border/50">
        <Clock className="h-5 w-5 text-primary" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="min-w-48 justify-between bg-background border-border"
            >
              <span className="truncate">
                {getTimeRangeLabel(timeInterval)}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-60 bg-card border border-border p-2 z-50"
          >
            <button
              className="w-full text-left px-2 py-1.5 rounded hover:bg-secondary/20 text-sm"
              onClick={() => onTimeIntervalChange([])}
            >
              All
            </button>
            <div className="mt-1 space-y-1">
              {timeOptions.map((opt) => {
                const checked = timeInterval.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-secondary/20 text-sm"
                    onClick={() =>
                      onTimeIntervalChange(
                        checked
                          ? timeInterval.filter((t) => t !== opt)
                          : [...timeInterval, opt]
                      )
                    }
                  >
                    <span>{opt}</span>
                    <span
                      className={
                        "ml-3 flex items-center justify-center h-4 w-4 rounded border " +
                        (checked
                          ? "bg-primary border-primary"
                          : "bg-background border-border")
                      }
                    >
                      {checked ? (
                        <Check className="h-3.5 w-3.5 text-white" />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
        <span className="text-sm font-medium text-foreground">Nifty 50</span>
        <Switch
          checked={nifty50Enabled}
          onCheckedChange={onNifty50Change}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );

  const renderIMAlerts = () => (
    <div className="flex items-center justify-between w-full flex-wrap gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Type:
            </span>
            <div className="flex gap-1">
              {[
                { label: "FII-R1/R2", value: "fii-r", color: "bg-blue-600" },
                { label: "FII-S1/S2", value: "fii-s", color: "bg-orange-600" },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    imAlertsType === filter.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setImAlertsType(
                      imAlertsType === filter.value ? "" : filter.value
                    )
                  }
                  className={`transition-all duration-200 ${
                    imAlertsType === filter.value
                      ? `${filter.color} text-white shadow-lg`
                      : "bg-secondary/20 hover:bg-primary/20 hover:text-primary border-border"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {hasActiveFilters() && (
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="gap-2 bg-secondary/20 hover:bg-destructive hover:text-destructive-foreground border-border transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {renderRightControls()}
    </div>
  );

  const renderIMHFAlerts = () => (
    <div className="flex items-center justify-between w-full flex-wrap gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={hfFilters.includes("OCP/Matrix") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter(hfFilters, setHfFilters, "OCP/Matrix")}
            className={`transition-all duration-200 ${
              hfFilters.includes("OCP/Matrix")
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-secondary/20 hover:bg-primary/20 hover:text-primary border-border"
            }`}
          >
            OCP/Matrix
          </Button>

          <Button
            variant={hfFilters.includes("Up/Fall") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter(hfFilters, setHfFilters, "Up/Fall")}
            className={`transition-all duration-200 ${
              hfFilters.includes("Up/Fall")
                ? "bg-green-600 text-white shadow-lg"
                : "bg-secondary/20 hover:bg-primary/20 hover:text-primary border-border"
            }`}
          >
            Up/Fall
          </Button>

          <Button
            variant={hfFilters.includes("Point/Value") ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter(hfFilters, setHfFilters, "Point/Value")}
            className={`transition-all duration-200 ${
              hfFilters.includes("Point/Value")
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-secondary/20 hover:bg-primary/20 hover:text-primary border-border"
            }`}
          >
            Point/Value
          </Button>

          {hasActiveFilters() && (
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="gap-2 bg-secondary/20 hover:bg-destructive hover:text-destructive-foreground border-border transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {renderRightControls()}
    </div>
  );

  const renderIMMagicAlerts = () => (
    <div className="flex items-center justify-between w-full flex-wrap gap-4">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-accent">WP:</span>
              <div className="flex gap-1">
                {["Watch", "Close", "Must"].map((filter) => (
                  <Button
                    key={filter}
                    variant={wpFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      toggleFilter(wpFilters, setWpFilters, filter)
                    }
                    className={`transition-all duration-200 ${
                      wpFilters.includes(filter)
                        ? filter === "Must"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground shadow-lg"
                        : "bg-background hover:bg-primary/20 hover:text-primary border-border"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-accent">MP:</span>
              <div className="flex gap-1">
                {["Watch", "Close", "Must"].map((filter) => (
                  <Button
                    key={filter}
                    variant={mpFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      toggleFilter(mpFilters, setMpFilters, filter)
                    }
                    className={`transition-all duration-200 ${
                      mpFilters.includes(filter)
                        ? filter === "Must"
                          ? "bg-red-600 text-white"
                          : "bg-primary text-primary-foreground shadow-lg"
                        : "bg-background hover:bg-primary/20 hover:text-primary border-border"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">

          </div> */}

          {hasActiveFilters() && (
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="gap-2 bg-secondary/20 hover:bg-destructive hover:text-destructive-foreground border-border transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {renderRightControls()}
    </div>
  );

  return (
    <div className="px-6 py-4 bg-gradient-to-r from-secondary/5 via-card/50 to-secondary/5 border-b border-border backdrop-blur-sm">
      {activeTab === "im-alerts" && renderIMAlerts()}
      {activeTab === "im-hf-alerts" && renderIMHFAlerts()}
      {activeTab === "im-magic-alerts" && renderIMMagicAlerts()}
    </div>
  );
}
