import { mount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'

describe('Home.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Home)
  })

  it('renders StudyBuddy logo', () => {
    expect(wrapper.text()).toContain('StudyBuddy')
  })

  it('has email and password inputs', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('sign in button exists and is green', () => {
    const btn = wrapper.find('button[type="submit"]')
    expect(btn.exists()).toBe(true)
    // Assuming you use a CSS class "btn-green" for styling:
    expect(btn.classes()).toContain('btn-green')
  })

  it('create account button exists and is blue', () => {
    const btn = wrapper.find('button.btn-blue')
    expect(btn.exists()).toBe(true)
  })

  it('clicking create account button navigates to /create-account', async () => {
    const push = jest.fn()
    wrapper = mount(Home, {
      global: {
        mocks: {
          $router: {
            push
          }
        }
      }
    })

    await wrapper.find('button.btn-blue').trigger('click')
    expect(push).toHaveBeenCalledWith('/create-account')
  })
})
