import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaLinkOptions {
  'aria-current'?: MaybeRef<'date' | 'location' | 'page' | 'step' | 'time' | true | undefined>,
  elementType?: MaybeRef<'a' | 'button' | 'div' | 'span' | string>,
  href?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  onClick?: (event: MouseEvent) => void,
  onPress?: () => void,
  onPressEnd?: () => void,
  onPressStart?: () => void,
  rel?: MaybeRef<string | undefined>,
  target?: MaybeRef<string | undefined>
}

export interface LinkDOMProps {
  'aria-current'?: 'date' | 'location' | 'page' | 'step' | 'time' | true,
  'aria-disabled'?: boolean,
  href?: string,
  rel?: string,
  role?: 'link',
  tabindex?: number,
  target?: string,
  onBlur?: () => void,
  onClick?: (event: MouseEvent) => void,
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void,
  onPointerDown?: () => void,
  onPointerLeave?: () => void
}

export interface LinkAria {
  isPressed: ComputedRef<boolean>,
  linkProps: ComputedRef<LinkDOMProps>
}

function isPressKey(key: string): boolean {
  return key === 'Enter' || key === ' ' || key === 'Spacebar';
}

export function useLink(options: AriaLinkOptions = {}): LinkAria {
  let elementType = computed(() => unref(options.elementType) ?? 'a');
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let isPressedState = ref(false);

  let startPress = () => {
    if (isDisabled.value || isPressedState.value) {
      return;
    }

    isPressedState.value = true;
    options.onPressStart?.();
  };

  let endPress = (triggerPress = false) => {
    if (!isPressedState.value) {
      return;
    }

    isPressedState.value = false;
    options.onPressEnd?.();

    if (triggerPress && !isDisabled.value) {
      options.onPress?.();
    }
  };

  let onPointerDown = () => {
    startPress();
  };

  let onPointerLeave = () => {
    endPress(false);
  };

  let onBlur = () => {
    endPress(false);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value || event.repeat || !isPressKey(event.key)) {
      return;
    }

    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
    }

    startPress();
  };

  let onKeyUp = (event: KeyboardEvent) => {
    if (isDisabled.value || !isPressKey(event.key)) {
      return;
    }

    endPress(true);
  };

  let onClick = (event: MouseEvent) => {
    options.onClick?.(event);

    if (isDisabled.value) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (isPressedState.value) {
      endPress(true);
    } else {
      options.onPress?.();
    }
  };

  return {
    isPressed: computed(() => isPressedState.value),
    linkProps: computed<LinkDOMProps>(() => {
      let isAnchor = elementType.value === 'a';
      let tabIndex: number | undefined = undefined;
      if (!isAnchor) {
        tabIndex = isDisabled.value ? undefined : 0;
      }

      return {
        role: isAnchor ? undefined : 'link',
        tabindex: tabIndex,
        href: isAnchor && !isDisabled.value ? unref(options.href) : undefined,
        target: isAnchor ? unref(options.target) : undefined,
        rel: isAnchor ? unref(options.rel) : undefined,
        'aria-disabled': isDisabled.value || undefined,
        'aria-current': unref(options['aria-current']),
        onBlur,
        onClick,
        onKeyDown,
        onKeyUp,
        onPointerDown,
        onPointerLeave
      };
    })
  };
}
