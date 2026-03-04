import {computed, type ComputedRef, inject, type InjectionKey} from '@vue/runtime-core';

export interface SpectrumContextValue {
  scale: 'medium' | 'large',
  colorScheme: 'light' | 'dark',
  locale: string,
  dir: 'ltr' | 'rtl'
}

export const defaultSpectrumContext: SpectrumContextValue = {
  scale: 'medium',
  colorScheme: 'light',
  locale: 'en-US',
  dir: 'ltr'
};

export const spectrumContextKey: InjectionKey<ComputedRef<SpectrumContextValue>> = Symbol('vue-spectrum-context');

export function getSpectrumContext(): ComputedRef<SpectrumContextValue> {
  return inject(
    spectrumContextKey,
    computed(() => defaultSpectrumContext)
  );
}
