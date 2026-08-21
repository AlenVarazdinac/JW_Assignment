export function useClickOutside (rootEl: Ref<HTMLElement | null>, onOutside: () => void) {
  function handleClick (event: MouseEvent) {
    if (!rootEl.value?.contains(event.target as Node)) onOutside()
  }

  onMounted(() => document.addEventListener('click', handleClick))
  onUnmounted(() => document.removeEventListener('click', handleClick))
}
