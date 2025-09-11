"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Clock, User, TrendingUp, Activity, BarChart3, LogOut, Sun, Moon } from "lucide-react"
import { IMTable } from "./im-table"
import { FilterControls } from "./filter-controls"

type TabType = "im-alerts" | "im-hf-alerts" | "im-magic-alerts" | "stock-list-filter"

export function IMDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("im-alerts")
  const [timeInterval, setTimeInterval] = useState("09:00-10:30")
  const [nifty50Enabled, setNifty50Enabled] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const savedTheme = (localStorage.getItem("dashboard-theme") as "light" | "dark") || "dark"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("light", savedTheme === "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("dashboard-theme", newTheme)
    document.documentElement.classList.toggle("light", newTheme === "light")
  }

  const tabs = [
    { id: "im-alerts", label: "IM Alerts", icon: TrendingUp },
    { id: "im-hf-alerts", label: "IM-HF Alerts", icon: Activity },
    { id: "im-magic-alerts", label: "IM Magic Alerts", icon: BarChart3 },
    { id: "stock-list-filter", label: "Stock List Filter", icon: Clock },
  ] as const

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        {/* Replace custom sidebar with shadcn Sidebar component */}
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">IM Capital</span>
                <span className="truncate text-xs text-muted-foreground">Investment Management</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tabs.map((tab) => {
                    const Icon = tab.icon
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
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        {/* Replace main content div with SidebarInset */}
        <SidebarInset>
          {/* Header */}
          <header className="border-b border-border bg-gradient-to-r from-card via-card to-secondary/10 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <div className="text-center flex-1">
                  <h1 className="text-3xl font-bold text-foreground text-balance">IM-Live Alerts Dashboard</h1>
                  <p className="text-sm text-muted-foreground mt-1">Real-time market intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-secondary/20 rounded-lg px-2 py-2">
                  <div
                    className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-green-500 animate-pulse" : "bg-muted"}`}
                  ></div>
                  <label htmlFor="auto-refresh" className="text-sm font-medium text-foreground cursor-pointer">
                    Auto-refresh
                  </label>
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted data-[state=unchecked]:border data-[state=unchecked]:border-border"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-card/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-border/50"
                >
                  Manual Refresh
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-auto p-2 bg-secondary/20 rounded-lg hover:bg-secondary/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-xs">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border border-background"></div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Portfolio Manager</p>
                        <p className="text-xs leading-none text-muted-foreground">manager@imcapital.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer hover:bg-secondary/50">
                      {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                      <span>{theme === "dark" ? "Light" : "Dark"} Theme</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-secondary/50 text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Controls */}
          <div className="px-6 py-4 bg-card/30 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Time Interval</span>
                  <Select value={timeInterval} onValueChange={setTimeInterval}>
                    <SelectTrigger className="w-44 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="09:00-10:30">09:00-10:30</SelectItem>
                      <SelectItem value="10:30-12:00">10:30-12:00</SelectItem>
                      <SelectItem value="12:00-14:00">12:00-14:00</SelectItem>
                      <SelectItem value="14:00-15:30">14:00-15:30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-secondary/10 rounded-lg px-4 py-2 border border-border/50">
                <span className="text-sm font-medium text-foreground">Nifty 50 Filter</span>
                <Switch
                  checked={nifty50Enabled}
                  onCheckedChange={setNifty50Enabled}
                  className="data-[state=checked]:bg-primary"
                />
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    nifty50Enabled
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted/30 text-foreground border border-border"
                  }`}
                >
                  {nifty50Enabled ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <FilterControls activeTab={activeTab} />

          {/* Table Content */}
          <div className="px-6 py-6">
            <Card className="overflow-hidden border-border/50 shadow-2xl bg-card/80 backdrop-blur-sm">
              <IMTable activeTab={activeTab} />
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
