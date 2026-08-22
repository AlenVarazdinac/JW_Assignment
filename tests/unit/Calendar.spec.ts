import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Calendar from '~/components/ui/Calendar.vue'

describe('Calendar', () => {
  it('renders the correct number of leading days from the previous month', async () => {
    // April 1st 2026 is a Wednesday, so with a Monday-first week there should be 2 leading days (30, 31 March).
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: '2026-04-02' } })

    const dayButtons = wrapper.findAll('button').filter(button => /^\d+$/.test(button.text()))
    const leadingDays = dayButtons.slice(0, 2).map(button => button.text())

    expect(leadingDays).toEqual(['30', '31'])
  })

  it('highlights the day matching modelValue as selected', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: '2026-04-02' } })

    const selectedDay = wrapper.findAll('button').find(button => button.text() === '2')
    expect(selectedDay?.classes()).toContain('bg-primary-600')
  })

  it('emits the ISO date when a day is clicked', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: '2026-04-02' } })

    const targetDay = wrapper.findAll('button').find(button => button.text() === '15')
    await targetDay?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-04-15'])
  })

  it('moves to the next month and updates the header label', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: '2026-04-02' } })

    expect(wrapper.text()).toContain('April 2026')

    await wrapper.find('[aria-label="Next month"]').trigger('click')

    expect(wrapper.text()).toContain('May 2026')
  })

  it('emits an empty string when Clear is clicked', async () => {
    const wrapper = await mountSuspended(Calendar, { props: { modelValue: '2026-04-02' } })

    const clearButton = wrapper.findAll('button').find(button => button.text() === 'Clear')
    await clearButton?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })
})
