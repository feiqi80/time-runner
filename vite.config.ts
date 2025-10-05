import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import eslintPlugin from "vite-plugin-eslint";


export default defineConfig(() => {  
  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true
      }),
      eslintPlugin(),
    ],
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'time-countdown',
        fileName: (format) => `time-countdown.${format}.js`
      },
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react/jsx-runtime": "jsxRuntime"
          }
        }
      }
    }
  }
})