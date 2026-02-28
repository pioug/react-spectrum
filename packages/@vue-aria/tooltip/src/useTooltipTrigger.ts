import {computed, type ComputedRef, ref, type Ref, unref, watch} from 'vue';
import {getInteractionModality, isFocusVisible, useFocusable, useHover} from '@vue-aria/interactions';
import {useSSRSafeId} from '@vue-aria/ssr';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type TooltipTriggerMode = 'focus' | 'focus hover';

export interface AriaTooltipTriggerOptions {
  close?: (immediate?: boolean) => void,
  id?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  isOpen?: Ref<boolean>,
  onOpenChange?: (isOpen: boolean) => void,
  open?: (isFocused?: boolean) => void,
  shouldCloseOnPress?: MaybeRef<boolean>,
  trigger?: MaybeRef<TooltipTriggerMode | undefined>,
  triggerRef?: Ref<HTMLElement | null>
}

export interface TooltipTriggerAria {
  close: (immediate?: boolean) => void,
  isOpen: Ref<boolean>,
  open: (isFocused?: boolean) => void,
  tooltipProps: ComputedRef<{
    id: string
  }>,
  triggerProps: ComputedRef<{
    'aria-describedby'?: string,
    onBlur?: (event: FocusEvent) => void,
    onFocus?: (event: FocusEvent) => void,
    onKeyDown?: (event: KeyboardEvent) => void,
    onKeyUp?: (event: KeyboardEvent) => void,
    onMouseEnter?: (event: MouseEvent) => void,
    onMouseLeave?: (event: MouseEvent) => void,
    onPointerDown: (event: PointerEvent) => void,
    onPointerEnter?: (event: PointerEvent) => void,
    onPointerLeave?: (event: PointerEvent) => void,
    tabindex?: number
  }>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function useTooltipTrigger(options: AriaTooltipTriggerOptions = {}): TooltipTriggerAria {
  let generatedId = useSSRSafeId();

  let triggerRef = options.triggerRef ?? ref<HTMLElement | null>(null);
  let internalOpen = ref(false);
  let isOpen = options.isOpen ?? internalOpen;
  let isHovered = ref(false);
  let isFocused = ref(false);

  let triggerMode = computed(() => unref(options.trigger) ?? 'focus hover');
  let shouldCloseOnPress = computed(() => unref(options.shouldCloseOnPress) ?? true);
  let tooltipId = computed(() => resolveOptionalString(options.id) ?? generatedId);

  let setOpen = (nextOpen: boolean) => {
    if (nextOpen && unref(options.isDisabled)) {
      return;
    }

    if (isOpen.value === nextOpen) {
      return;
    }

    isOpen.value = nextOpen;
    options.onOpenChange?.(nextOpen);
  };

  let open = (isFocusedTrigger?: boolean) => {
    if (unref(options.isDisabled)) {
      return;
    }

    if (options.open) {
      options.open(isFocusedTrigger);
      return;
    }

    setOpen(true);
  };

  let close = (immediate?: boolean) => {
    if (options.close) {
      options.close(immediate);
      return;
    }

    setOpen(false);
  };

  let handleShow = () => {
    if (isHovered.value || isFocused.value) {
      open(isFocused.value);
    }
  };

  let handleHide = (immediate?: boolean) => {
    if (!isHovered.value && !isFocused.value) {
      close(immediate);
    }
  };

  watch(
    isOpen,
    (nextOpen, _, onCleanup) => {
      if (!nextOpen || typeof document === 'undefined') {
        return;
      }

      let onDocumentKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          close(true);
        }
      };

      document.addEventListener('keydown', onDocumentKeyDown, true);
      onCleanup(() => {
        document.removeEventListener('keydown', onDocumentKeyDown, true);
      });
    },
    {immediate: true}
  );

  let onHoverStart = () => {
    if (triggerMode.value === 'focus') {
      return;
    }

    if (getInteractionModality() === 'pointer') {
      isHovered.value = true;
    } else {
      isHovered.value = false;
    }

    handleShow();
  };

  let onHoverEnd = () => {
    if (triggerMode.value === 'focus') {
      return;
    }

    isFocused.value = false;
    isHovered.value = false;
    handleHide();
  };

  let onPressStart = () => {
    if (!shouldCloseOnPress.value) {
      return;
    }

    isFocused.value = false;
    isHovered.value = false;
    handleHide(true);
  };

  let onFocus = () => {
    if (!isFocusVisible()) {
      return;
    }

    isFocused.value = true;
    handleShow();
  };

  let onBlur = () => {
    isFocused.value = false;
    isHovered.value = false;
    handleHide(true);
  };

  let {hoverProps} = useHover({
    isDisabled: options.isDisabled,
    onHoverStart,
    onHoverEnd
  });

  let {focusableProps} = useFocusable({
    isDisabled: options.isDisabled,
    onBlur,
    onFocus
  }, triggerRef);

  let onKeyDown = (event: KeyboardEvent) => {
    focusableProps.value.onKeyDown?.(event);

    if (event.key === 'Escape') {
      event.stopPropagation();
      close(true);
      return;
    }

    onPressStart();
  };

  return {
    close,
    isOpen,
    open,
    tooltipProps: computed(() => ({
      id: tooltipId.value
    })),
    triggerProps: computed(() => ({
      ...focusableProps.value,
      ...hoverProps.value,
      tabindex: undefined,
      'aria-describedby': isOpen.value ? tooltipId.value : undefined,
      onPointerDown: () => {
        onPressStart();
      },
      onKeyDown
    }))
  };
}
