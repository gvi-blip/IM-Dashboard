"use client";

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { AlertData } from "./IMAlertsTable";

export function IMHFAlertsTable({
  data,
  symbolSearch,
  onSymbolSearchChange,
}: {
  data: AlertData[];
  symbolSearch: string;
  onSymbolSearchChange: (q: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead>
                <div className="flex items-center gap-2">
                  {!open ? (
                    <span>Symbol</span>
                  ) : (
                    <Input
                      value={symbolSearch}
                      onChange={(e) => onSymbolSearchChange(e.target.value)}
                      onBlur={() => {
                        if (!symbolSearch.trim()) setOpen(false);
                      }}
                      placeholder="Search symbol"
                      className="h-8 w-40 text-sm"
                      autoFocus
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => {
                      if (open) {
                        onSymbolSearchChange("");
                        setOpen(false);
                      } else {
                        setOpen(true);
                      }
                    }}
                    title={open ? "Clear search" : "Search symbol"}
                  >
                    {open ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableHead>
              <TableHead>Index & Oth</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Alert Detail</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>Baseline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={`${row.symbol}-${index}`}
                className="transition-colors hover:bg-primary/5 border-b border-border"
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
                  {row.time ||
                    (row.timestamp
                      ? new Date(row.timestamp).toLocaleTimeString()
                      : "")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${
                      (row.type || row.signal)?.includes("OCP")
                        ? "bg-blue-600 text-white border-blue-500"
                        : (row.type || row.signal)?.includes("Matrix")
                        ? "bg-purple-600 text-white border-purple-500"
                        : (row.type || row.signal)?.includes("Up")
                        ? "bg-green-600 text-white border-green-500"
                        : (row.type || row.signal)?.includes("Value")
                        ? "bg-orange-600 text-white border-orange-500"
                        : (row.type || row.signal)?.includes("Point")
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : "bg-primary text-primary-foreground border-primary/30"
                    }`}
                  >
                    {row.type || row.signal}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {row.alertDetail || ""}
                </TableCell>
                <TableCell className="font-mono text-sm font-semibold text-foreground">
                  ₹
                  {(typeof row.ltp === "number"
                    ? row.ltp
                    : Number(row.ltp || row.price || 0)
                  ).toFixed(2)}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  ₹
                  {(typeof row.baseline === "number"
                    ? row.baseline
                    : Number(
                        row.baseline || (row.price || 0) - (row.change || 0)
                      )
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
