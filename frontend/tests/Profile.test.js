// tests/Profile.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import Profile from '@/pages/Profile.vue';
import router from '@/router';


// Suppress alert since jsdom doesn't implement it
vi.stubGlobal('alert', vi.fn());
vi.stubGlobal('fetch', vi.fn((url) => {
  if (url.includes('/api/profile')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        FirstName: 'Gesu',
        LastName: 'Mahmadshoeva',
        Major: 'CS',
        Courses: ['CS321', 'CS310'],
        Availability: ['anytime', 'weekends'],
        Bio: 'Test bio here',
        Friends: []
      })
    });
  }

  if (url.includes('/api/students')) {
    return Promise.resolve({
      json: () => Promise.resolve([])
    });
  }

  return Promise.resolve({
    json: () => Promise.resolve({})
  });
}));

describe('Profile.vue', async () => {
  beforeEach(() => {
    localStorage.setItem('firstName', 'Gesu');
    localStorage.setItem('lastName', 'Mahmadshoeva');
    localStorage.setItem('major', 'CS');
    localStorage.setItem('availability', 'anytime,weekends');
    localStorage.setItem('classes', JSON.stringify(['CS321', 'CS310']));
    localStorage.setItem('email', 'gesu@example.com');
  });

  it('displays name, major and initials', async () => {
    const wrapper = mount(Profile, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Gesu Mahmadshoeva');
    expect(wrapper.text()).toContain('CS');
    expect(wrapper.text()).toContain('GM'); // initials
  });

  it('renders all classes from localStorage', async () => {
    const wrapper = mount(Profile, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('CS321');
    expect(wrapper.text()).toContain('CS310');
  });

  it('displays correct availability badges', async () => {
    localStorage.setItem('availability', 'weekends,anytime');
    const wrapper = mount(Profile, { global: { plugins: [router] } });
    await flushPromises();
    
    expect(wrapper.text()).toContain('weekends');
    expect(wrapper.text()).toContain('anytime');
  });
  
  it('renders no classes if list is empty (fallback: renders nothing)', async () => {
  // Override fetch mock specifically for this test
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes('/api/profile')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          FirstName: 'Gesu',
          LastName: 'Mahmadshoeva',
          Major: 'CS',
          Courses: [], // ⬅ empty classes!
          Availability: ['anytime'],
          Bio: 'This is a test bio.',
          Friends: []
        })
      });
    }

    if (url.includes('/api/students')) {
      return Promise.resolve({
        json: () => Promise.resolve([])
      });
    }

    return Promise.resolve({ json: () => Promise.resolve({}) });
  }));

  const wrapper = mount(Profile, { global: { plugins: [router] } });
  await flushPromises();

    // no class pills are rendered
    const classPills = wrapper.findAll('.pill');
    const classTexts = classPills.map(p => p.text());
  
    // Since availability pills also use .pill, filtering only class names
    const knownClassNames = ['CS321', 'CS310', 'BIO101', 'HIST', 'GOV']; // optional filter
    const classOnly = classTexts.filter(text =>
      knownClassNames.some(name => text.includes(name))
    );
  
    expect(classOnly.length).toBe(0);
  });
});
