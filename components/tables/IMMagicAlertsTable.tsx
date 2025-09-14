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

export function IMMagicAlertsTable({
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
              <TableHead>WP</TableHead>
              <TableHead>MP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={`${row.symbol}-${index}`}
                className="border-b border-border"
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
                <TableCell className="">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
