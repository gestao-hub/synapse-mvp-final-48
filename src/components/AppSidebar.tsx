import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronRight, BarChart3, TrendingUp, Users, GraduationCap, Building2, Upload, Clock, LogOut } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/authStore";

// Default scenario counts for fallback
const defaultScenarioCounts = {
  comercial: 8,
  rh: 10, 
  educacional: 8,
  gestao: 8
};

const navigationItems = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: BarChart3,
    description: "Visão geral e métricas",
    fullDescription: "Visão geral completa das suas métricas de performance e evolução"
  },
  {
    title: "Comercial",
    url: "/app/comercial", 
    icon: TrendingUp,
    area: "comercial" as keyof typeof defaultScenarioCounts,
    baseDescription: "cenários de vendas",
    fullDescription: "cenários especializados em vendas consultivas, negociação e relacionamento comercial"
  },
  {
    title: "RH",
    url: "/app/rh",
    icon: Users,
    area: "rh" as keyof typeof defaultScenarioCounts,
    baseDescription: "cenários de RH", 
    fullDescription: "cenários de recursos humanos incluindo entrevistas, feedbacks e gestão de pessoas"
  },
  {
    title: "Educacional",
    url: "/app/educacional",
    icon: GraduationCap,
    area: "educacional" as keyof typeof defaultScenarioCounts,
    baseDescription: "cenários de ensino",
    fullDescription: "cenários educacionais para desenvolvimento de habilidades didáticas e pedagógicas"
  },
  {
    title: "Gestão",
    url: "/app/gestao", 
    icon: Building2,
    area: "gestao" as keyof typeof defaultScenarioCounts,
    baseDescription: "cenários de liderança",
    fullDescription: "cenários de gestão estratégica focados em liderança executiva e tomada de decisão"
  },
  {
    title: "Uploads",
    url: "/app/uploads",
    icon: Upload,
    description: "Treinar IA com materiais",
    fullDescription: "Treine a IA com seus próprios materiais de vendas, recursos e conhecimento"
  },
  {
    title: "Histórico",
    url: "/app/historico", 
    icon: Clock,
    description: "Análise e evolução",
    fullDescription: "Análise completa das suas simulações e evolução de performance"
  }
];

export function AppSidebar() {
  const [scenarioCounts] = useState(defaultScenarioCounts);
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuthStore();

  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === "/app/dashboard") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-border/40" collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-6 border-b border-border/40">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center shadow-lg">
              <img src="/lovable-uploads/c5aad7b3-7588-4d0d-9c3e-0da48c27d366.png" alt="Excluvia" className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Excluv.ia
              </h2>
              <p className="text-sm text-muted-foreground font-medium">AI Training Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center shadow-lg">
            <img src="/lovable-uploads/c5aad7b3-7588-4d0d-9c3e-0da48c27d366.png" alt="Excluvia" className="w-6 h-6" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "px-4 pb-4 -mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"}>
            NAVEGAÇÃO PRINCIPAL
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="space-y-2">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild className="h-auto p-0">
                          <NavLink 
                            to={item.url} 
                            className={`
                              group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out
                              border border-transparent hover:border-border/60
                              ${isActive(item.url) 
                                ? "bg-gradient-to-r from-primary/10 via-purple-500/5 to-secondary/10 text-primary border-primary/20 shadow-md shadow-primary/10" 
                                : "hover:bg-muted/60 text-muted-foreground hover:text-foreground hover:shadow-sm"
                              }
                            `}
                          >
                            <div className={`
                              p-2 rounded-lg transition-all duration-300 flex-shrink-0
                              ${isActive(item.url) ? "bg-primary/15 text-primary shadow-sm" : "group-hover:bg-primary/10 group-hover:text-primary"}
                            `}>
                              <item.icon className="h-5 w-5" />
                            </div>
                            
                            {!collapsed && (
                              <div className="flex-1 min-w-0">
                                <div className={`font-semibold text-sm transition-colors ${isActive(item.url) ? "text-primary" : "group-hover:text-foreground"}`}>
                                  {item.title}
                                </div>
                                <div className="text-xs text-muted-foreground truncate mt-1 leading-relaxed">
                                  {item.area 
                                    ? `${scenarioCounts[item.area]} ${item.baseDescription}`
                                    : item.description
                                  }
                                </div>
                              </div>
                            )}
                            
                            {!collapsed && isActive(item.url) && (
                              <div className="flex-shrink-0">
                                <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
                              </div>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.fullDescription}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}