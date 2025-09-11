"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"

type TabType = "im-alerts" | "im-hf-alerts" | "im-magic-alerts" | "stock-list-filter"

interface FilterControlsProps {
  activeTab: TabType
}

export function FilterControls({ activeTab }: FilterControlsProps) {
  const [imAlertsType, setImAlertsType] = useState("")
  const [imAlertsSubFilter, setImAlertsSubFilter] = useState("")
  const [hfFilters, setHfFilters] = useState<string[]>([])
  const [wpFilters, setWpFilters] = useState<string[]>([])
  const [mpFilters, setMpFilters] = useState<string[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState("")

  const toggleFilter = (filterArray: string[], setFilter: (filters: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((f) => f !== value))
    } else {
      setFilter([...filterArray, value])
    }
  }

  const resetAllFilters = () => {
    setImAlertsType("")
    setImAlertsSubFilter("")
    setHfFilters([])
    setWpFilters([])
    setMpFilters([])
    setSelectedStrategy("")
  }

  const hasActiveFilters = () => {
    switch (activeTab) {
      case "im-alerts":
        return imAlertsType !== "" || imAlertsSubFilter !== ""
      case "im-hf-alerts":
        return hfFilters.length > 0
      case "im-magic-alerts":
        return wpFilters.length > 0 || mpFilters.length > 0
      case "stock-list-filter":
        if (selectedStrategy === "im-alerts") {
          return imAlertsType !== ""
        } else if (selectedStrategy === "im-hf-alerts") {
          return hfFilters.length > 0
        } else if (selectedStrategy === "im-magic-alerts") {
          return wpFilters.length > 0 || mpFilters.length > 0
        }
        return false
      default:
        return false
    }
  }

  const renderIMAlerts = () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Filters:</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type:</span>
          <div className="flex gap-1">
            {[
              { label: "FII-R1/R2", value: "fii-r", color: "bg-blue-600" },
              { label: "FII-S1/S2", value: "fii-s", color: "bg-orange-600" },
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={imAlertsType === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setImAlertsType(imAlertsType === filter.value ? "" : filter.value)}
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
  )

  const renderIMHFAlerts = () => (
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
  )

  const renderIMMagicAlerts = () => (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Magic Filters:</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
          <span className="text-sm font-semibold text-accent">WP:</span>
          <div className="flex gap-1">
            {["Watch", "Close", "Must"].map((filter) => (
              <Button
                key={filter}
                variant={wpFilters.includes(filter) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(wpFilters, setWpFilters, filter)}
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

        <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
          <span className="text-sm font-semibold text-accent">MP:</span>
          <div className="flex gap-1">
            {["Watch", "Close", "Must"].map((filter) => (
              <Button
                key={filter}
                variant={mpFilters.includes(filter) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(mpFilters, setMpFilters, filter)}
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
  )

  const renderStockListFilter = () => (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Strategy:</span>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
          <SelectTrigger className="w-48 bg-background border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Select Strategy" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="im-alerts">IM Alerts</SelectItem>
            <SelectItem value="im-hf-alerts">IM-HF Alerts</SelectItem>
            <SelectItem value="im-magic-alerts">IM Magic Alerts</SelectItem>
          </SelectContent>
        </Select>

        {selectedStrategy === "im-alerts" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type:</span>
            <div className="flex gap-1">
              {[
                { label: "FII-R1/R2", value: "fii-r", color: "bg-blue-600" },
                { label: "FII-S1/S2", value: "fii-s", color: "bg-orange-600" },
              ].map((filter) => (
                <Button
                  key={filter.value}
                  variant={imAlertsType === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImAlertsType(imAlertsType === filter.value ? "" : filter.value)}
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
        )}

        {selectedStrategy === "im-hf-alerts" && (
          <div className="flex gap-1">
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
          </div>
        )}

        {selectedStrategy === "im-magic-alerts" && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
              <span className="text-sm font-semibold text-accent">WP:</span>
              <div className="flex gap-1">
                {["Watch", "Close", "Must"].map((filter) => (
                  <Button
                    key={filter}
                    variant={wpFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(wpFilters, setWpFilters, filter)}
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

            <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
              <span className="text-sm font-semibold text-accent">MP:</span>
              <div className="flex gap-1">
                {["Watch", "Close", "Must"].map((filter) => (
                  <Button
                    key={filter}
                    variant={mpFilters.includes(filter) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(mpFilters, setMpFilters, filter)}
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
        )}

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
  )

  return (
    <div className="px-8 py-6 bg-gradient-to-r from-secondary/5 via-card/50 to-secondary/5 border-b border-border backdrop-blur-sm">
      {activeTab === "im-alerts" && renderIMAlerts()}
      {activeTab === "im-hf-alerts" && renderIMHFAlerts()}
      {activeTab === "im-magic-alerts" && renderIMMagicAlerts()}
      {activeTab === "stock-list-filter" && renderStockListFilter()}
    </div>
  )
}
