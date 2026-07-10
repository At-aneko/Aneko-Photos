<template>
  <header class="gallery-header">
    <div class="header-brand">
      <span class="header-logo">{{ siteConfig.brand }}</span>
      <span class="header-divider"></span>
      <span class="header-sub">{{ siteConfig.productName }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { siteConfig } from '@/config/site'
</script>

<style scoped>
.gallery-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  min-height: 56px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(18px, 3.5vw, 24px);
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 3px;
}

.header-divider {
  width: 1px;
  height: 16px;
  background: rgba(0, 0, 0, 0.12);
}

.header-sub {
  font-size: clamp(12px, 2vw, 15px);
  font-weight: 300;
  color: var(--text-secondary);
  letter-spacing: 4px;
}
</style>
