import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig(({ command}) => {
  const config = {
    plugins: [react()],
    base: "/",
    build: {
      target: 'esnext',
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }

  if (command !== "serve") {
    config.base = "/removebgtest/";
  }

  return config;
})
