import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateAccount from '@/pages/CreateAccount.vue';

describe('CreateAccount.vue', () => {
  let wrapper;
  let pushMock;

  beforeEach(() => {
    pushMock = vi.fn();
    wrapper = mount(CreateAccount, {
      global: {
        mocks: {
          $router: { push: pushMock },
          fetch: vi.fn(),
        },
      },
    });
  });

  it('renders the heading', () => {
    expect(wrapper.text()).toContain('StudyBuddy - Create Account');
  });

  it('has all required input fields', () => {
    expect(wrapper.find('input#email').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
    expect(wrapper.find('input#firstName').exists()).toBe(true);
    expect(wrapper.find('input#lastName').exists()).toBe(true);
    expect(wrapper.find('input#major').exists()).toBe(true);
    expect(wrapper.find('input#classes').exists()).toBe(true);
    expect(wrapper.findAll('input[type="checkbox"]').length).toBe(3);
  });

  it('password note is visible', () => {
    expect(wrapper.find('p.text-red-600').text()).toContain(
      'Password must consist of at least 8 characters and one number'
    );
  });

  it('updates v-models on user input', async () => {
    await wrapper.find('input#email').setValue('test@example.com');
    expect(wrapper.vm.email).toBe('test@example.com');

    await wrapper.find('input#password').setValue('Pass1234');
    expect(wrapper.vm.password).toBe('Pass1234');
  });

  it('updates availability checkboxes correctly', async () => {
    const weekdayCheckbox = wrapper.find('input[type="checkbox"][value="weekday"]');
    const anytimeCheckbox = wrapper.find('input[type="checkbox"][value="anytime"]');

    await weekdayCheckbox.setChecked(true);
    expect(wrapper.vm.availabilityWeekday).toBe(true);
    expect(wrapper.vm.availabilityAnytime).toBe(false);

    await anytimeCheckbox.setChecked(true);
    expect(wrapper.vm.availabilityAnytime).toBe(true);
    expect(wrapper.vm.availabilityWeekday).toBe(false);
  });

  it('shows error if email already exists', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, error: 'email_exists' }),
      })
    );

    await wrapper.setData({
      email: 'existing@example.com',
      password: 'Password1',
      firstName: 'John',
      lastName: 'Doe',
      major: 'CS',
      classes: 'CS101,CS102',
      availabilityWeekday: true,
    });

    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('p.text-red-600').text()).toBe('An account with this email already exists.');
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates to home on successful account creation', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    await wrapper.setData({
      email: 'new@example.com',
      password: 'Password1',
      firstName: 'Jane',
      lastName: 'Smith',
      major: 'Math',
      classes: 'MATH101',
      availabilityWeekday: true,
    });

    await wrapper.find('form').trigger('submit.prevent');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
