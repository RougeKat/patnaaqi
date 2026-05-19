import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Set base to the GitHub repository name for GitHub Pages deployment.
  // All asset paths will be prefixed with /patnaaqi/ in the production build.
  base: '/patnaaqi/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
