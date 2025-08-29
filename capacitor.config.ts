import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8b4f10c2600c410095f3b1e7f79fcb33',
  appName: 'synapse-atual-funcional-94',
  webDir: 'dist',
  server: {
    url: "https://8b4f10c2-600c-4100-95f3-b1e7f79fcb33.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000131",
      showSpinner: false
    }
  }
};

export default config;