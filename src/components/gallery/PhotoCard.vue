<template>
  <article class="card" :class="{ loaded }" data-masonry-card>
    <button class="card-button" type="button" @click="$emit('open')">
      <span class="card-img-wrap">
        <img
          :src="cover"
          :alt="photo.description || photo.title"
          :loading="priority ? 'eager' : 'lazy'"
          :fetchpriority="priority ? 'high' : 'auto'"
          sizes="(max-width: 380px) calc(100vw - 20px), (max-width: 600px) calc((100vw - 20px) / 2), (max-width: 900px) calc((100vw - 32px) / 3), calc((100vw - 40px) / 4)"
          decoding="async"
          @load="$emit('loaded')"
          @error="$emit('loaded')"
        />
        <span v-if="!loaded" class="card-skeleton">
          <span class="skeleton-shimmer"></span>
        </span>
      </span>

      <span v-if="loaded" class="card-overlay">
        <span v-if="photo.date" class="card-date">{{ photo.date }}</span>
        <span v-if="photo.description" class="card-desc">{{ photo.description }}</span>
      </span>
    </button>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Photo } from '@/features/gallery/types'

const props = defineProps<{
  photo: Photo
  loaded: boolean
  priority?: boolean
}>()

defineEmits<{
  loaded: []
  open: []
}>()

const cover = computed(() => props.photo.images[0]?.img || '')
</script>

<style scoped>
.card {
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
  border-radius: 8px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card:hover {
  transform: translateY(-4px);
}

.card-button {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  text-align: left;
}

.card-img-wrap {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background: #eeeeee;
}

.card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transition: filter 0.4s ease;
  user-select: none;
  -webkit-user-drag: none;
}

.card:hover img {
  filter: brightness(0.7);
}

.card-skeleton {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #eeeeee;
  border-radius: 8px;
}

.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, #eeeeee 30%, #e0e0e0 50%, #eeeeee 70%);
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}

.card-overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 40px 14px 14px;
  pointer-events: none;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  border-radius: 0 0 8px 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .card-overlay,
.card-button:focus-visible .card-overlay {
  opacity: 1;
}

.card-date {
  font-size: 11px;
  font-weight: 500;
  color: var(--accent);
  letter-spacing: 1px;
}

.card-desc {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.86);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
