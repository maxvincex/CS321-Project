import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import ClassesForm from '../src/pages/ClassesForm.vue'

// Fake class database
const mockClassDatabase = ['CS101', 'MATH202', 'ENGL150']

describe('ClassesForm.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ClassesForm, {
      props: {
        availableClasses: mockClassDatabase
      }
    })
  })

  it('renders heading, input, and buttons', () => {
    expect(wrapper.find('[data-testid="form-title"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="class-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="add-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="submit-button"]').exists()).toBe(true)
  })

  it('adds a valid class to the list', async () => {
    const input = wrapper.find('[data-testid="class-input"]')
    await input.setValue('CS101')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    expect(wrapper.findAll('[data-testid="class-item"]')).toHaveLength(1)
    expect(wrapper.html()).toContain('CS101')
  })

  it('shows error for invalid class', async () => {
    const input = wrapper.find('[data-testid="class-input"]')
    await input.setValue('INVALID123')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)
  })

  it('prevents duplicate class entries', async () => {
    const input = wrapper.find('[data-testid="class-input"]')
    await input.setValue('CS101')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    await input.setValue('CS101')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    expect(wrapper.findAll('[data-testid="class-item"]')).toHaveLength(1)
  })

  it('clears input after adding a class', async () => {
    const input = wrapper.find('[data-testid="class-input"]')
    await input.setValue('MATH202')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    expect(input.element.value).toBe('')
  })

  it('does not add empty or whitespace class', async () => {
    const input = wrapper.find('[data-testid="class-input"]')
    await input.setValue('    ')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    expect(wrapper.findAll('[data-testid="class-item"]')).toHaveLength(0)
  })

  it('deletes a class when "X" is clicked', async () => {
    const wrapper = mount(ClassesForm)

    const input = wrapper.find('[data-testid="class-input"]')
    const addButton = wrapper.find('[data-testid="add-button"]')

    await input.setValue('CS101')
    await addButton.trigger('click')

    await nextTick()

    let classItems = wrapper.findAll('[data-testid="class-item"]')
    expect(classItems.length).toBe(1)

    const deleteButton = wrapper.find('[data-testid="delete-button"]')
    expect(deleteButton.exists()).toBe(true)

    await deleteButton.trigger('click')
    await nextTick()

    classItems = wrapper.findAll('[data-testid="class-item"]')
    expect(classItems.length).toBe(0)
  })

  it('shows success message after submitting classes', async () => {
    const input = wrapper.find('[data-testid="class-input"]')
    await input.setValue('CS101')
    await wrapper.find('[data-testid="add-button"]').trigger('click')
    await wrapper.find('[data-testid="submit-button"]').trigger('click')
    expect(wrapper.find('[data-testid="success-message"]').exists()).toBe(true)
  })
})
