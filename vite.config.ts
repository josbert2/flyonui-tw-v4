import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { FullReload } from 'vite-plugin-full-reload';


export default defineConfig({
  plugins: [
    tailwindcss(),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/includes'),
    }),
    FullReload(['src/views/**/*.html', 'dist/css/proveedor.css']),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        'planes-lista': resolve(__dirname, 'src/views/planes/lista.html'),
   
      },
    },
  },
  server: {
    open: 'public/index.html',
    watch: {
      usePolling: true, // Asegura que los cambios se detecten en sistemas de archivos virtuales o remotos.
    },
  },
  FullReload(['dist/css/proveedor.css']),
});