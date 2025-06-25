import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchPage from '@/pages/SearchPage.vue';

vi.stubGlobal('alert', vi.fn());

describe('SearchPage.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Set required localStorage keys
    localStorage.setItem('availability', 'anytime');
    localStorage.setItem('id', '1');
    localStorage.setItem('connections', '[]');
  });

  it('displays result when valid course is searched', async () => {

    // Mock fetch based on endpoint
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(['CS321', 'BIO101']),
        });
      }

      if (url.includes('/api/students')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: 2,
              FirstName: 'Jane',
              LastName: 'Doe',
              Courses: ['CS321'],
              Availability: ['anytime'],
            },
          ]),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
    const wrapper = mount(SearchPage);
    await new Promise(resolve => setTimeout(resolve, 10));    
    await wrapper.vm.$nextTick(); // wait for mounted course fetch

    wrapper.vm.searchQuery = 'CS321';
    wrapper.vm.selectedTime = 'anytime'; 
    
    await wrapper.vm.fetchMatchedStudents();
    await new Promise((resolve) => setTimeout(resolve, 10));

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isValidCourse).toBe(true);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Jane Doe');
    expect(wrapper.text()).toContain('CS321');
  });

  it('shows invalid message for non-existent course', async () => {
    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick();

    wrapper.vm.searchQuery = 'INVALID123';
    await wrapper.vm.fetchMatchedStudents();
    await wrapper.vm.$nextTick();

    const noResult = wrapper.find('.no-results');
    expect(noResult.exists()).toBe(true);
    expect(noResult.text().toLowerCase()).toContain('no matches');
  });

  it('filters courses by selected availability', async () => {
    localStorage.setItem('availability', 'weekdays');

    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick();

    wrapper.vm.searchQuery = 'CS321';
    wrapper.vm.selectedTime = 'weekends'; // mismatch
    await wrapper.vm.fetchMatchedStudents();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.no-results').exists()).toBe(true);
  });

  it('shows no matches if course is valid but filtered out by time', async () => {
    const wrapper = mount(SearchPage);
    await wrapper.vm.$nextTick();

    wrapper.vm.searchQuery = 'CS321';
    wrapper.vm.selectedTime = 'weekends';
    await wrapper.vm.fetchMatchedStudents();
    await wrapper.vm.$nextTick();

    const noResult = wrapper.find('.no-results');
    expect(noResult.exists()).toBe(true);
    expect(noResult.text().toLowerCase()).toContain('no matches');
  });
});
