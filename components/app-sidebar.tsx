"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TrendingUp,
  Activity,
  WandSparkles,
  BarChart3,
  ChevronsUpDown,
  Sun,
  Moon,
  Settings,
  LogOut,
} from "lucide-react";

type TabType =
  | "im-alerts"
  | "im-hf-alerts"
  | "im-magic-alerts"
  | "stock-list-filter";

function NavUser({
  user,
  theme,
  onThemeChange,
}: {
  user: { name: string; email: string; avatar: string };
  theme: "light" | "dark" | "system";
  onThemeChange: (mode: "light" | "dark" | "system") => void;
}) {
  const { isMobile, open } = useSidebar();
  console.log(open);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="navuser-btn p-2 group-data-[collapsible=icon]:!p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">PM</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">PM</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Theme
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(v) => onThemeChange(v as any)}
              >
                <DropdownMenuRadioItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({
  activeTab,
  onSelectTab,
  theme,
  onThemeChange,
}: {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  theme: "light" | "dark" | "system";
  onThemeChange: (mode: "light" | "dark" | "system") => void;
}) {
  const tabs = [
    { id: "im-alerts" as const, label: "IM Alerts", icon: TrendingUp },
    { id: "im-hf-alerts" as const, label: "IM-HF Alerts", icon: Activity },
    {
      id: "im-magic-alerts" as const,
      label: "IM Magic Alerts",
      icon: WandSparkles,
    },
  ];

  return (
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
                      onClick={() => onSelectTab(tab.id)}
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
        <NavUser
          user={{
            name: "Portfolio Manager",
            email: "manager@imcapital.com",
            avatar: "",
          }}
          theme={theme}
          onThemeChange={onThemeChange}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
