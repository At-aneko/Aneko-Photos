import { computed, ref, type Ref } from 'vue'
import type { Photo, PhotoImage } from '@/features/gallery/types'

interface LightboxImage {
  photo: Photo
  image: PhotoImage
  imageIndex: number
}

export function useLightbox(photos: Ref<Photo[]>) {
  const isOpen = ref(false)
  const activeImageListIndex = ref(-1)
  const renderKey = ref(0)
  const preloadedImages = new Set<string>()

  const flatImages = computed<LightboxImage[]>(() =>
    photos.value.flatMap((photo) =>
      photo.images.map((image, imageIndex) => ({
        photo,
        image,
        imageIndex,
      })),
    ),
  )

  const activeEntry = computed(() => flatImages.value[activeImageListIndex.value])
  const activePhoto = computed(() => activeEntry.value?.photo ?? null)
  const activeImage = computed(() => activeEntry.value?.image)

  const hasPrevious = computed(() =>
    Boolean(activeEntry.value) && activeImageListIndex.value > 0,
  )

  const hasNext = computed(() =>
    Boolean(activeEntry.value) && activeImageListIndex.value < flatImages.value.length - 1,
  )

  function open(photo: Photo, imageIndex = 0) {
    const nextIndex = findImageListIndex(photo, imageIndex)
    if (nextIndex === -1) return

    activeImageListIndex.value = nextIndex
    renderKey.value += 1
    isOpen.value = true
    preloadAdjacentImages()
  }

  function close() {
    isOpen.value = false
    activeImageListIndex.value = -1
  }

  function previous() {
    move(-1)
  }

  function next() {
    move(1)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen.value) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }

  function move(direction: -1 | 1) {
    const nextIndex = activeImageListIndex.value + direction
    if (nextIndex < 0 || nextIndex >= flatImages.value.length) return

    activeImageListIndex.value = nextIndex
    renderKey.value += 1
    preloadAdjacentImages()
  }

  function findImageListIndex(photo: Photo, requestedImageIndex: number) {
    const imageIndex = clampIndex(requestedImageIndex, photo.images.length)
    const requestedImage = photo.images[imageIndex]

    const byReference = flatImages.value.findIndex(
      (entry) => entry.photo === photo && entry.imageIndex === imageIndex,
    )
    if (byReference >= 0) return byReference

    const byPhotoAndIndex = flatImages.value.findIndex(
      (entry) => entry.photo.id === photo.id && entry.imageIndex === imageIndex,
    )
    if (byPhotoAndIndex >= 0) return byPhotoAndIndex

    if (!requestedImage?.img) return -1

    return flatImages.value.findIndex((entry) => entry.image.img === requestedImage.img)
  }

  function clampIndex(index: number, length: number) {
    if (length <= 0) return 0
    return Math.min(Math.max(index, 0), length - 1)
  }

  function getAdjacentImage(direction: -1 | 1) {
    return flatImages.value[activeImageListIndex.value + direction]?.image
  }

  function preloadAdjacentImages() {
    preloadImage(getAdjacentImage(-1)?.img)
    preloadImage(getAdjacentImage(1)?.img)
  }

  function preloadImage(url?: string) {
    if (!url || preloadedImages.has(url) || typeof Image === 'undefined') return

    preloadedImages.add(url)
    const image = new Image()
    image.decoding = 'async'
    image.src = url
  }

  return {
    isOpen,
    activePhoto,
    activeImage,
    renderKey,
    hasPrevious,
    hasNext,
    open,
    close,
    previous,
    next,
    handleKeydown,
  }
}
