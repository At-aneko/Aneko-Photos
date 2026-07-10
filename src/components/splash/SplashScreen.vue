<template>
  <div v-disable-right-click class="splash">
    <div class="splash-inner">
      <div class="logo-mark">
        <div class="logo-line"></div>
        <span class="logo-text">{{ siteConfig.brand }}</span>
        <div class="logo-line"></div>
      </div>
      <h1 class="brand-name">{{ siteConfig.productName }}</h1>
      <p class="tagline">Every frame tells a story</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { siteConfig } from '@/config/site'
import disableRightClick from '@/shared/directives/disableRightClick'

const vDisableRightClick = disableRightClick
let redirectTimer: ReturnType<typeof window.setTimeout> | undefined

onMounted(() => {
  redirectTimer = window.setTimeout(() => {
    window.location.assign('/gallery')
  }, siteConfig.splashDurationMs)
})

onUnmounted(() => {
  if (redirectTimer) window.clearTimeout(redirectTimer)
})
</script>

<style scoped>
.splash {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
  touch-action: none;
}

.splash-inner {
  text-align: center;
  animation: fadeInUp 0.8s ease-out both;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.logo-line {
  width: 40px;
  height: 1px;
  background: var(--accent);
  opacity: 0;
  animation: expandLine 0.6s ease-out 0.3s both;
}

.logo-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 8px;
}

.brand-name {
  margin: 8px 0 0;
  font-size: clamp(14px, 2.5vw, 18px);
  font-weight: 300;
  color: var(--text-secondary);
  letter-spacing: 12px;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeIn 0.6s ease-out 0.5s both;
}

.tagline {
  margin: 20px 0 0;
  font-size: clamp(11px, 1.8vw, 13px);
  font-weight: 300;
  color: #444444;
  letter-spacing: 3px;
  opacity: 0;
  animation: fadeIn 0.6s ease-out 0.8s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes expandLine {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 40px;
    opacity: 1;
  }
}
</style>
