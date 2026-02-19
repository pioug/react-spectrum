import {computed, type ComputedRef, type Ref, unref} from 'vue';
import {useHover} from '@vue-aria/interactions';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface TooltipTriggerStateLike {
  close: (immediate?: boolean) => void,
  open: (isFocused?: boolean) => void
}

export interface AriaTooltipOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  id?: MaybeRef<string | undefined>
}

export interface TooltipAria {
  tooltipProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    id?: string,
    onMouseEnter?: (event: MouseEvent) => void,
    onMouseLeave?: (event: MouseEvent) => void,
    onPointerEnter?: (event: PointerEvent) => void,
    onPointerLeave?: (event: PointerEvent) => void,
    role: 'tooltip'
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useTooltip(options: AriaTooltipOptions = {}, state?: TooltipTriggerStateLike): TooltipAria {
  let hover = useHover({
    onHoverStart: () => {
      state?.open(true);
    },
    onHoverEnd: () => {
      state?.close();
    }
  });

  return {
    tooltipProps: computed(() => ({
      ...hover.hoverProps.value,
      role: 'tooltip' as const,
      id: resolveOptionalString(options.id),
      'aria-label': resolveOptionalString(options['aria-label']),
      'aria-labelledby': resolveOptionalString(options['aria-labelledby'])
    }))
  };
}
