import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        monacoEditorPlugin.default({})
    ],
    server: {
        proxy: {
            '/endpoints': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/endpoints/, '')
            }
        }
    }
})
