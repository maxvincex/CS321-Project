import { mount } from '@vue/test-utils'
import TimeAvailabilityForm from '../components/TimeAvailabilityForm.vue'

describe('TimeAvailabilityForm.vue', () => {
  test('renders dropdown and submit button', () => {
    const wrapper = mount(TimeAvailabilityForm)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  test('shows error message if nothing selected on submit', async () => {
    const wrapper = mount(TimeAvailabilityForm)
    await wrapper.find('button[type="submit"]').trigger('click')
    expect(wrapper.text()).toContain('Please select a time.')
  })

  test('shows confirmation message when availability is selected and submitted', async () => {
    const wrapper = mount(TimeAvailabilityForm)
    const select = wrapper.find('select')
    await select.setValue('Weekdays')
    await wrapper.find('button[type="submit"]').trigger('click')
    expect(wrapper.text()).toContain('Availability set to: Weekdays')
  })
})
