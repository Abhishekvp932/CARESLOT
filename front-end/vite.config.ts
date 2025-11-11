import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
export default defineConfig({
  base:'./',
 server:{
  port:2025,
   strictPort: true,
 },
 plugins:[tailwindcss()],
 resolve:{
    alias:{
        "@":path.resolve(__dirname,"./src"),
    },
 },
})
