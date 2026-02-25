import '@adobe/spectrum-css-temp/vars/spectrum-darkest.css';
import '@adobe/spectrum-css-temp/vars/spectrum-global.css';
import '@adobe/spectrum-css-temp/vars/spectrum-large.css';
import '@adobe/spectrum-css-temp/vars/spectrum-light.css';
import '@adobe/spectrum-css-temp/vars/spectrum-medium.css';
const darkest: {[key: string]: string} = {};
const global: {[key: string]: string} = {};
const large: {[key: string]: string} = {};
const light: {[key: string]: string} = {};
const medium: {[key: string]: string} = {};


export interface ThemeSection {
  className: string,
  colorScheme?: 'dark' | 'light',
  scale?: 'large' | 'medium'
}

export interface Theme {
  dark: ThemeSection,
  global: ThemeSection,
  large: ThemeSection,
  light: ThemeSection,
  medium: ThemeSection
}

export type SpectrumThemeSection = ThemeSection;
export type SpectrumTheme = Theme;

function resolveClassName(styles: Record<string, string>, key: string, fallback: string): string {
  return styles[key] ?? fallback;
}

export const theme: Theme = {
  global: {
    className: resolveClassName(global, 'spectrum', 'spectrum-default-global')
  },
  light: {
    className: resolveClassName(light, 'spectrum--light', 'spectrum-light'),
    colorScheme: 'light'
  },
  dark: {
    className: resolveClassName(darkest, 'spectrum--darkest', 'spectrum-darkest'),
    colorScheme: 'dark'
  },
  medium: {
    className: resolveClassName(medium, 'spectrum--medium', 'spectrum-medium'),
    scale: 'medium'
  },
  large: {
    className: resolveClassName(large, 'spectrum--large', 'spectrum-large'),
    scale: 'large'
  }
};
