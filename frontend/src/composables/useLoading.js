import { ref } from 'vue'

const isLoading = ref(false)
const message = ref('')

export function useLoading() {
  const show = (msg = '') => {
    message.value = msg
    isLoading.value = true
    try { console.debug('[useLoading] show()', { msg }) } catch {}
  }
  const hide = () => {
    isLoading.value = false
    message.value = ''
    try { console.debug('[useLoading] hide()') } catch {}
  }
  // Expose for manual testing in console
  if (typeof window !== 'undefined') {
    window.__appLoading = { show, hide, isLoading, message }
  }
  return { isLoading, message, show, hide }
}
