"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Clock,
  User,
  TrendingUp,
  Activity,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Settings,
  WandSparkles,
  ChevronsUpDown,
} from "lucide-react";
import { IMTable } from "./im-table";
import { FilterControls } from "./filter-controls";
import { AppSidebar } from "./app-sidebar";

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

export function IMDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("im-alerts");
  const [timeInterval, setTimeInterval] = useState("09:00-10:30");
  const [nifty50Enabled, setNifty50Enabled] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");

  // Data states
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    imAlertsType: "",
    hfFilters: [] as string[],
    wpFilters: [] as string[],
    mpFilters: [] as string[],
  });

  // Refs for intervals
  const autoRefreshInterval = useRef<NodeJS.Timeout | null>(null);

  const applyTheme = useCallback((mode: "light" | "dark" | "system") => {
    try {
      const prefersLight =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;
      const isLight = mode === "light" || (mode === "system" && prefersLight);
      document.documentElement.classList.toggle("light", isLight);
    } catch (_) {
      document.documentElement.classList.toggle("light", mode === "light");
    }
  }, []);

  useEffect(() => {
    const saved =
      (localStorage.getItem("dashboard-theme") as
        | "light"
        | "dark"
        | "system") || "dark";
    setTheme(saved);
    applyTheme(saved);
  }, [applyTheme]);

  const setThemeMode = useCallback(
    (mode: "light" | "dark" | "system") => {
      setTheme(mode);
      localStorage.setItem("dashboard-theme", mode);
      applyTheme(mode);
    },
    [applyTheme]
  );

  // Fetch data function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/data");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result: ApiResponse = await response.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh) {
      // Fetch immediately when auto-refresh is enabled
      fetchData();

      // Set up interval for every 15 seconds
      autoRefreshInterval.current = setInterval(() => {
        fetchData();
      }, 15000);
    } else {
      // Clear interval when auto-refresh is disabled
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
        autoRefreshInterval.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
        autoRefreshInterval.current = null;
      }
    };
  }, [autoRefresh, fetchData]);

  // Initial data fetch
  useEffect(() => {
    if (!autoRefresh) {
      fetchData();
    }
  }, [fetchData, autoRefresh]);

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: {
      imAlertsType: string;
      hfFilters: string[];
      wpFilters: string[];
      mpFilters: string[];
    }) => {
      setFilters(newFilters);
    },
    []
  );

  const tabs = [
    { id: "im-alerts", label: "IM Alerts", icon: TrendingUp },
    { id: "im-hf-alerts", label: "IM-HF Alerts", icon: Activity },
    { id: "im-magic-alerts", label: "IM Magic Alerts", icon: WandSparkles },
    { id: "stock-list-filter", label: "Stock List Filter", icon: BarChart3 },
  ] as const;

  return (
    <SidebarProvider>
      <div className="h-screen bg-background flex w-full overflow-hidden">
        <AppSidebar
          activeTab={activeTab}
          onSelectTab={(t) => setActiveTab(t)}
          theme={theme}
          onThemeChange={setThemeMode}
        />
        {/* Replace main content div with SidebarInset */}
        <SidebarInset className="flex flex-col h-screen min-h-0">
          {/* Header */}
          <header className="flex-shrink-0 border-b border-border bg-gradient-to-r from-card via-card to-secondary/10 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <div className="text-center flex-1">
                  <h1 className="text-3xl font-bold text-foreground text-balance">
                    IM-Live Alerts Dashboard
                  </h1>
                  {/* <p className="text-sm text-muted-foreground mt-1">
                    Real-time market intelligence
                  </p> */}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-secondary/20 rounded-lg px-2 py-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isLoading
                        ? "bg-blue-500 animate-pulse"
                        : autoRefresh
                        ? "bg-green-500 animate-pulse"
                        : "bg-muted"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-foreground">
                    Auto-refresh
                  </span>
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted data-[state=unchecked]:border data-[state=unchecked]:border-border"
                  />
                  {lastUpdated && (
                    <span className="text-xs text-muted-foreground">
                      Last: {lastUpdated}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isLoading}
                  className="gap-2 bg-card/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-border/50"
                >
                  {isLoading ? "Refreshing..." : "Manual Refresh"}
                </Button>
              </div>
            </div>
          </header>

          {/* Filter Controls */}
          <div className="flex-shrink-0">
            <FilterControls
              activeTab={activeTab}
              timeInterval={timeInterval}
              onTimeIntervalChange={setTimeInterval}
              nifty50Enabled={nifty50Enabled}
              onNifty50Change={setNifty50Enabled}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Table Content */}
          <div className="flex-1 min-h-0 px-6 py-6">
            <Card className="p-0 h-full min-h-0 flex flex-col border border-border shadow-sm bg-card rounded-lg">
              <IMTable
                activeTab={activeTab}
                data={data}
                isLoading={isLoading}
                error={error}
                lastUpdated={lastUpdated}
                filters={filters}
                nifty50Enabled={nifty50Enabled}
              />
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
