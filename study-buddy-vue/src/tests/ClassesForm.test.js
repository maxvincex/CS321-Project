import { mount } from '@vue/test-utils'
import ClassesForm from '../components/ClassesForm.vue'

describe('ClassesForm.vue', () => {
  test('renders form with class input and submit button', () => {
    const wrapper = mount(ClassesForm)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button.submit-button').exists()).toBe(true)
  })

  test('adds class to list when entered', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')

    expect(wrapper.text()).toContain('CS321')
    expect(input.element.value).toBe('')
  })

  test('clears input after adding', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')

    expect(input.element.value).toBe('')
  })

  test('shows success message on submit', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')
    await wrapper.find('button.submit-button').trigger('click')

    expect(wrapper.text()).toContain('Submitted successfully')
  })
})
