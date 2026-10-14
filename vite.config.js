import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base path ensures assets load regardless of repository name or domain
export default defineConfig({
  plugins: [react()],
  base: './'
})
