import '@adobe/spectrum-css-temp/vars/express.css';
import {theme as defaultTheme, type Theme} from '@vue-spectrum/theme-default';
const express: {[key: string]: string} = {};


export interface ExpressTheme extends Theme {
  global: Theme['global'] & {express: string},
  large: Theme['large'] & {express: string},
  medium: Theme['medium'] & {express: string}
}

export type SpectrumExpressTheme = ExpressTheme;

function resolveClassName(styles: Record<string, string>, key: string, fallback: string): string {
  return styles[key] ?? fallback;
}

export const theme: ExpressTheme = {
  ...defaultTheme,
  global: {
    ...defaultTheme.global,
    express: resolveClassName(express, 'express', 'spectrum-express-global')
  },
  medium: {
    ...defaultTheme.medium,
    express: resolveClassName(express, 'medium', 'spectrum-express-medium')
  },
  large: {
    ...defaultTheme.large,
    express: resolveClassName(express, 'large', 'spectrum-express-large')
  }
};
