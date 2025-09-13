"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

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
  filters: {
    imAlertsType: string;
    hfFilters: string[];
    wpFilters: string[];
    mpFilters: string[];
  };
  nifty50Enabled: boolean;
}

// Sample data for different tabs
const imAlertsData = [
  {
    symbol: "RELIANCE",
    indexOth: "NIFTY 50",
    time: "10:15 AM",
    type: "FII - R1",
    alertDetail: "Closed Above R1 at 2,450.75",
    ltp: "2,451.20",
    baseline: "2,445.00",
  },
  {
    symbol: "TCS",
    indexOth: "NIFTY 50",
    time: "10:22 AM",
    type: "FII - R2",
    alertDetail: "Approaching R2 at 3,890.25",
    ltp: "3,888.50",
    baseline: "3,875.00",
  },
  {
    symbol: "HDFC",
    indexOth: "NIFTY 50",
    time: "10:28 AM",
    type: "FII - S1",
    alertDetail: "Closed Below S1 at 1,675.50",
    ltp: "1,673.25",
    baseline: "1,680.00",
  },
  {
    symbol: "INFY",
    indexOth: "NIFTY 50",
    time: "10:35 AM",
    type: "FII - S2",
    alertDetail: "Testing S2 support at 1,456.75",
    ltp: "1,458.10",
    baseline: "1,465.00",
  },
];

const imHfAlertsData = [
  {
    symbol: "INFY",
    indexOth: "NIFTY 50",
    time: "10:18 AM",
    type: "OCP - Up",
    alertDetail: "Max Up detected at 1,456.75",
    ltp: "1,458.10",
    baseline: "1,450.00",
  },
  {
    symbol: "WIPRO",
    indexOth: "NIFTY IT",
    time: "10:25 AM",
    type: "Matrix - Fall",
    alertDetail: "Significant fall at 425.30",
    ltp: "425.30",
    baseline: "430.00",
  },
  {
    symbol: "TCS",
    indexOth: "NIFTY 50",
    time: "10:32 AM",
    type: "OCP - Point",
    alertDetail: "Point breakout at 3,890.25",
    ltp: "3,892.50",
    baseline: "3,885.00",
  },
  {
    symbol: "HCLTECH",
    indexOth: "NIFTY IT",
    time: "10:40 AM",
    type: "Matrix - Value",
    alertDetail: "Value alert triggered at 1,245.75",
    ltp: "1,247.20",
    baseline: "1,240.00",
  },
];

const imMagicAlertsData = [
  {
    symbol: "BAJFINANCE",
    indexOth: "NIFTY 50",
    wp: "Watch",
    mp: "Must",
    alertDetail: "Critical level breach at 6,750.25",
    time: "10:20 AM",
  },
  {
    symbol: "MARUTI",
    indexOth: "NIFTY AUTO",
    wp: "Close",
    mp: "Watch",
    alertDetail: "Approaching key resistance",
    time: "10:30 AM",
  },
];

export function IMTable({
  activeTab,
  data,
  isLoading,
  error,
  lastUpdated,
  filters,
  nifty50Enabled,
}: IMTableProps) {
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

    // Apply filters based on active tab
    let filteredData = rawData;

    // Apply Nifty 50 filter
    if (nifty50Enabled) {
      filteredData = filteredData.filter(
        (item) => item.indexOth === "Nifty 50"
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
  if (isLoading) {
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
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-secondary/20 via-card to-secondary/20 border-b border-border">
          <TableHead className="font-semibold text-foreground">
            <Button
              variant="ghost"
              className="h-auto p-0 font-semibold text-foreground hover:text-primary transition-colors"
            >
              Symbol <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Index & Oth
          </TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
          <TableHead className="font-semibold text-foreground">Type</TableHead>
          <TableHead className="font-semibold text-foreground">
            Alert Detail
          </TableHead>
          <TableHead className="font-semibold text-foreground">LTP</TableHead>
          <TableHead className="font-semibold text-foreground">
            Baseline
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((row, index) => (
          <TableRow
            key={index}
            className={`transition-colors hover:bg-primary/5 border-b border-border/50 ${
              index % 2 === 0 ? "bg-background/50" : "bg-secondary/10"
            }`}
          >
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-primary hover:text-accent transition-colors"
              >
                {row.symbol}
              </Button>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {row.indexOth || "Index"}
            </TableCell>
            <TableCell className="text-muted-foreground font-mono text-sm">
              {row.time || new Date(row.timestamp).toLocaleTimeString()}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  (row.type || row.signal).includes("R1")
                    ? "bg-blue-600 text-white border-blue-500"
                    : (row.type || row.signal).includes("R2")
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : (row.type || row.signal).includes("S1")
                    ? "bg-orange-600 text-white border-orange-500"
                    : (row.type || row.signal).includes("S2")
                    ? "bg-red-600 text-white border-red-500"
                    : "bg-primary text-primary-foreground border-primary/30"
                }`}
              >
                {row.type || row.signal}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {row.alertDetail ||
                `Vol: ${row.volume.toLocaleString()} | Change: ${
                  row.change > 0 ? "+" : ""
                }${row.change} (${row.changePercent > 0 ? "+" : ""}${
                  row.changePercent
                }%)`}
            </TableCell>
            <TableCell className="font-mono text-sm font-semibold text-foreground">
              ₹{(row.ltp || row.price).toFixed(2)}
            </TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">
              ₹{(row.baseline || row.price - row.change).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderIMHFAlertsTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-secondary/20 via-card to-secondary/20 border-b border-border">
          <TableHead className="font-semibold text-foreground">
            <Button
              variant="ghost"
              className="h-auto p-0 font-semibold text-foreground hover:text-primary transition-colors"
            >
              Symbol <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Index & Oth
          </TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
          <TableHead className="font-semibold text-foreground">Type</TableHead>
          <TableHead className="font-semibold text-foreground">
            Alert Detail
          </TableHead>
          <TableHead className="font-semibold text-foreground">LTP</TableHead>
          <TableHead className="font-semibold text-foreground">
            Baseline
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((row, index) => (
          <TableRow
            key={index}
            className={`transition-colors hover:bg-primary/5 border-b border-border/50 ${
              index % 2 === 0 ? "bg-background/50" : "bg-secondary/10"
            }`}
          >
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-primary hover:text-accent transition-colors"
              >
                {row.symbol}
              </Button>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {row.indexOth || "Index"}
            </TableCell>
            <TableCell className="text-muted-foreground font-mono text-sm">
              {row.time || new Date(row.timestamp).toLocaleTimeString()}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  (row.type || row.signal).includes("OCP")
                    ? "bg-blue-600 text-white border-blue-500"
                    : (row.type || row.signal).includes("Matrix")
                    ? "bg-purple-600 text-white border-purple-500"
                    : (row.type || row.signal).includes("Up")
                    ? "bg-green-600 text-white border-green-500"
                    : (row.type || row.signal).includes("Value")
                    ? "bg-orange-600 text-white border-orange-500"
                    : (row.type || row.signal).includes("Point")
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-primary text-primary-foreground border-primary/30"
                }`}
              >
                {row.type || row.signal}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {row.alertDetail ||
                `Vol: ${row.volume.toLocaleString()} | Change: ${
                  row.change > 0 ? "+" : ""
                }${row.change} (${row.changePercent > 0 ? "+" : ""}${
                  row.changePercent
                }%)`}
            </TableCell>
            <TableCell className="font-mono text-sm font-semibold text-foreground">
              ₹{(row.ltp || row.price).toFixed(2)}
            </TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">
              ₹{(row.baseline || row.price - row.change).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderIMMagicAlertsTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-secondary/20 via-card to-secondary/20 border-b border-border">
          <TableHead className="font-semibold text-foreground">
            Symbol
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Index & Oth
          </TableHead>
          <TableHead className="font-semibold text-foreground">WP</TableHead>
          <TableHead className="font-semibold text-foreground">MP</TableHead>
          {/* <TableHead className="font-semibold text-foreground">
            Alert Detail
          </TableHead> */}
          {/* <TableHead className="font-semibold text-foreground">Time</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((row, index) => (
          <TableRow
            key={index}
            className={index % 2 === 0 ? "bg-background/50" : "bg-secondary/10"}
          >
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-primary hover:text-accent transition-colors"
              >
                {row.symbol}
              </Button>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {row.indexOth || "Index"}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  (row.wp || row.wpSignal) === "Must"
                    ? "bg-red-600 text-white border-red-500"
                    : (row.wp || row.wpSignal) === "Watch"
                    ? "bg-blue-600 text-white border-blue-500"
                    : (row.wp || row.wpSignal) === "Close"
                    ? "bg-orange-600 text-white border-orange-500"
                    : (row.wp || row.wpSignal) === "Coming"
                    ? "bg-green-600 text-white border-green-500"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {row.wp || row.wpSignal}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  (row.mp || row.mpSignal) === "Must"
                    ? "bg-red-600 text-white border-red-500"
                    : (row.mp || row.mpSignal) === "Watch"
                    ? "bg-blue-600 text-white border-blue-500"
                    : (row.mp || row.mpSignal) === "Close"
                    ? "bg-orange-600 text-white border-orange-500"
                    : (row.mp || row.mpSignal) === "Coming"
                    ? "bg-green-600 text-white border-green-500"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {row.mp || row.mpSignal}
              </Badge>
            </TableCell>
            {/* <TableCell className="font-medium">{row.alertDetail}</TableCell> */}
            {/* <TableCell className="text-muted-foreground font-mono text-sm">{row.time}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderStockListFilterTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-secondary/20 via-card to-secondary/20 border-b border-border">
          <TableHead className="font-semibold text-foreground">
            Symbol
          </TableHead>
          <TableHead className="font-semibold text-foreground">
            Index & Oth
          </TableHead>
          <TableHead className="font-semibold text-foreground">Type</TableHead>
          <TableHead className="font-semibold text-foreground">WP</TableHead>
          <TableHead className="font-semibold text-foreground">MP</TableHead>
          <TableHead className="font-semibold text-foreground">
            Alert Detail
          </TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((row, index) => (
          <TableRow
            key={index}
            className={index % 2 === 0 ? "bg-background/50" : "bg-secondary/10"}
          >
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-primary hover:text-accent transition-colors"
              >
                {row.symbol}
              </Button>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {row.indexOth}
            </TableCell>
            <TableCell>
              {"type" in row ? (
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground border-primary/30"
                >
                  {row.type}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {"wp" in row ? (
                <Badge
                  variant={
                    row.wp === "Must"
                      ? "destructive"
                      : row.wp === "Watch"
                      ? "default"
                      : "outline"
                  }
                  className={`${
                    row.wp === "Must"
                      ? "bg-red-600 text-white"
                      : row.wp === "Watch"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {row.wp}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {"mp" in row ? (
                <Badge
                  variant={
                    row.mp === "Must"
                      ? "destructive"
                      : row.mp === "Watch"
                      ? "default"
                      : "outline"
                  }
                  className={`${
                    row.mp === "Must"
                      ? "bg-red-600 text-white"
                      : row.mp === "Watch"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {row.mp}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="font-medium">{row.alertDetail}</TableCell>
            <TableCell className="text-muted-foreground font-mono text-sm">
              {row.time}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="overflow-x-auto bg-gradient-to-b from-background to-secondary/5">
      {activeTab === "im-alerts" && renderIMAlertsTable()}
      {activeTab === "im-hf-alerts" && renderIMHFAlertsTable()}
      {activeTab === "im-magic-alerts" && renderIMMagicAlertsTable()}
      {activeTab === "stock-list-filter" && renderStockListFilterTable()}
    </div>
  );
}
