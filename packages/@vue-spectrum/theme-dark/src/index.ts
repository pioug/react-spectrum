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
