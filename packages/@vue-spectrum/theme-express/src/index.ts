import {theme as defaultTheme, type SpectrumTheme} from '@vue-spectrum/theme-default';

export interface SpectrumExpressTheme extends SpectrumTheme {
  global: SpectrumTheme['global'] & {express: string},
  large: SpectrumTheme['large'] & {express: string},
  medium: SpectrumTheme['medium'] & {express: string}
}

export const theme: SpectrumExpressTheme = {
  ...defaultTheme,
  global: {
    ...defaultTheme.global,
    express: 'spectrum-express-global'
  },
  medium: {
    ...defaultTheme.medium,
    express: 'spectrum-express-medium'
  },
  large: {
    ...defaultTheme.large,
    express: 'spectrum-express-large'
  }
};
