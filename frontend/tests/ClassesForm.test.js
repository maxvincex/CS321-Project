import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import ClassesForm from '@/pages/ClassesForm.vue'

vi.stubGlobal('alert', vi.fn())
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ classes: [] }),
})))

describe('ClassesForm.vue', () => {
  let wrapper

  beforeEach(async () => {
    localStorage.setItem('id', '1')
    localStorage.setItem('email', 'test@example.com')

    fetch.mockClear()
    wrapper = mount(ClassesForm)
    await nextTick()
  })

  it('renders heading and inputs', () => {
    expect(wrapper.find('.page-title').exists()).toBe(true)
    expect(wrapper.find('#add-input').exists()).toBe(true)
    expect(wrapper.find('#remove-input').exists()).toBe(true)
    expect(wrapper.find('.add-btn').exists()).toBe(true)
    expect(wrapper.find('.save-btn').exists()).toBe(true)
  })

  it('adds a valid class to the list', async () => {
    fetch.mockReset()

    fetch
      .mockImplementationOnce(() => Promise.resolve({  // POST /addClass
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }))
      .mockImplementationOnce(() => Promise.resolve({  // GET /get-classes
        ok: true,
        json: () => Promise.resolve({ classes: ['CS321'] }),
      }))
  
    wrapper = mount(ClassesForm)
    await nextTick()

    await wrapper.find('#add-input').setValue('CS321')
    await wrapper.find('.add-btn').trigger('click')

    await nextTick()
    await nextTick()  // for classList update from reloadClasses()
  
    
    expect(alert).toHaveBeenCalledWith('✅ "CS321" added successfully!')
    expect(wrapper.text()).toContain('CS321') // will now pass
  })

  it('shows alert when adding empty input', async () => {
    await wrapper.find('#add-input').setValue(' ')
    await wrapper.find('.add-btn').trigger('click')
    expect(alert).toHaveBeenCalledWith('Please enter a class code to add.')
  })

  it('calls reloadClasses on successful add', async () => {
    const reloadSpy = vi.spyOn(wrapper.vm, 'reloadClasses')
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    }))
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ classes: ['CS101'] }),
    }))

    await wrapper.find('#add-input').setValue('CS101')
    await wrapper.find('.add-btn').trigger('click')
    await nextTick()

    expect(reloadSpy).toHaveBeenCalled()
  })

  it('shows alert when removing empty input', async () => {
    await wrapper.find('#remove-input').setValue(' ')
    await wrapper.find('.action-btn').trigger('click')
    expect(alert).toHaveBeenCalledWith('Please enter a class code to remove.')
  })

  it('shows alert for trying to remove class not in list', async () => {
    alert.mockClear()
  
    fetch.mockReset()
    fetch.mockImplementation((url) => {
      if (url.includes('get-classes')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ classes: ['CS101'] }),
        })
      } else if (url.includes('removeClass')) {
        // Simulate failure or bypass removal logic
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: false }),
        })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    })
  
    wrapper = mount(ClassesForm)
    await nextTick()
  
    // Set list manually in case fetch overrides
    wrapper.vm.classList = ['CS101']
    await wrapper.find('#remove-input').setValue('MATH202')
    await wrapper.find('.action-btn').trigger('click')
    await nextTick()
  
    expect(alert).toHaveBeenCalledWith(`⚠️ You don't have "MATH202" to remove.`)
  })
})