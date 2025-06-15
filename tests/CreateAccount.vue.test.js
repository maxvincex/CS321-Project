import { mount } from '@vue/test-utils'
import CreateAccount from '@/pages/CreateAccount.vue'

describe('CreateAccount.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CreateAccount)
  })

  it('renders StudyBuddy create account heading', () => {
    expect(wrapper.text()).toContain('StudyBuddy - Create Account')
  })

  it('has required inputs', () => {
    const inputs = wrapper.findAll('input')
    // expecting email, password, firstName, lastName, major, classes, and availability radios
    expect(inputs.length).toBeGreaterThanOrEqual(7)
  })

  it('availability radios work correctly', async () => {
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios.length).toBe(3)

    await radios[1].setChecked()
    expect(wrapper.vm.availability).toBe('weekday')
  })

  it('submit calls handleCreateAccount and redirects', async () => {
    const mockRouter = { push: jest.fn() }
    wrapper = mount(CreateAccount, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })
})
