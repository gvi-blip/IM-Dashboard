"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

type TabType = "im-alerts" | "im-hf-alerts" | "im-magic-alerts" | "stock-list-filter"

interface IMTableProps {
  activeTab: TabType
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
]

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
]

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
]

export function IMTable({ activeTab }: IMTableProps) {
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
          <TableHead className="font-semibold text-foreground">Index & Oth</TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
          <TableHead className="font-semibold text-foreground">Type</TableHead>
          <TableHead className="font-semibold text-foreground">Alert Detail</TableHead>
          <TableHead className="font-semibold text-foreground">LTP</TableHead>
          <TableHead className="font-semibold text-foreground">BaseLine</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imAlertsData.map((row, index) => (
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
            <TableCell className="text-muted-foreground">{row.indexOth}</TableCell>
            <TableCell className="text-muted-foreground font-mono text-sm">{row.time}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  row.type.includes("R1")
                    ? "bg-blue-600 text-white border-blue-500"
                    : row.type.includes("R2")
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : row.type.includes("S1")
                        ? "bg-orange-600 text-white border-orange-500"
                        : row.type.includes("S2")
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-primary text-primary-foreground border-primary/30"
                }`}
              >
                {row.type}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{row.alertDetail}</TableCell>
            <TableCell className="font-mono text-sm font-semibold text-foreground">{row.ltp}</TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">{row.baseline}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

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
          <TableHead className="font-semibold text-foreground">Index & Oth</TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
          <TableHead className="font-semibold text-foreground">Type</TableHead>
          <TableHead className="font-semibold text-foreground">Alert Detail</TableHead>
          <TableHead className="font-semibold text-foreground">LTP</TableHead>
          <TableHead className="font-semibold text-foreground">BaseLine</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imHfAlertsData.map((row, index) => (
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
            <TableCell className="text-muted-foreground">{row.indexOth}</TableCell>
            <TableCell className="text-muted-foreground font-mono text-sm">{row.time}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`${
                  row.type.includes("OCP")
                    ? "bg-blue-600 text-white border-blue-500"
                    : row.type.includes("Matrix")
                      ? "bg-purple-600 text-white border-purple-500"
                      : row.type.includes("Up")
                        ? "bg-green-600 text-white border-green-500"
                        : row.type.includes("Fall")
                          ? "bg-red-600 text-white border-red-500"
                          : "bg-primary text-primary-foreground border-primary/30"
                }`}
              >
                {row.type}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{row.alertDetail}</TableCell>
            <TableCell className="font-mono text-sm font-semibold text-foreground">{row.ltp}</TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">{row.baseline}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderIMMagicAlertsTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-secondary/20 via-card to-secondary/20 border-b border-border">
          <TableHead className="font-semibold text-foreground">Symbol</TableHead>
          <TableHead className="font-semibold text-foreground">Index & Oth</TableHead>
          <TableHead className="font-semibold text-foreground">WP</TableHead>
          <TableHead className="font-semibold text-foreground">MP</TableHead>
          <TableHead className="font-semibold text-foreground">Alert Detail</TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {imMagicAlertsData.map((row, index) => (
          <TableRow key={index} className={index % 2 === 0 ? "bg-background/50" : "bg-secondary/10"}>
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-primary hover:text-accent transition-colors"
              >
                {row.symbol}
              </Button>
            </TableCell>
            <TableCell className="text-muted-foreground">{row.indexOth}</TableCell>
            <TableCell>
              <Badge
                variant={row.wp === "Must" ? "destructive" : row.wp === "Watch" ? "default" : "outline"}
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
            </TableCell>
            <TableCell>
              <Badge
                variant={row.mp === "Must" ? "destructive" : row.mp === "Watch" ? "default" : "outline"}
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
            </TableCell>
            <TableCell className="font-medium">{row.alertDetail}</TableCell>
            <TableCell className="text-muted-foreground font-mono text-sm">{row.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderStockListFilterTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-secondary/20 via-card to-secondary/20 border-b border-border">
          <TableHead className="font-semibold text-foreground">Symbol</TableHead>
          <TableHead className="font-semibold text-foreground">Index & Oth</TableHead>
          <TableHead className="font-semibold text-foreground">Type</TableHead>
          <TableHead className="font-semibold text-foreground">WP</TableHead>
          <TableHead className="font-semibold text-foreground">MP</TableHead>
          <TableHead className="font-semibold text-foreground">Alert Detail</TableHead>
          <TableHead className="font-semibold text-foreground">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...imAlertsData, ...imMagicAlertsData].map((row, index) => (
          <TableRow key={index} className={index % 2 === 0 ? "bg-background/50" : "bg-secondary/10"}>
            <TableCell className="font-medium">
              <Button
                variant="link"
                className="h-auto p-0 font-semibold text-primary hover:text-accent transition-colors"
              >
                {row.symbol}
              </Button>
            </TableCell>
            <TableCell className="text-muted-foreground">{row.indexOth}</TableCell>
            <TableCell>
              {"type" in row ? (
                <Badge variant="secondary" className="bg-primary text-primary-foreground border-primary/30">
                  {row.type}
                </Badge>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {"wp" in row ? (
                <Badge
                  variant={row.wp === "Must" ? "destructive" : row.wp === "Watch" ? "default" : "outline"}
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
                  variant={row.mp === "Must" ? "destructive" : row.mp === "Watch" ? "default" : "outline"}
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
            <TableCell className="text-muted-foreground font-mono text-sm">{row.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="overflow-x-auto bg-gradient-to-b from-background to-secondary/5">
      {activeTab === "im-alerts" && renderIMAlertsTable()}
      {activeTab === "im-hf-alerts" && renderIMHFAlertsTable()}
      {activeTab === "im-magic-alerts" && renderIMMagicAlertsTable()}
      {activeTab === "stock-list-filter" && renderStockListFilterTable()}
    </div>
  )
}
