import { defineConfig } from 'vite';

export default defineConfig({
    base: './',  // Usar rutas relativas para los recursos estáticos
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        assetsInclude: ['**/*.mp3'],  // Asegúrate de que los archivos mp3 se manejen correctamente
    },
    server: {
        port: 8080
    }
});
