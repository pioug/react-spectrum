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

export const theme: Theme = {
  global: {
    className: 'spectrum-dark-global'
  },
  light: {
    className: 'spectrum-dark',
    colorScheme: 'dark'
  },
  dark: {
    className: 'spectrum-darkest',
    colorScheme: 'dark'
  },
  medium: {
    className: 'spectrum-medium',
    scale: 'medium'
  },
  large: {
    className: 'spectrum-large',
    scale: 'large'
  }
};
