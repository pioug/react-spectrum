import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath} from 'node:url';

const internationalizedDateSource = fileURLToPath(new URL('../../packages/@internationalized/date/src/index.ts', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@internationalized/date': internationalizedDateSource
    }
  }
});
