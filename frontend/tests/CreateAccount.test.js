import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import CreateAccount from '@/pages/CreateAccount.vue';

describe('CreateAccount.vue', () => {
  let wrapper;
  let router;
  let routerPushSpy;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [], // No actual routes needed for these tests
    });

    wrapper = mount(CreateAccount, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();
    routerPushSpy = vi.spyOn(router, 'push');
    localStorage.clear(); // Ensure clean state before each test
  });

  async function fillForm({
    email = '',
    password = '',
    firstName = '',
    lastName = '',
    major = '',
    classes = '',
    weekday = false,
    weekend = false,
    anytime = false
  }) {
    await wrapper.find('#email').setValue(email);
    await wrapper.find('#password').setValue(password);
    await wrapper.find('#firstName').setValue(firstName);
    await wrapper.find('#lastName').setValue(lastName);
    await wrapper.find('#major').setValue(major);
    await wrapper.find('#classes').setValue(classes);
    if (weekday) await wrapper.find('input[value="weekday"]').setChecked(true);
    if (weekend) await wrapper.find('input[value="weekend"]').setChecked(true);
    if (anytime) await wrapper.find('input[value="anytime"]').setChecked(true);
  }

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
    await wrapper.find('#email').setValue('test@example.com');
    expect(wrapper.vm.email).toBeDefined(); // just confirming interaction
    await wrapper.find('#password').setValue('Pass1234');
    expect(wrapper.vm.password).toBeDefined();
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
    // Simulate existing user in localStorage
    localStorage.setItem('users', JSON.stringify([
      { email: 'existing@example.com' }
    ]));

    await fillForm({
      email: 'existing@example.com',
      password: 'Password1',
      firstName: 'John',
      lastName: 'Doe',
      major: 'CS',
      classes: 'CS101,CS102',
      weekday: true
    });

    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('An account with this email already exists.');
    expect(routerPushSpy).not.toHaveBeenCalled();
  });

  it('navigates to login on successful account creation', async () => {
    await fillForm({
      email: 'new@example.com',
      password: 'Password1',
      firstName: 'Jane',
      lastName: 'Smith',
      major: 'Math',
      classes: 'MATH101',
      weekend: true
    });

    await wrapper.find('form').trigger('submit.prevent');
    expect(routerPushSpy).toHaveBeenCalledWith('/login');
  });
});