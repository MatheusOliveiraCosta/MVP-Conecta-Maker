import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativo: funciona em qualquer hospedagem estática (GitHub Pages, Netlify...)
export default defineConfig({ base: './', plugins: [react()] })
