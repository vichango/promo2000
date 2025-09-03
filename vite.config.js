import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/promo2000/',
    plugins: [vue()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        watch: {
            usePolling: true
        }
    },
    preview: {
        host: '0.0.0.0',
        port: 4173
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    }
})
