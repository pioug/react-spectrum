import {computed, type ComputedRef, inject} from 'vue';

const HIDDEN_CONTEXT = Symbol('VueAriaHidden');

export function useIsHidden(): ComputedRef<boolean> {
  return inject(HIDDEN_CONTEXT, computed(() => false));
}

export function createHideableComponent<TProps, TResult>(
  component: (props: TProps, isHidden: ComputedRef<boolean>) => TResult
): (props: TProps) => TResult {
  return (props: TProps) => component(props, useIsHidden());
}
