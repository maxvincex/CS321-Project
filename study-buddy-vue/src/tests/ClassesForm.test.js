import { mount } from '@vue/test-utils'
import ClassesForm from '../components/ClassesForm.vue'

// Mock the database lookup inside the component
jest.mock('../components/ClassesForm.vue', () => {
  const actual = jest.requireActual('../components/ClassesForm.vue')
  return {
    ...actual,
    default: {
      ...actual.default,
      data() {
        return {
          input: '',
          classList: [],
          message: '',
          dbList: ['CS101', 'CS102', 'CS321']
        }
      }
    }
  }
})

describe('ClassesForm.vue', () => {
  test('renders input and buttons', () => {
    const wrapper = mount(ClassesForm)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button.add-button').exists()).toBe(true)
    expect(wrapper.find('button.submit-button').exists()).toBe(true)
  })

  test('adds class to list if it exists in DB', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')
    expect(wrapper.text()).toContain('CS321')
  })

  test('shows error if class is not in DB', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('FAKE101')
    await wrapper.find('button.add-button').trigger('click')
    expect(wrapper.text()).toContain('not found in database')
  })

  test('shows error if class is already in list', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')
    expect(wrapper.text()).toContain('already in your profile')
  })

  test('removes class when X is clicked', async () => {
    const wrapper = mount(ClassesForm)
    const input = wrapper.find('input')
    await input.setValue('CS321')
    await wrapper.find('button.add-button').trigger('click')
    await wrapper.find('li button').trigger('click')
    expect(wrapper.text()).not.toContain('CS321')
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
