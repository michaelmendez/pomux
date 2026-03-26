import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pomux',
        short_name: 'Pomux',
        description: 'Stay focused with the Pomodoro Technique. Built-in lofi radio, session tracking, motivational quotes, and offline support.',
        theme_color: '#4021a9',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'favicon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: 'web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
    cloudflare()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/quote': {
        target: 'https://zenquotes.io',
        changeOrigin: true,
        rewrite: () => '/api/quotes/random?limit=20',
      },
    },
  },
})