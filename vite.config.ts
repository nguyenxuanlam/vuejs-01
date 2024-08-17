import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/services/api', import.meta.url)),
      '@locales': fileURLToPath(new URL('./locales', import.meta.url))
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      dts: 'types/components.d.ts',
      resolvers: [NaiveUiResolver()]
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': ['useUrlSearchParams', 'useDebounceFn', 'useEventBus']
        },
        {
          '@iconify/vue': ['Icon']
        },
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        },
        {
          zod: [['z', 'zod']]
        }
      ],
      dts: 'types/auto-imports.d.ts',
      dirs: ['src/composables/**', 'src/stores/**', 'src/services/api/**'],
      vueTemplate: true
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './locales/**')
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          naiveUI: ['naive-ui'],
          lodash: ['lodash', 'lodash-es'],
          vue: ['vue']
        }
      }
    }
  }
})
