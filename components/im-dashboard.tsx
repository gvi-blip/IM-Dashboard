"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
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
} from "lucide-react";
import { IMTable } from "./im-table";
import { FilterControls } from "./filter-controls";

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
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("dashboard-theme") as "light" | "dark") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("light", savedTheme === "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("dashboard-theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

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
      <div className="min-h-screen bg-background flex w-full">
        {/* Replace custom sidebar with shadcn Sidebar component */}
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className={`flex items-center gap-3`}>
              <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center">
                <img src="/IM.png" alt="IM Capital" className="h-8 w-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">IM Capital</span>
                <span className="truncate text-xs text-muted-foreground">
                  Investment Management
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <SidebarMenuItem key={tab.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveTab(tab.id as TabType)}
                          isActive={activeTab === tab.id}
                          tooltip={tab.label}
                          className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-secondary/50"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
              {/* Settings Menu Item */}
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Settings"
                      className="hover:bg-secondary/50"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="start"
                    className="w-56 p-1"
                    sideOffset={8}
                  >
                    <Button
                      variant="ghost"
                      onClick={toggleTheme}
                      className="w-full justify-start cursor-pointer hover:bg-secondary/50"
                    >
                      {theme === "dark" ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      <span>{theme === "dark" ? "Light" : "Dark"} Theme</span>
                    </Button>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>

              {/* User Menu Item */}
              <SidebarMenuItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      tooltip="User Account"
                      className="hover:bg-secondary/50"
                    >
                      <div className="relative">
                        <Avatar className="h-4 w-4 ring-1 ring-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-xs">
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full border border-background"></div>
                      </div>
                      <span>Portfolio Manager</span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    align="start"
                    className="w-56 p-2"
                    sideOffset={8}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-col space-y-1 px-2 py-1">
                        <p className="text-sm font-medium leading-none">
                          Portfolio Manager
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          manager@imcapital.com
                        </p>
                      </div>
                      <div className="border-t pt-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start cursor-pointer hover:bg-secondary/50 text-red-600 hover:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        {/* Replace main content div with SidebarInset */}
        <SidebarInset>
          {/* Header */}
          <header className="border-b border-border bg-gradient-to-r from-card via-card to-secondary/10 backdrop-blur-sm">
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
          <FilterControls
            activeTab={activeTab}
            timeInterval={timeInterval}
            onTimeIntervalChange={setTimeInterval}
            nifty50Enabled={nifty50Enabled}
            onNifty50Change={setNifty50Enabled}
            onFiltersChange={handleFiltersChange}
          />

          {/* Table Content */}
          <div className="px-6 py-6">
            <Card className="overflow-hidden border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm">
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
