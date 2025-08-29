import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireRoleProps {
  children: ReactNode;
  allowed: ('admin' | 'gestor' | 'colaborador')[];
  redirectTo?: string;
}

export function RequireRole({ children, allowed, redirectTo = '/' }: RequireRoleProps) {
  const { profile, isLoading, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if user doesn't have required role
  if (!profile || !allowed.includes(profile.role)) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-muted-foreground">
            Perfil atual: <strong>{profile?.role || 'Não definido'}</strong>
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Convenience components for common role combinations
export function RequireAdmin({ children }: { children: ReactNode }) {
  return <RequireRole allowed={['admin']}>{children}</RequireRole>;
}

export function RequireAdminOrGestor({ children }: { children: ReactNode }) {
  return <RequireRole allowed={['admin', 'gestor']}>{children}</RequireRole>;
}