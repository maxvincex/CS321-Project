import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import TimeAvailabilityForm from '../src/pages/TimeAvailabilityForm.vue'

describe('TimeAvailabilityForm.vue', () => {
  test('renders all radio buttons and submit button', () => {
    const wrapper = mount(TimeAvailabilityForm)

    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios).toHaveLength(3)

    const submit = wrapper.find('button[type="submit"]')
    expect(submit.exists()).toBe(true)
  })

  test('shows error message when nothing is selected on submit', async () => {
    const wrapper = mount(TimeAvailabilityForm)
    await wrapper.find('button[type="submit"]').trigger('submit')

    expect(wrapper.text()).toContain('Please select your availability.')
  })

  test('shows confirmation message when availability is selected', async () => {
    const wrapper = mount(TimeAvailabilityForm)

    const weekdayRadio = wrapper.find('input[value="Weekdays"]')
    await weekdayRadio.setValue() // simulate selection

    await wrapper.find('button[type="submit"]').trigger('submit')

    expect(wrapper.text()).toContain('Availability set to: Weekdays')
  })
})
