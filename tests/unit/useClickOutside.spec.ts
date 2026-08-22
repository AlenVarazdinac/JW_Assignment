import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref } from 'vue'

function createHost (onOutside: () => void) {
  return defineComponent({
    setup () {
      const rootEl = ref<HTMLElement | null>(null)
      useClickOutside(rootEl, onOutside)
      return () =>
        h('div', [
          h('div', { ref: rootEl, class: 'inside' }, 'inside'),
          h('div', { class: 'outside' }, 'outside')
        ])
    }
  })
}

describe('useClickOutside', () => {
  it('does not call the callback when clicking inside the root element', async () => {
    const onOutside = vi.fn()
    const wrapper = await mountSuspended(createHost(onOutside), { attachTo: document.body })

    await wrapper.find('.inside').trigger('click')

    expect(onOutside).not.toHaveBeenCalled()
  })

  it('calls the callback when clicking outside the root element', async () => {
    const onOutside = vi.fn()
    const wrapper = await mountSuspended(createHost(onOutside), { attachTo: document.body })

    await wrapper.find('.outside').trigger('click')

    expect(onOutside).toHaveBeenCalledOnce()
  })

  it('stops listening after the component unmounts', async () => {
    const onOutside = vi.fn()
    const wrapper = await mountSuspended(createHost(onOutside), { attachTo: document.body })

    wrapper.unmount()
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(onOutside).not.toHaveBeenCalled()
  })
})
