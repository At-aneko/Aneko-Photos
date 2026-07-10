<template>
  <Teleport to="body">
    <Transition name="zoom">
      <div v-if="open" class="lightbox" @click="$emit('close')">
        <div class="lightbox-wrap">
          <button
            class="lb-nav lb-prev"
            :class="{ 'lb-nav--disabled': !hasPrevious }"
            type="button"
            :disabled="!hasPrevious"
            aria-label="上一张"
            @click.stop="$emit('previous')"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div class="lb-body">
            <div class="lb-img-wrap" @click.stop>
              <img
                :key="renderKey"
                :src="image?.img"
                :alt="photo?.description || photo?.title"
                class="lb-img"
                loading="eager"
                fetchpriority="high"
                sizes="100vw"
                decoding="async"
              />
            </div>

            <div class="lb-side" @click.stop>
              <div class="lb-actions">
                <button class="lb-btn" type="button" aria-label="分享" @click="$emit('share')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>分享</span>
                </button>

                <button class="lb-btn" type="button" aria-label="原图" @click="$emit('viewOriginal')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>原图</span>
                </button>

                <button class="lb-btn" type="button" aria-label="保存" @click="$emit('download')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>

          <button
            class="lb-nav lb-next"
            :class="{ 'lb-nav--disabled': !hasNext }"
            type="button"
            :disabled="!hasNext"
            aria-label="下一张"
            @click.stop="$emit('next')"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <Transition name="toast-fade">
          <div v-if="toastMessage" class="lb-toast">{{ toastMessage }}</div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Photo, PhotoImage } from '@/features/gallery/types'

defineProps<{
  open: boolean
  photo: Photo | null
  image?: PhotoImage
  renderKey: number
  hasPrevious: boolean
  hasNext: boolean
  toastMessage: string
}>()

defineEmits<{
  close: []
  previous: []
  next: []
  share: []
  viewOriginal: []
  download: []
}>()
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.96);
  cursor: pointer;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.lightbox-wrap {
  position: relative;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 48px;
  column-gap: 16px;
  align-items: center;
  justify-content: center;
  width: min(96vw, 1280px);
  max-height: 94vh;
}

.lb-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: center;
  min-width: 0;
  width: fit-content;
  max-width: 100%;
  gap: 20px;
  padding: 16px;
}

.lb-img-wrap {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
}

.lb-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.8);
  cursor: default;
  user-select: none;
  animation: lbFadeIn 0.3s ease-out;
  -webkit-user-drag: none;
}

.lb-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 120px;
}

.lb-nav {
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.lb-nav:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transform: scale(1.08);
}

.lb-nav:active {
  transform: scale(0.95);
}

.lb-nav:disabled,
.lb-nav--disabled {
  cursor: default;
  opacity: 0.2;
  pointer-events: none;
}

.lb-prev {
  grid-column: 1;
}

.lb-next {
  grid-column: 3;
}

.lb-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
  max-width: 100%;
}

.lb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.5px;
  white-space: nowrap;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.lb-btn:hover {
  color: var(--accent);
  background: rgba(139, 111, 71, 0.2);
  border-color: rgba(139, 111, 71, 0.4);
}

.lb-btn:active {
  transform: scale(0.97);
}

.lb-btn svg {
  flex-shrink: 0;
}

.lb-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  z-index: 10000;
  padding: 10px 24px;
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  transform: translateX(-50%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.zoom-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.zoom-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media screen and (min-width: 769px) {
  .lb-body {
    grid-column: 2;
    flex-direction: row;
    gap: 32px;
  }

  .lb-side {
    flex: 0 0 auto;
  }

  .lb-img {
    max-width: 100%;
    max-height: 86vh;
  }
}

@media screen and (max-width: 768px) {
  .lightbox-wrap {
    grid-template-columns: 40px minmax(0, 1fr) 40px;
    column-gap: 8px;
    width: min(100vw, 720px);
  }

  .lb-nav {
    width: 40px;
    height: 40px;
  }

  .lb-actions {
    flex-direction: row;
    min-width: auto;
    max-width: 100%;
    gap: 12px;
  }
}

@media screen and (max-width: 520px) {
  .lb-actions {
    width: min(100%, 320px);
  }

  .lb-btn {
    flex: 1;
    min-width: 0;
    gap: 6px;
    padding-inline: 8px;
    font-size: 12px;
  }
}

@keyframes lbFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
