import { ref } from 'vue'
import { getDownloadURL } from '@/features/gallery/services/photoService'
import type { PhotoImage } from '@/features/gallery/types'

export function useGalleryActions() {
  const toastMessage = ref('')
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function showToast(message: string) {
    if (toastTimer) clearTimeout(toastTimer)
    toastMessage.value = message
    toastTimer = setTimeout(() => {
      toastMessage.value = ''
    }, 2000)
  }

  async function shareImage(image?: PhotoImage) {
    if (!image?.img) return

    try {
      await navigator.clipboard.writeText(image.img)
      showToast('链接已复制到剪贴板')
    } catch {
      showToast('复制失败，请重试')
    }
  }

  function viewOriginal(image?: PhotoImage) {
    if (image?.img) window.open(image.img, '_blank', 'noopener,noreferrer')
  }

  function downloadImage(image?: PhotoImage) {
    if (!image?.img) return

    const anchor = document.createElement('a')
    anchor.href = getDownloadURL(image.img)
    anchor.download = image.img.split('/').pop() || 'image.jpg'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  function destroy() {
    if (toastTimer) clearTimeout(toastTimer)
  }

  return {
    toastMessage,
    shareImage,
    viewOriginal,
    downloadImage,
    destroy,
  }
}
