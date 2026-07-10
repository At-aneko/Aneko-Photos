<template>
  <div v-disable-right-click class="gallery-wrapper">
    <GalleryHeader />

    <main ref="scrollRootRef" class="gallery-content">
      <GalleryState
        v-if="status === 'loading'"
        kind="loading"
        message="Loading gallery..."
      />

      <GalleryState
        v-else-if="status === 'error'"
        kind="error"
        :message="errorMessage || 'Something went wrong'"
        @retry="refreshGallery"
      />

      <GalleryState
        v-else-if="status === 'empty'"
        kind="empty"
        message="No photos found"
      />

      <PhotoGrid
        v-show="status === 'ready'"
        ref="gridComponentRef"
        :photos="photos"
        :loaded-images="loadedImages"
        @image-loaded="handleImageLoaded"
        @open-photo="openLightbox"
      />

      <div v-if="hasMore" ref="sentinelRef" class="load-more-sentinel"></div>

      <div v-if="isLoadingMore" class="loading-more" aria-live="polite">
        <div class="loader-small"></div>
      </div>

      <div v-if="status === 'ready' && !hasMore && photos.length > 0" class="gallery-end">
        <div class="end-line"></div>
        <p class="end-text">You've explored every frame</p>
      </div>

      <GalleryFooter v-if="initialized" />
    </main>

    <LightboxOverlay
      :open="lightboxOpen"
      :photo="lightboxPhoto"
      :image="currentLightboxImage"
      :render-key="lightboxKey"
      :has-previous="hasPrevImage"
      :has-next="hasNextImage"
      :toast-message="toastMessage"
      @close="closeLightbox"
      @previous="prevImage"
      @next="nextImage"
      @share="shareImage(currentLightboxImage)"
      @view-original="viewOriginal(currentLightboxImage)"
      @download="downloadImage(currentLightboxImage)"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import GalleryFooter from '@/components/gallery/GalleryFooter.vue'
import GalleryHeader from '@/components/gallery/GalleryHeader.vue'
import GalleryState from '@/components/gallery/GalleryState.vue'
import LightboxOverlay from '@/components/gallery/LightboxOverlay.vue'
import PhotoGrid from '@/components/gallery/PhotoGrid.vue'
import { useGalleryActions } from '@/features/gallery/composables/useGalleryActions'
import { useGalleryFeed } from '@/features/gallery/composables/useGalleryFeed'
import { useLightbox } from '@/features/gallery/composables/useLightbox'
import { useMasonry } from '@/features/gallery/composables/useMasonry'
import type { Photo } from '@/features/gallery/types'
import disableRightClick from '@/shared/directives/disableRightClick'

const vDisableRightClick = disableRightClick

const scrollRootRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
const gridComponentRef = ref<InstanceType<typeof PhotoGrid> | null>(null)

const {
  status,
  errorMessage,
  photos,
  loadedImages,
  isLoadingMore,
  initialized,
  hasMore,
  loadInitial,
  markImageLoaded,
  observeMoreTrigger,
  destroy: destroyFeed,
  refresh,
} = useGalleryFeed()

const {
  isOpen: lightboxOpen,
  activePhoto: lightboxPhoto,
  activeImage: currentLightboxImage,
  renderKey: lightboxKey,
  hasPrevious: hasPrevImage,
  hasNext: hasNextImage,
  open: openLightbox,
  close: closeLightbox,
  previous: prevImage,
  next: nextImage,
  handleKeydown,
} = useLightbox(photos)

const {
  toastMessage,
  shareImage,
  viewOriginal,
  downloadImage,
  destroy: destroyActions,
} = useGalleryActions()

const masonry = useMasonry()

function getGridElement() {
  return gridComponentRef.value?.gridRef || null
}

function handleImageLoaded(index: number) {
  markImageLoaded(index)
  masonry.schedule(getGridElement())
}

async function bindScrollObserver() {
  await nextTick()
  observeMoreTrigger(sentinelRef.value, scrollRootRef.value)
  masonry.schedule(getGridElement())
}

async function refreshGallery() {
  await refresh()
  await bindScrollObserver()
  masonry.observe(getGridElement())
}

watch(
  () => [status.value, hasMore.value, photos.value.length],
  () => {
    bindScrollObserver()
  },
)

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  await loadInitial()
  await bindScrollObserver()
  masonry.observe(getGridElement())
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  destroyFeed()
  destroyActions()
  masonry.destroy()
})
</script>

<style scoped>
.gallery-wrapper {
  min-height: 100vh;
  background: #ffffff;
}

.gallery-content {
  height: calc(100vh - 56px);
  overflow-y: auto;
}

.load-more-sentinel {
  width: 100%;
  height: 1px;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.loader-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(139, 111, 71, 0.15);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.gallery-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 20px 24px;
}

.end-line {
  width: 40px;
  height: 1px;
  background: rgba(200, 169, 126, 0.3);
}

.end-text {
  margin: 0;
  font-size: 13px;
  font-weight: 300;
  color: #444444;
  letter-spacing: 2px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
