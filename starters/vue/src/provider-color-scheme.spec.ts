import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import {Provider} from '@vue-spectrum/provider';
import {theme as lightTheme} from '@vue-spectrum/theme-light';

describe('Vue provider color scheme parity', () => {
  it('resolves auto color scheme from prefers-color-scheme and falls back to defaultColorScheme', () => {
    let originalMatchMedia = window.matchMedia;

    try {
      window.matchMedia = ((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true
      })) as typeof window.matchMedia;

      let prefersDarkWrapper = mount(Provider, {
        props: {
          theme: lightTheme
        },
        slots: {
          default: () => 'Auto scheme shell'
        }
      });

      let prefersDarkRoot = prefersDarkWrapper.get('.vs-provider');
      expect(prefersDarkRoot.attributes('data-color-scheme')).toBe('dark');
      expect(prefersDarkRoot.classes()).toContain('spectrum--darkest');

      window.matchMedia = (() => ({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true
      })) as typeof window.matchMedia;

      let defaultDarkWrapper = mount(Provider, {
        props: {
          theme: lightTheme,
          defaultColorScheme: 'dark'
        },
        slots: {
          default: () => 'Default dark shell'
        }
      });

      expect(defaultDarkWrapper.get('.vs-provider').attributes('data-color-scheme')).toBe('dark');
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});
