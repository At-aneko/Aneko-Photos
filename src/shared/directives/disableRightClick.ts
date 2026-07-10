import type { Directive } from 'vue'

const handlers = new WeakMap<HTMLElement, EventListener>()

const disableRightClick: Directive<HTMLElement> = {
  mounted(el) {
    const handler = (event: Event) => event.preventDefault()
    handlers.set(el, handler)
    el.addEventListener('contextmenu', handler)
  },
  unmounted(el) {
    const handler = handlers.get(el)
    if (!handler) return
    el.removeEventListener('contextmenu', handler)
    handlers.delete(el)
  },
}

export default disableRightClick
