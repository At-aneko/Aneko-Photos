<template>
  <footer class="gallery-footer">
    <p>
      <span class="footer-brand">{{ siteConfig.brand }}</span>
      <span class="footer-dot"></span>
      <span>&copy; {{ siteConfig.currentYear }} {{ siteConfig.brand }}</span>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { siteConfig } from '@/config/site'
</script>

<style scoped>
.gallery-footer {
  padding: 32px 20px 48px;
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  letter-spacing: 2px;
  opacity: 0;
  animation: footerFadeIn 1.2s ease-out 0.3s forwards;
}

.gallery-footer p {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-weight: 300;
}

.footer-brand {
  color: var(--accent);
  font-weight: 400;
}

.footer-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(139, 111, 71, 0.4);
}

@keyframes footerFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
