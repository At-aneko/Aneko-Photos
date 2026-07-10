import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import vue from '@astrojs/vue'

export default defineConfig({
  output: 'server',
  integrations: [vue()],
  adapter: cloudflare({
    sessionKVBindingName: 'KV',
    platformProxy: {
      enabled: true,
    },
  }),
})
