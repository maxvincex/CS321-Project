// tests/SearchPage.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchPage from '@/pages/SearchPage.vue';

describe('SearchPage.vue', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(['CS321', 'BIO101']),
      })
    );
    localStorage.setItem('availability', 'anytime');
  });

  it('displays result when valid course is searched', async () => {
    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick(); // wait for fetch to resolve

    wrapper.vm.searchQuery = 'CS321';
    await wrapper.vm.$nextTick(); // update searchQuery
    await wrapper.vm.$nextTick(); // allow computed to update

    expect(wrapper.vm.isValidCourse).toBe(true);
    expect(wrapper.vm.filteredCourses).toContain('CS321');
  });

  it('shows invalid message for non-existent course', async () => {
    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick();

    wrapper.setData({ searchQuery: 'ABC999' });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.no-results').text()).toContain('Not a valid course');
  });

  it('filters courses by selected availability', async () => {
    localStorage.setItem('availability', 'weekdays');
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(['CS321', 'BIO101']),
      })
    );
    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick();
  
    wrapper.setData({ searchQuery: 'CS321', selectedTime: 'weekends' });
    await wrapper.vm.$nextTick();
  
    expect(wrapper.vm.filteredCourses.length).toBe(0);
  });

  it('shows no matches if course is valid but filtered out by time', async () => {
    localStorage.setItem('availability', 'weekdays');
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(['CS321']),
      })
    );
  
    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick();
  
    wrapper.setData({ searchQuery: 'CS321', selectedTime: 'weekends' });
    await wrapper.vm.$nextTick();
  
    const text = wrapper.find('.no-results').text();
    expect(text.toLowerCase()).toContain('no matches');
  });
});
