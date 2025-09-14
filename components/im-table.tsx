"use client";

import { IMAlertsTable } from "./tables/IMAlertsTable";
import { IMHFAlertsTable } from "./tables/IMHFAlertsTable";
import { IMMagicAlertsTable } from "./tables/IMMagicAlertsTable";
import React from "react";

type TabType =
  | "im-alerts"
  | "im-hf-alerts"
  | "im-magic-alerts"
  | "stock-list-filter";

interface AlertData {
  id: string;
  timestamp: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  signal: string;
  [key: string]: any;
}

interface ApiResponse {
  im_alerts: AlertData[];
  im_hf_alerts: AlertData[];
  im_magic_alerts: AlertData[];
  timestamp: string;
}

interface IMTableProps {
  activeTab: TabType;
  data: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  timeInterval?: string[];
  filters: {
    imAlertsType: string;
    hfFilters: string[];
    wpFilters: string[];
    mpFilters: string[];
  };
  nifty50Enabled: boolean;
  symbolSearch: string;
  onSymbolSearchChange: (q: string) => void;
}

export function IMTable({
  activeTab,
  data,
  isLoading,
  error,
  lastUpdated,
  timeInterval,
  filters,
  nifty50Enabled,
  symbolSearch,
  onSymbolSearchChange,
}: IMTableProps) {
  const [symbolSearchOpen, setSymbolSearchOpen] = React.useState(false);

  // Function to get current tab data with filtering
  const getCurrentData = () => {
    if (!data) return [];

    let rawData: AlertData[] = [];

    switch (activeTab) {
      case "im-alerts":
        rawData = data.im_alerts || [];
        break;
      case "im-hf-alerts":
        rawData = data.im_hf_alerts || [];
        break;
      case "im-magic-alerts":
        rawData = data.im_magic_alerts || [];
        break;
      case "stock-list-filter":
        // For stock list filter, combine all data
        rawData = [
          ...(data.im_alerts || []),
          ...(data.im_hf_alerts || []),
          ...(data.im_magic_alerts || []),
        ];
        break;
      default:
        return [];
    }

    // Apply time interval filter if provided (expects format "HH:MM-HH:MM")
    const parseTimeToMinutes = (value: string): number | null => {
      if (!value) return null;
      const trimmed = value.trim();
      const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
      return hours * 60 + minutes;
    };

    const getItemMinutes = (item: AlertData): number | null => {
      if (item.time && typeof item.time === "string") {
        const m = parseTimeToMinutes(item.time);
        if (m !== null) return m;
      }
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          return d.getHours() * 60 + d.getMinutes();
        }
      }
      return null;
    };

    if (
      timeInterval &&
      Array.isArray(timeInterval) &&
      timeInterval.length > 0
    ) {
      const ranges: Array<{ start: number; end: number }> = [];
      for (const rangeStr of timeInterval) {
        if (!rangeStr.includes("-")) continue;
        const [startStr, endStr] = rangeStr.split("-");
        const start = parseTimeToMinutes(startStr);
        const end = parseTimeToMinutes(endStr);
        if (start !== null && end !== null) {
          ranges.push({ start, end });
        }
      }
      if (ranges.length > 0) {
        rawData = rawData.filter((item) => {
          const m = getItemMinutes(item as any);
          if (m === null) return false;
          return ranges.some(({ start, end }) => m >= start && m <= end);
        });
      }
    }

    // Apply filters based on active tab
    let filteredData = rawData;

    // Apply Nifty 50 filter
    if (nifty50Enabled) {
      filteredData = filteredData.filter(
        (item) => item.indexOth === "Nifty 50"
      );
    }

    // Apply symbol search (case-insensitive, startsWith or includes)
    if (symbolSearch.trim()) {
      const q = symbolSearch.trim().toLowerCase();
      filteredData = filteredData.filter((item) =>
        (item.symbol || "").toLowerCase().includes(q)
      );
    }

    // Apply tab-specific filters
    switch (activeTab) {
      case "im-alerts":
        if (filters.imAlertsType) {
          if (filters.imAlertsType === "fii-r") {
            // Filter for FII-R1 and FII-R2
            filteredData = filteredData.filter(
              (item) =>
                (item.type || item.signal).includes("R1") ||
                (item.type || item.signal).includes("R2")
            );
          } else if (filters.imAlertsType === "fii-s") {
            // Filter for FII-S1 and FII-S2
            filteredData = filteredData.filter(
              (item) =>
                (item.type || item.signal).includes("S1") ||
                (item.type || item.signal).includes("S2")
            );
          }
        }
        break;

      case "im-hf-alerts":
        if (filters.hfFilters.length > 0) {
          filteredData = filteredData.filter((item) => {
            const type = item.type || item.signal;
            return filters.hfFilters.some((filter) => {
              switch (filter) {
                case "OCP/Matrix":
                  return type.includes("OCP") || type.includes("Matrix");
                case "Up/Fall":
                  return type.includes("Up") || type.includes("Fall");
                case "Point/Value":
                  return type.includes("Point") || type.includes("Value");
                default:
                  return false;
              }
            });
          });
        }
        break;

      case "im-magic-alerts":
        filteredData = filteredData.filter((item) => {
          let showItem = true;

          // Filter by WP (exclude "Coming" from filters)
          if (filters.wpFilters.length > 0) {
            const wpValue = item.wp || item.wpSignal;
            showItem = showItem && filters.wpFilters.includes(wpValue);
          }

          // Filter by MP (exclude "Coming" from filters)
          if (filters.mpFilters.length > 0) {
            const mpValue = item.mp || item.mpSignal;
            showItem = showItem && filters.mpFilters.includes(mpValue);
          }

          return showItem;
        });
        break;
    }

    return filteredData;
  };

  const currentData = getCurrentData();

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error: {error}</p>
          <p className="text-muted-foreground text-sm">
            Please try refreshing the data
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || currentData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
          <p className="text-sm text-muted-foreground">
            Try refreshing to load data
          </p>
        </div>
      </div>
    );
  }

  const renderIMAlertsTable = () => (
    <IMAlertsTable
      data={currentData}
      symbolSearch={symbolSearch}
      onSymbolSearchChange={onSymbolSearchChange}
    />
  );

  const renderIMHFAlertsTable = () => (
    <IMHFAlertsTable
      data={currentData}
      symbolSearch={symbolSearch}
      onSymbolSearchChange={onSymbolSearchChange}
    />
  );

  const renderIMMagicAlertsTable = () => (
    <IMMagicAlertsTable
      data={currentData}
      symbolSearch={symbolSearch}
      onSymbolSearchChange={onSymbolSearchChange}
    />
  );

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-b from-background to-secondary/5 relative rounded-lg">
      <>
        {activeTab === "im-alerts" && renderIMAlertsTable()}
        {activeTab === "im-hf-alerts" && renderIMHFAlertsTable()}
        {activeTab === "im-magic-alerts" && renderIMMagicAlertsTable()}
      </>
    </div>
  );
}
