import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'gestor' | 'colaborador';
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setProfile: (profile) => set({ profile }),

      setSession: (session) => set({ 
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user
      }),

      setLoading: (isLoading) => set({ isLoading }),

      signOut: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          profile: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      loadProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
            return;
          }

          set({ profile: profile as UserProfile });
        } catch (error) {
          console.error('Error in loadProfile:', error);
        }
      },

      initialize: async () => {
        set({ isLoading: true });

        try {
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            set({ isLoading: false });
            return;
          }

          if (session) {
            set({
              session,
              user: session.user,
              isAuthenticated: true
            });

            // Load user profile
            await get().loadProfile();
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            set({
              session,
              user: session?.user || null,
              isAuthenticated: !!session?.user
            });

            if (session?.user) {
              await get().loadProfile();
            } else {
              set({ profile: null });
            }
          });

        } catch (error) {
          console.error('Error initializing auth:', error);
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist essential data, not loading states
        session: state.session,
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);