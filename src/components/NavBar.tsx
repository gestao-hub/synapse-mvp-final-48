'use client'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const allLinks = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'gestor'] },
  { href: '/simulacao/rh', label: 'RH', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/simulacao/educacional', label: 'Educacional', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/simulacao/gestao', label: 'Gestão', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/rh-live', label: 'RH Live', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/comercial-live', label: 'Comercial Live', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/educacional-live', label: 'Educacional Live', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/uploads', label: 'Uploads', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/historico', label: 'Histórico', roles: ['admin', 'gestor', 'colaborador'] },
  { href: '/admin/scenarios', label: 'Cenários', roles: ['admin', 'gestor'] },
]

export default function NavBar() {
  const location = useLocation()
  const { profile, isAuthenticated, signOut } = useAuthStore()
  
  // Filter links based on user role
  const visibleLinks = allLinks.filter(link => 
    !profile?.role || link.roles.includes(profile.role)
  )
  
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-deep-black/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/1d200d09-b793-4be8-b565-c11a2585a9e4.png" alt="Excluv.ia" className="w-8 h-8" />
          <span className="font-cal text-sm opacity-80">by Excluv.ia</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-3">
          {visibleLinks.map(l => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-3 py-2 rounded-xl transition ${
                location.pathname?.startsWith(l.href) ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        
        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated && profile ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">{profile.display_name || profile.email}</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {profile.role}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="text-white/80 border-white/20 hover:bg-white/10"
              >
                Sair
              </Button>
            </div>
          ) : (
            null
          )}
        </div>
      </div>
    </header>
  )
}