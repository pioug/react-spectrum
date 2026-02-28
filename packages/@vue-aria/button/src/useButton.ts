import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type AriaHasPopup = boolean | 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree';

export interface AriaButtonOptions {
  ariaControls?: MaybeRef<string | undefined>,
  ariaCurrent?: MaybeRef<string | undefined>,
  ariaDisabled?: MaybeRef<boolean | undefined>,
  ariaExpanded?: MaybeRef<boolean | undefined>,
  ariaHasPopup?: MaybeRef<AriaHasPopup | undefined>,
  ariaPressed?: MaybeRef<boolean | undefined>,
  elementType?: MaybeRef<'a' | 'button' | 'div' | 'input' | 'span' | string>,
  form?: MaybeRef<string | undefined>,
  formAction?: MaybeRef<string | undefined>,
  formEncType?: MaybeRef<string | undefined>,
  formMethod?: MaybeRef<string | undefined>,
  formNoValidate?: MaybeRef<boolean | undefined>,
  formTarget?: MaybeRef<string | undefined>,
  href?: MaybeRef<string | undefined>,
  isDisabled?: MaybeRef<boolean>,
  onClick?: () => void,
  name?: MaybeRef<string | undefined>,
  onPress?: () => void,
  onPressChange?: (isPressed: boolean) => void,
  onPressEnd?: () => void,
  onPressStart?: () => void,
  rel?: MaybeRef<string | undefined>,
  target?: MaybeRef<string | undefined>,
  type?: MaybeRef<'button' | 'reset' | 'submit' | string>,
  value?: MaybeRef<string | number | undefined>
}

export interface ButtonProps {
  'aria-checked'?: boolean,
  'aria-controls'?: string,
  'aria-current'?: string,
  'aria-disabled'?: boolean,
  'aria-expanded'?: boolean,
  'aria-haspopup'?: AriaHasPopup,
  'aria-pressed'?: boolean,
  disabled?: boolean,
  form?: string,
  formAction?: string,
  formEncType?: string,
  formMethod?: string,
  formNoValidate?: boolean,
  formTarget?: string,
  href?: string,
  name?: string,
  rel?: string,
  role?: 'button' | 'radio',
  tabindex?: number,
  target?: string,
  type?: string,
  value?: string | number
}

export interface ButtonAria {
  buttonProps: ComputedRef<ButtonProps>,
  isDisabled: ComputedRef<boolean>,
  isPressed: Ref<boolean>,
  press: () => void,
  pressEnd: () => void,
  pressStart: () => void
}

export function useButton(options: AriaButtonOptions = {}): ButtonAria {
  let elementType = computed(() => String(unref(options.elementType ?? 'button')));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)));
  let resolvedType = computed(() => String(unref(options.type ?? 'button')));
  let isPressed = ref(false);

  let buttonProps = computed<ButtonProps>(() => {
    let explicitAriaDisabled = unref(options.ariaDisabled);
    let nextButtonProps: ButtonProps = {
      'aria-controls': unref(options.ariaControls),
      'aria-current': unref(options.ariaCurrent),
      'aria-expanded': unref(options.ariaExpanded),
      'aria-haspopup': unref(options.ariaHasPopup),
      'aria-pressed': unref(options.ariaPressed)
    };

    if (elementType.value === 'button') {
      nextButtonProps.type = resolvedType.value;
      nextButtonProps.disabled = isDisabled.value || undefined;
      nextButtonProps.form = unref(options.form);
      nextButtonProps.formAction = unref(options.formAction);
      nextButtonProps.formEncType = unref(options.formEncType);
      nextButtonProps.formMethod = unref(options.formMethod);
      nextButtonProps.formNoValidate = unref(options.formNoValidate);
      nextButtonProps.formTarget = unref(options.formTarget);
      nextButtonProps.name = unref(options.name);
      nextButtonProps.value = unref(options.value);
    } else {
      nextButtonProps.role = 'button';
      nextButtonProps.tabindex = isDisabled.value ? undefined : 0;

      if (elementType.value === 'a') {
        if (!isDisabled.value) {
          nextButtonProps.href = unref(options.href);
        }
        nextButtonProps.target = unref(options.target);
        nextButtonProps.rel = unref(options.rel);
      }

      if (elementType.value === 'input') {
        nextButtonProps.type = resolvedType.value;
        nextButtonProps.disabled = isDisabled.value || undefined;
      }
    }

    if (explicitAriaDisabled !== undefined) {
      nextButtonProps['aria-disabled'] = explicitAriaDisabled;
    } else if (elementType.value !== 'button' && elementType.value !== 'input' && isDisabled.value) {
      nextButtonProps['aria-disabled'] = true;
    }

    return nextButtonProps;
  });

  let pressStart = () => {
    if (isDisabled.value || isPressed.value) {
      return;
    }

    isPressed.value = true;
    options.onPressStart?.();
    options.onPressChange?.(true);
  };

  let pressEnd = () => {
    if (!isPressed.value) {
      return;
    }

    isPressed.value = false;
    options.onPressEnd?.();
    options.onPressChange?.(false);
  };

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    pressStart();
    options.onPress?.();
    options.onClick?.();
    pressEnd();
  };

  return {
    buttonProps,
    isDisabled,
    isPressed,
    press,
    pressEnd,
    pressStart
  };
}
