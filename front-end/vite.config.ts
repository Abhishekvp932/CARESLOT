import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
export default defineConfig({
 server:{
  port:2025,
 },
 plugins:[tailwindcss()],
 resolve:{
    alias:{
        "@":path.resolve(__dirname,"./src"),
    },
 },
})
