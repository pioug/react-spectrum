import {theme as defaultTheme, type Theme} from '@vue-spectrum/theme-default';

export interface ExpressTheme extends Theme {
  global: Theme['global'] & {express: string},
  large: Theme['large'] & {express: string},
  medium: Theme['medium'] & {express: string}
}

export type SpectrumExpressTheme = ExpressTheme;

export const theme: Theme = {
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
