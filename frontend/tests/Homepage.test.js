import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import Homepage from '@/pages/Homepage.vue';

describe('Homepage.vue', () => {
  let wrapper;
  let router;
  let routerPushSpy;

  beforeEach(async () => {
    // Create and initialize a real Vue Router instance (required for useRouter())
    router = createRouter({
      history: createWebHistory(),
      routes: [],
    });

    // Mount the component with the router plugin
    wrapper = mount(Homepage, {
      global: {
        plugins: [router],
      },
    });

    // Wait for the router to be ready before running tests
    await router.isReady();

    // Spy on router.push to test navigation
    routerPushSpy = vi.spyOn(router, 'push');

    // Clear any previous localStorage to isolate test state
    localStorage.clear();
  });

  it('displays StudyBuddy logo', () => {
    expect(wrapper.text()).toContain('StudyBuddy');
  });

  it('has email and password inputs', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('sign in button is green and clickable', async () => {
    // Mock fetch to simulate successful login
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true, // ✅ Important: simulate a successful HTTP response
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Fill in form fields
    await wrapper.find('#email').setValue('user@example.com');
    await wrapper.find('#password').setValue('CorrectPass1');

    // Trigger sign-in
    const btn = wrapper.find('form button[type="submit"]');
    await btn.trigger('click');

    // Wait for all promises to resolve (e.g., fetch + router.push)
    await flushPromises();

    // Expect user to be redirected to profile
    expect(routerPushSpy).toHaveBeenCalledWith('/profile');
  });

  it('create account button is blue and navigates to /create-account', async () => {
    // Locate the "Create Account" button by its blue background class
    const btn = wrapper.find('button.bg-blue-600');
    expect(btn.exists()).toBe(true);

    // Simulate button click
    await btn.trigger('click');

    // Expect navigation to /create-account
    expect(routerPushSpy).toHaveBeenCalledWith('/create-account');
  });

  it('shows error if email is not linked to an account on login', async () => {
    // Simulate login error for unregistered email
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'email_not_found' }),
      })
    );

    await wrapper.find('#email').setValue('notfound@example.com');
    await wrapper.find('#password').setValue('Password1');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    // Expect appropriate error message
    expect(wrapper.find('p.text-red-600').text()).toBe(
      'This email is not linked to an account. Please create an account.'
    );
  });

  it('shows error if password is wrong on login', async () => {
    // Simulate login error for wrong password
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'wrong_password' }),
      })
    );

    await wrapper.find('#email').setValue('user@example.com');
    await wrapper.find('#password').setValue('WrongPass1');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    // Expect appropriate error message
    expect(wrapper.find('p.text-red-600').text()).toBe(
      'Incorrect password. Please try again.'
    );
  });
});
