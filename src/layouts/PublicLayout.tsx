import { Outlet, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export function PublicLayout() {
  return <div className="min-h-screen bg-midnight text-white">
      {/* Header - exact replication from reference */}
      <header className="border-b border-white/10 bg-[#1a1b3e]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center">
          {/* Logo excluv.ia corporate - exact styling */}
          <div className="flex items-center">
            <img src="/lovable-uploads/82c16bce-21ab-4d7f-96b0-94d72a867a2e.png" alt="Excluv.ia Corporate" className="h-48" />
          </div>

          {/* Central Navigation - centered */}
          <nav className="hidden md:flex items-center space-x-8 font-cal flex-1 justify-center">
            <Link to="/" className="text-sm text-spring hover:text-spring/80 transition-colors">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm text-white/70 hover:text-spring transition-colors focus:outline-none">
                Produtos
                <ChevronDown className="ml-1 h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64 bg-[#1e1e2e] border border-white/10 shadow-xl z-50 p-2 rounded-lg font-cal">
                {/* Synapse Header - destaque principal */}
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] text-white hover:from-[#00c8ee] hover:to-[#0096bb] transition-all duration-200">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    Synapse
                    <ChevronDown className="ml-auto h-3 w-3 rotate-90" />
                  </Link>
                </DropdownMenuItem>
                
                {/* Produtos específicos */}
                <div className="mt-2 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/synapse-comercial" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-lg">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      Synapse Comercial
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/synapse-rh" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-lg">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      Synapse RH
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/synapse-educacional" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-lg">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
                        </svg>
                      </div>
                      Synapse Educacional
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/synapse-gestao" className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-lg">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Synapse Gestão
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contato" className="text-sm text-white/70 hover:text-spring transition-colors">
              Contato
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-16 mt-20">
        <div className="container mx-auto px-4 flex items-center justify-center gap-3 text-sm text-white/60">
          
          <span>Synapse by Excluv.ia • 2025</span>
        </div>
      </footer>

      
    </div>;
}