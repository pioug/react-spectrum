import {AdobeLogo} from './icons/AdobeLogo';
import {ReactAriaLogo} from './icons/ReactAriaLogo';
import {ReactNode} from 'react';

export type Library = 'react-spectrum' | 'vue-spectrum' | 'react-aria' | 'vue-aria';

type TabDef = {
  label: string,
  description: string,
  icon: ReactNode
};

export const TAB_DEFS: Record<Library, TabDef> = {
  'react-spectrum': {
    label: 'React Spectrum',
    description: "Components for Adobe's Spectrum design system",
    icon: <AdobeLogo />
  },
  'vue-spectrum': {
    label: 'Vue Spectrum',
    description: "Vue components for Adobe's Spectrum design system",
    icon: <AdobeLogo />
  },
  'react-aria': {
    label: 'React Aria',
    description: 'Style-free components and hooks for building accessible UIs',
    icon: <ReactAriaLogo />
  },
  'vue-aria': {
    label: 'Vue Aria',
    description: 'Vue port of style-free components for building accessible UIs',
    icon: <ReactAriaLogo />
  }
};
