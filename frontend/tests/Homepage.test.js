import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Homepage from '@/pages/Homepage.vue';

describe('Homepage.vue', () => {
  let wrapper;
  let pushMock;

  beforeEach(() => {
    pushMock = vi.fn();
    wrapper = mount(Homepage, {
      global: {
        mocks: {
          $router: { push: pushMock },
          fetch: vi.fn(),
        },
      },
    });
  });

  it('displays StudyBuddy logo', () => {
    expect(wrapper.text()).toContain('StudyBuddy');
  });

  it('has email and password inputs', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('sign in button is green and clickable', async () => {
    const btn = wrapper.find('button.btn-green');
    expect(btn.exists()).toBe(true);

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    await wrapper.find('input#email').setValue('user@example.com');
    await wrapper.find('input#password').setValue('CorrectPass1');
    await btn.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/profile');
  });

  it('create account button is blue and navigates to /create-account', async () => {
    const btn = wrapper.find('button.btn-blue');
    await btn.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/create-account');
  });

  it('shows error if email is not linked to an account on login', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, error: 'email_not_found' }),
      })
    );

    await wrapper.find('input#email').setValue('notfound@example.com');
    await wrapper.find('input#password').setValue('Password1');
    await wrapper.find('form').trigger('submit.prevent');

    await wrapper.vm.$nextTick();

    expect(wrapper.find('p.text-red-600').text()).toBe('This email is not linked to an account. Please create an account.');
  });

  it('shows error if password is wrong on login', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, error: 'wrong_password' }),
      })
    );

    await wrapper.find('input#email').setValue('user@example.com');
    await wrapper.find('input#password').setValue('WrongPass1');
    await wrapper.find('form').trigger('submit.prevent');

    await wrapper.vm.$nextTick();

    expect(wrapper.find('p.text-red-600').text()).toBe('Incorrect password. Please try again.');
  });
});
