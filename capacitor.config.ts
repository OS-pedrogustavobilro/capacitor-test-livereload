import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'capacitor-test-livereload',
  webDir: 'dist',
  server: {
    allowNavigation: [
      '*.ngrok-free.dev'
    ]
  }
};

export default config;
