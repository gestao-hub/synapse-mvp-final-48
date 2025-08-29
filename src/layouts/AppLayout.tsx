import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-background">
        <div className="flex w-full">
          <AppSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <header className="h-16 flex items-center border-b border-border/50 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
              <SidebarTrigger className="hover:bg-muted p-2 rounded-lg transition-colors" />
              <div className="ml-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Excluv.ia
                </h1>
                <p className="text-xs text-muted-foreground">AI Training Platform</p>
              </div>
            </header>
            <main className="flex-1 p-6 overflow-auto bg-background">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}