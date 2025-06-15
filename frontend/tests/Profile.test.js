// tests/Profile.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Profile from '@/pages/Profile.vue';

describe('Profile.vue', () => {
  beforeEach(() => {
    localStorage.setItem('firstName', 'Gesu');
    localStorage.setItem('lastName', 'Mahmadshoeva');
    localStorage.setItem('major', 'CS');
    localStorage.setItem('availability', 'anytime,weekends');
    localStorage.setItem('classes', 'CS321,CS310');
  });

  it('displays name, major and initials', () => {
    const wrapper = mount(Profile);
    expect(wrapper.text()).toContain('Gesu Mahmadshoeva');
    expect(wrapper.text()).toContain('CS');
    expect(wrapper.text()).toContain('GM'); // initials
  });

  it('renders all classes from localStorage', () => {
    const wrapper = mount(Profile);
    expect(wrapper.text()).toContain('CS321');
    expect(wrapper.text()).toContain('CS310');
  });

  it('displays correct availability badges', () => {
    localStorage.setItem('availability', 'weekends,anytime');
    const wrapper = mount(Profile);
    expect(wrapper.text()).toContain('weekends');
    expect(wrapper.text()).toContain('anytime');
  });
  
  it('shows message if no classes are stored', () => {
    localStorage.setItem('classes', '');
    const wrapper = mount(Profile);
    expect(wrapper.text()).toContain('No classes listed');
  });
});
