import { nextTick } from 'vue'

export function useMasonry() {
  let resizeObserver: ResizeObserver | null = null
  let frameId: number | null = null

  function recalc(root: HTMLElement | null) {
    if (!root) return

    const cards = root.querySelectorAll<HTMLElement>('[data-masonry-card]')
    if (!cards.length) return

    const columnWidth = cards[0].offsetWidth
    if (columnWidth <= 0) return

    for (const card of cards) {
      const image = card.querySelector('img')
      const ratio = image?.naturalWidth ? image.naturalHeight / image.naturalWidth : 0.75
      card.style.gridRowEnd = `span ${Math.max(1, Math.ceil(columnWidth * ratio))}`
    }
  }

  function schedule(root: HTMLElement | null) {
    if (typeof window === 'undefined') return
    if (frameId !== null) window.cancelAnimationFrame(frameId)

    frameId = window.requestAnimationFrame(() => {
      frameId = null
      recalc(root)
    })
  }

  function observe(root: HTMLElement | null) {
    resizeObserver?.disconnect()
    if (!root) return

    if (typeof ResizeObserver === 'undefined') {
      schedule(root)
      return
    }

    resizeObserver = new ResizeObserver(() => schedule(root))
    resizeObserver.observe(root)
    nextTick(() => schedule(root))
  }

  function destroy() {
    if (frameId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(frameId)
    }
    frameId = null
    resizeObserver?.disconnect()
    resizeObserver = null
  }

  return {
    observe,
    recalc,
    schedule,
    destroy,
  }
}
