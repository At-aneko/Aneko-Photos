<template>
  <div class="state" :class="`state--${kind}`">
    <div v-if="kind === 'loading'" class="loader"></div>

    <svg
      v-else
      class="state-icon"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>

    <p class="state-text">{{ message }}</p>
    <button v-if="kind === 'error'" class="retry" type="button" @click="$emit('retry')">
      Retry
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  kind: 'loading' | 'empty' | 'error'
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.loader {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(139, 111, 71, 0.15);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.state-icon {
  color: rgba(139, 111, 71, 0.62);
}

.state-text {
  margin: 0;
  font-size: 14px;
  font-weight: 300;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.state--loading .state-text {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 2px;
}

.retry {
  min-width: 96px;
  margin-top: 8px;
  padding: 8px 24px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(139, 111, 71, 0.3);
  border-radius: 6px;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.retry:hover {
  background: rgba(139, 111, 71, 0.08);
  border-color: rgba(139, 111, 71, 0.6);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
