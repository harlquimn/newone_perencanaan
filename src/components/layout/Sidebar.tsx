import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Database,
  FileText,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
  expanded?: boolean;
  onNavigate?: (path: string) => void;
  activePath?: string;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Master Data",
    icon: Database,
    path: "/master-data",
  },
  {
    name: "Renstra",
    icon: FileText,
    path: "/renstra",
  },
  {
    name: "Renja",
    icon: Calendar,
    path: "/renja",
  },
];

const Sidebar = ({
  className = "",
  expanded = true,
  onNavigate = () => {},
  activePath = "/dashboard",
}: SidebarProps) => {
  return (
    <div
      className={cn(
        "h-full bg-white border-r transition-all duration-300 flex flex-col",
        expanded ? "w-[280px]" : "w-[80px]",
        className,
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h1
          className={cn(
            "font-semibold transition-all duration-300 overflow-hidden",
            expanded ? "w-auto" : "w-0",
          )}
        >
          DPUPR PRKP
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className={cn("transition-transform", !expanded && "rotate-180")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <TooltipProvider>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activePath === item.path ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        !expanded && "justify-center",
                      )}
                      onClick={() => onNavigate(item.path)}
                    >
                      <item.icon className="h-5 w-5" />
                      {expanded && <span className="ml-3">{item.name}</span>}
                    </Button>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </nav>

      <div className="p-4 border-t">
        <div
          className={cn(
            "text-sm text-gray-500 transition-all duration-300",
            !expanded && "hidden",
          )}
        >
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
