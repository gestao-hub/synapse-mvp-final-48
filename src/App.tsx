import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { PublicLayout } from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

// Public pages
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import SynapseComercial from "./pages/SynapseComercial";
import SynapseRH from "./pages/SynapseRH";
import SynapseEducacional from "./pages/SynapseEducacional";
import SynapseGestao from "./pages/SynapseGestao";
import Recursos from "./pages/Recursos";
import Precos from "./pages/Precos";
import Login from "./pages/Login";

// Protected pages
import DashboardPage from "./pages/DashboardPage";
import ComercialPage from "./pages/ComercialPage";
import RhPage from "./pages/RhPage";
import EducacionalPage from "./pages/EducacionalPage";
import GestaoPage from "./pages/GestaoPage";
import Uploads from "./pages/Uploads";
import Historico from "./pages/Historico";
import SimulatePage from "./pages/SimulatePage";
import SetupGestaoScenarios from "./pages/SetupGestaoScenarios";
import SessionDetail from "./pages/SessionDetail";
import FeedbackConstrutivo from "./pages/sim/rh/FeedbackConstrutivo";

// Live call pages
import ComercialLivePage from "./pages/ComercialLivePage";
import RhLivePage from "./pages/RhLivePage";
import EducacionalLivePage from "./pages/EducacionalLivePage";
import GestaoLivePage from "./pages/GestaoLivePage";


import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="produtos" element={<Produtos />} />
              <Route path="sobre" element={<Sobre />} />
              <Route path="contato" element={<Contato />} />
              <Route path="synapse-comercial" element={<SynapseComercial />} />
              <Route path="synapse-rh" element={<SynapseRH />} />
              <Route path="synapse-educacional" element={<SynapseEducacional />} />
              <Route path="synapse-gestao" element={<SynapseGestao />} />
              <Route path="recursos" element={<Recursos />} />
              <Route path="precos" element={<Precos />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* Protected App Routes */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="comercial" element={<ComercialPage />} />
              <Route path="rh" element={<RhPage />} />
              <Route path="educacional" element={<EducacionalPage />} />
              <Route path="gestao" element={<GestaoPage />} />
              <Route path="uploads" element={<Uploads />} />
              <Route path="historico" element={<Historico />} />
              
              {/* Live call pages */}
              <Route path="comercial-live" element={<ComercialLivePage />} />
              <Route path="rh-live" element={<RhLivePage />} />
              <Route path="educacional-live" element={<EducacionalLivePage />} />
              <Route path="gestao-live" element={<GestaoLivePage />} />
              
              {/* Simulações específicas */}
              <Route path="sim/rh/feedback-construtivo" element={<FeedbackConstrutivo />} />
              <Route path="sim/comercial/venda-consultiva" element={<SimulatePage />} />
              <Route path="sim/educacional/aula-interativa" element={<SimulatePage />} />
              <Route path="sim/gestao/reuniao-estrategica" element={<SimulatePage />} />
              
              {/* Setup e configurações */}
              <Route path="setup-gestao" element={<SetupGestaoScenarios />} />
              
              {/* Detalhes de sessão */}
              <Route path="session/:type/:sessionId" element={<SessionDetail />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;