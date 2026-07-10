import { computed, ref, shallowRef } from 'vue'
import { galleryConfig } from '@/config/site'
import { fetchPhotoFeed } from '@/features/gallery/services/photoService'
import type { GalleryStatus, Photo } from '@/features/gallery/types'

const INITIAL_READY_COUNT = 6
const WARM_NEXT_BATCH_COUNT = 4

export function useGalleryFeed() {
  const status = ref<GalleryStatus>('idle')
  const errorMessage = ref('')
  const allPhotos = shallowRef<Photo[]>([])
  const photos = shallowRef<Photo[]>([])
  const loadedImages = ref<boolean[]>([])
  const isLoadingMore = ref(false)
  const initialized = ref(false)

  let abortController: AbortController | null = null
  let observer: IntersectionObserver | null = null

  const hasMore = computed(() => photos.value.length < allPhotos.value.length)

  async function loadInitial() {
    abortController?.abort()
    abortController = new AbortController()

    status.value = 'loading'
    errorMessage.value = ''

    try {
      const feed = await fetchPhotoFeed(abortController.signal)
      allPhotos.value = feed
      photos.value = feed.slice(0, galleryConfig.batchSize)
      loadedImages.value = new Array(photos.value.length).fill(false)
      initialized.value = false
      status.value = photos.value.length ? 'ready' : 'empty'
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load photos'
    }
  }

  function loadMore() {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true

    try {
      const nextPhotos = allPhotos.value.slice(
        photos.value.length,
        photos.value.length + galleryConfig.batchSize,
      )

      if (!nextPhotos.length) return

      photos.value = [...photos.value, ...nextPhotos]
      loadedImages.value = [
        ...loadedImages.value,
        ...new Array(nextPhotos.length).fill(false),
      ]
      warmPhotoCovers(nextPhotos.slice(0, WARM_NEXT_BATCH_COUNT))
    } finally {
      isLoadingMore.value = false
    }
  }

  function markImageLoaded(index: number) {
    if (loadedImages.value[index]) return

    loadedImages.value[index] = true

    const readyThreshold = Math.min(INITIAL_READY_COUNT, photos.value.length) - 1
    if (readyThreshold >= 0 && index >= readyThreshold) initialized.value = true
  }

  function observeMoreTrigger(trigger: HTMLElement | null, scrollRoot?: HTMLElement | null) {
    observer?.disconnect()
    if (!trigger) return

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      {
        root: scrollRoot || null,
        rootMargin: '600px',
      },
    )
    observer.observe(trigger)
  }

  function destroy() {
    abortController?.abort()
    observer?.disconnect()
    observer = null
  }

  return {
    status,
    errorMessage,
    photos,
    loadedImages,
    isLoadingMore,
    initialized,
    hasMore,
    loadInitial,
    loadMore,
    markImageLoaded,
    observeMoreTrigger,
    destroy,
    refresh: loadInitial,
  }
}

function warmPhotoCovers(photos: Photo[]) {
  if (typeof window === 'undefined') return

  const urls = photos.map((photo) => photo.images[0]?.img).filter(Boolean) as string[]
  if (!urls.length) return

  const warm = () => {
    for (const url of urls) {
      const image = new window.Image()
      image.decoding = 'async'
      image.src = url
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warm, { timeout: 1000 })
  } else {
    window.setTimeout(warm, 0)
  }
}
