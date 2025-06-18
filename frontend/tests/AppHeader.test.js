// tests/AppHeader.test.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppHeader from '@/components/AppHeader.vue';

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays initials from localStorage', () => {
    localStorage.setItem('firstName', 'Tamanno');
    localStorage.setItem('lastName', 'Alimova');
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
  
    const buttons = wrapper.findAll('button.nav-button');
    const searchBtn = buttons.find(btn => btn.text().toLowerCase() === 'search');
    expect(searchBtn).toBeDefined();
    await searchBtn.trigger('click');
    expect(push).toHaveBeenCalledWith('/search');
  });

  it('uses default initials if localStorage is empty', async () => {
    localStorage.clear();
  localStorage.setItem('firstName', 'G');
  localStorage.setItem('lastName', 'M');
  const wrapper = mount(AppHeader);
  const initials = wrapper.find('.initials-circle');
  expect(initials.exists()).toBe(true);
  expect(initials.text()).toBe('GM');
  });

  it('displays default initials if names are missing', () => {
    localStorage.setItem('firstName', '');
    localStorage.setItem('lastName', '');
    const wrapper = mount(AppHeader);
    const initials = wrapper.find('.initials-circle');
    expect(initials.exists()).toBe(true);
  });
  
  it('toggles dropdown menu when initials clicked', async () => {
    localStorage.setItem('firstName', 'Tamanno');
    localStorage.setItem('lastName', 'Alimova');
    const wrapper = mount(AppHeader);

    const initialsCircle = wrapper.find('.initials-circle');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
    await initialsCircle.trigger('click');
    expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
  });
});
