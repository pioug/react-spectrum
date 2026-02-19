import {computed, type ComputedRef} from 'vue';

type Orientation = 'horizontal' | 'vertical';

export interface SeparatorOptions {
  'aria-label'?: string,
  elementType?: string,
  orientation?: Orientation
}

export interface SeparatorAria {
  separatorProps: ComputedRef<{
    'aria-label'?: string,
    'aria-orientation'?: 'vertical',
    role?: 'separator'
  }>
}

export function useSeparator(options: SeparatorOptions = {}): SeparatorAria {
  return {
    separatorProps: computed(() => {
      let ariaOrientation = options.orientation === 'vertical' ? 'vertical' as const : undefined;

      if (options.elementType === 'hr') {
        return {
          'aria-label': options['aria-label'],
          'aria-orientation': ariaOrientation
        };
      }

      return {
        role: 'separator' as const,
        'aria-label': options['aria-label'],
        'aria-orientation': ariaOrientation
      };
    })
  };
}
