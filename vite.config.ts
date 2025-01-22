import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

export default defineConfig({
    resolve: {
        alias: {
            '@': _resolve('src'),
            '@Cubism4/framework': _resolve('./Cubism4/Framework/src'),
            '@Cubism2/framework': _resolve('./Cubism2/Framework/src'),
        },
    },
    plugins: [react()],
});
