// tests/AppHeader.test.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import AppHeader from '@/components/AppHeader.vue';

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.setItem('firstName', 'Tamanno');
    localStorage.setItem('lastName', 'Alimova');
  });

  it('displays initials from localStorage', () => {
    const wrapper = mount(AppHeader);
    expect(wrapper.text()).toContain('TA');
  });

  it('navigates to Chat page on Chat button click', async () => {
    const push = vi.fn();

    const wrapper = mount(AppHeader, {
      global: {
        mocks: {
          $router: { push },
        },
      },
    });

    const chatBtn = wrapper.find('[data-testid="chat-btn"]');
    expect(chatBtn.exists()).toBe(true); //  check first

    await chatBtn.trigger('click');
    expect(push).toHaveBeenCalledWith('/chat');

  });
  it('navigates to Search page on Search button click', async () => {
    const push = vi.fn();
    const wrapper = mount(AppHeader, {
      global: {
        mocks: { $router: { push } },
      },
    });
  
    const searchBtn = wrapper.find('button[title="Search"]');
    expect(searchBtn.exists()).toBe(true);
    await searchBtn.trigger('click');
    expect(push).toHaveBeenCalledWith('/search');
  });

  it('uses default initials if localStorage is empty', () => {
    localStorage.clear(); // simulate not logged in
    const wrapper = mount(AppHeader);
    expect(wrapper.text()).toContain('GM'); // defaults to 'GM'
  });

  it('displays default initials if names are missing', () => {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    const wrapper = mount(AppHeader);
    expect(wrapper.text()).toContain('GM'); // Default from code
  });
  it('navigates to Search page on Search button click', async () => {
    const push = vi.fn();
    const wrapper = mount(AppHeader, {
      global: {
        mocks: {
          $router: { push },
        },
      },
    });
    const searchBtn = wrapper.find('button[title="Search"]');
    await searchBtn.trigger('click');
    expect(push).toHaveBeenCalledWith('/search');
  });
});
