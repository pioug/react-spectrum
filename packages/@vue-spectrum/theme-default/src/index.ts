export interface SpectrumThemeSection {
  className: string,
  colorScheme?: 'dark' | 'light',
  scale?: 'large' | 'medium'
}

export interface SpectrumTheme {
  dark: SpectrumThemeSection,
  global: SpectrumThemeSection,
  large: SpectrumThemeSection,
  light: SpectrumThemeSection,
  medium: SpectrumThemeSection
}

export const theme: SpectrumTheme = {
  global: {
    className: 'spectrum-default-global'
  },
  light: {
    className: 'spectrum-light',
    colorScheme: 'light'
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
