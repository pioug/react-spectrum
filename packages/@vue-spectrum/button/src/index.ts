import '@adobe/spectrum-css-temp/components/button/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, type ComputedRef, defineComponent, h, type PropType, ref} from 'vue';
import {getEventTarget} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


type ButtonElementType = 'a' | 'button' | 'div' | 'span';
type ButtonNativeType = 'button' | 'reset' | 'submit';
type ButtonVariant = 'accent' | 'cta' | 'negative' | 'overBackground' | 'primary' | 'secondary';
type ButtonFillStyle = 'fill' | 'outline';
type StaticColor = 'black' | 'white';
type LogicButtonVariant = 'and' | 'or';

type EventHandler<EventType> = ((event: EventType) => void) | Array<(event: EventType) => void> | undefined;

let hasGlobalModalityListeners = false;
let isKeyboardModality = true;

function ensureGlobalModalityListeners() {
  if (hasGlobalModalityListeners || typeof window === 'undefined') {
    return;
  }

  hasGlobalModalityListeners = true;
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }
    isKeyboardModality = true;
  }, true);

  let pointerHandler = () => {
    isKeyboardModality = false;
  };

  window.addEventListener('pointerdown', pointerHandler, true);
  window.addEventListener('mousedown', pointerHandler, true);
  window.addEventListener('touchstart', pointerHandler, true);
}

function invokeEventHandler<EventType>(handler: EventHandler<EventType>, event: EventType) {
  if (!handler) {
    return;
  }

  if (Array.isArray(handler)) {
    for (let item of handler) {
      item(event);
    }
    return;
  }

  handler(event);
}

function chainHandlers<EventType>(userHandler: EventHandler<EventType>, ownHandler: (event: EventType) => void) {
  return (event: EventType) => {
    invokeEventHandler(userHandler, event);
    ownHandler(event);
  };
}

function useInteractionState(isDisabled: ComputedRef<boolean>) {
  ensureGlobalModalityListeners();

  let isHovered = ref(false);
  let isPressed = ref(false);
  let isFocusVisible = ref(false);

  let onMouseEnter = () => {
    if (isDisabled.value) {
      return;
    }
    isHovered.value = true;
  };

  let onMouseLeave = () => {
    isHovered.value = false;
    isPressed.value = false;
  };

  let onPointerDown = (event: PointerEvent) => {
    if (isDisabled.value || event.button !== 0) {
      return;
    }
    isPressed.value = true;
  };

  let onPointerUp = () => {
    isPressed.value = false;
  };

  let onPointerCancel = () => {
    isPressed.value = false;
  };

  let onPointerLeave = () => {
    isPressed.value = false;
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled.value) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      isPressed.value = true;
    }
  };

  let onKeyUp = () => {
    isPressed.value = false;
  };

  let onFocus = (event: FocusEvent) => {
    let target = getEventTarget(event);
    if (target instanceof HTMLElement && target.matches(':focus-visible')) {
      isFocusVisible.value = true;
      return;
    }

    isFocusVisible.value = isKeyboardModality;
  };

  let onBlur = () => {
    isPressed.value = false;
    isFocusVisible.value = false;
  };

  return {
    isHovered,
    isPressed,
    isFocusVisible,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur
  };
}

function useBaseButtonSemantics(
  props: {
    autoFocus?: boolean,
    disabled?: boolean,
    elementType?: ButtonElementType,
    href?: string,
    isDisabled?: boolean,
    rel?: string,
    target?: string,
    type?: ButtonNativeType
  },
  attrs: Record<string, unknown>,
  emitClick: (event: MouseEvent) => void
) {
  let isDisabled = computed(() => Boolean(props.disabled || props.isDisabled));
  let elementType = computed(() => props.elementType ?? 'button');
  let interaction = useInteractionState(isDisabled);

  let onClick = (event: MouseEvent) => {
    if (isDisabled.value) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    emitClick(event);
  };

  let domProps = computed(() => {
    let userClick = attrs.onClick as EventHandler<MouseEvent>;
    let userMouseEnter = attrs.onMouseenter as EventHandler<MouseEvent>;
    let userMouseLeave = attrs.onMouseleave as EventHandler<MouseEvent>;
    let userPointerDown = attrs.onPointerdown as EventHandler<PointerEvent>;
    let userPointerUp = attrs.onPointerup as EventHandler<PointerEvent>;
    let userPointerCancel = attrs.onPointercancel as EventHandler<PointerEvent>;
    let userPointerLeave = attrs.onPointerleave as EventHandler<PointerEvent>;
    let userFocus = attrs.onFocus as EventHandler<FocusEvent>;
    let userBlur = attrs.onBlur as EventHandler<FocusEvent>;
    let userKeyDown = attrs.onKeydown as EventHandler<KeyboardEvent>;
    let userKeyUp = attrs.onKeyup as EventHandler<KeyboardEvent>;

    let propsForElement: Record<string, unknown> = {
      ...attrs,
      autofocus: props.autoFocus || attrs.autofocus || undefined,
      onBlur: chainHandlers(userBlur, interaction.onBlur),
      onClick: chainHandlers(userClick, onClick),
      onFocus: chainHandlers(userFocus, interaction.onFocus),
      onKeydown: chainHandlers(userKeyDown, interaction.onKeyDown),
      onKeyup: chainHandlers(userKeyUp, interaction.onKeyUp),
      onMouseenter: chainHandlers(userMouseEnter, interaction.onMouseEnter),
      onMouseleave: chainHandlers(userMouseLeave, interaction.onMouseLeave),
      onPointercancel: chainHandlers(userPointerCancel, interaction.onPointerCancel),
      onPointerdown: chainHandlers(userPointerDown, interaction.onPointerDown),
      onPointerleave: chainHandlers(userPointerLeave, interaction.onPointerLeave),
      onPointerup: chainHandlers(userPointerUp, interaction.onPointerUp)
    };

    if (elementType.value === 'button') {
      propsForElement.type = props.type ?? 'button';
      propsForElement.disabled = isDisabled.value || undefined;
      propsForElement['aria-disabled'] = isDisabled.value ? 'true' : undefined;
      return propsForElement;
    }

    propsForElement.role = 'button';
    propsForElement.tabindex = isDisabled.value ? undefined : 0;
    propsForElement['aria-disabled'] = isDisabled.value ? 'true' : undefined;

    if (elementType.value === 'a') {
      propsForElement.href = isDisabled.value ? undefined : props.href;
      propsForElement.target = props.target;
      propsForElement.rel = props.rel;
    }

    return propsForElement;
  });

  return {
    domProps,
    elementType,
    interaction,
    isDisabled
  };
}

function buttonLegacyClass(variant: string, isDisabled: boolean) {
  let legacyVariant = variant === 'secondary' ? 'secondary' : 'primary';
  return [
    'vs-button',
    `vs-button--${legacyVariant}`,
    'vs-button--medium',
    isDisabled ? 'is-disabled' : null
  ];
}

const sharedButtonProps = {
  autoFocus: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  elementType: {
    type: String as PropType<ButtonElementType>,
    default: 'button'
  },
  href: {
    type: String,
    default: undefined
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  rel: {
    type: String,
    default: undefined
  },
  target: {
    type: String,
    default: undefined
  },
  type: {
    type: String as PropType<ButtonNativeType>,
    default: 'button'
  }
} as const;

export const VueButton = defineComponent({
  name: 'VueButton',
  inheritAttrs: false,
  props: {
    ...sharedButtonProps,
    staticColor: {
      type: String as PropType<StaticColor | undefined>,
      default: undefined
    },
    style: {
      type: String as PropType<ButtonFillStyle | undefined>,
      default: undefined
    },
    render: {
      type: Function as PropType<(props: Record<string, unknown>, children: unknown) => unknown>,
      default: undefined
    },
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary'
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {attrs, emit, slots}) {
    let resolvedVariant = computed(() => {
      if (props.variant === 'cta') {
        return 'accent';
      }

      if (props.variant === 'overBackground') {
        return 'primary';
      }

      return props.variant;
    });

    let resolvedStyle = computed(() => {
      if (props.style) {
        return props.style;
      }

      return resolvedVariant.value === 'accent' ? 'fill' : 'outline';
    });

    let resolvedStaticColor = computed<StaticColor | undefined>(() => {
      if (props.variant === 'overBackground') {
        return 'white';
      }

      return props.staticColor;
    });

    let buttonState = useBaseButtonSemantics(
      props,
      attrs as Record<string, unknown>,
      (event) => emit('click', event)
    );

    let buttonClass = computed(() => classNames(
      styles,
      'spectrum-Button',
      {
        'focus-ring': buttonState.interaction.isFocusVisible.value,
        'is-active': buttonState.interaction.isPressed.value,
        'is-disabled': buttonState.isDisabled.value,
        'is-hovered': buttonState.interaction.isHovered.value
      }
    ));

    return () => {
      let buttonProps = {
      ...buttonState.domProps.value,
      class: [
        buttonClass.value,
        buttonLegacyClass(resolvedVariant.value, buttonState.isDisabled.value),
        attrs.class
      ],
      'data-vac': '',
      'data-static-color': resolvedStaticColor.value || undefined,
      'data-style': resolvedStyle.value,
      'data-variant': resolvedVariant.value
      };
      let children = slots.default ? slots.default() : 'Button';

      if (props.render) {
        return props.render(buttonProps, children);
      }

      return h(buttonState.elementType.value, buttonProps, children);
    };
  }
});

export const Button = VueButton;

export const ActionButton = defineComponent({
  name: 'VueActionButton',
  inheritAttrs: false,
  props: {
    ...sharedButtonProps,
    isQuiet: {
      type: Boolean,
      default: false
    },
    staticColor: {
      type: String as PropType<StaticColor | undefined>,
      default: undefined
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {attrs, emit, slots}) {
    let state = useBaseButtonSemantics(
      props,
      attrs as Record<string, unknown>,
      (event) => emit('click', event)
    );

    let actionClass = computed(() => classNames(
      styles,
      'spectrum-ActionButton',
      {
        'focus-ring': state.interaction.isFocusVisible.value,
        'is-active': state.interaction.isPressed.value,
        'is-disabled': state.isDisabled.value,
        'is-hovered': state.interaction.isHovered.value,
        'spectrum-ActionButton--quiet': props.isQuiet,
        'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
        'spectrum-ActionButton--staticColor': !!props.staticColor,
        'spectrum-ActionButton--staticWhite': props.staticColor === 'white'
      }
    ));

    return () => h(state.elementType.value, {
      ...state.domProps.value,
      class: [
        actionClass.value,
        'vs-button',
        'vs-button--secondary',
        'vs-button--medium',
        state.isDisabled.value ? 'is-disabled' : null,
        attrs.class
      ],
      'data-vac': ''
    }, slots.default ? slots.default() : 'Action');
  }
});

export const ToggleButton = defineComponent({
  name: 'VueToggleButton',
  inheritAttrs: false,
  props: {
    ...sharedButtonProps,
    isEmphasized: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    modelValue: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    staticColor: {
      type: String as PropType<StaticColor | undefined>,
      default: undefined
    }
  },
  emits: {
    change: (value: boolean) => typeof value === 'boolean',
    click: (event: MouseEvent) => event instanceof MouseEvent,
    'update:modelValue': (value: boolean) => typeof value === 'boolean'
  },
  setup(props, {attrs, emit, slots}) {
    let selected = computed(() => props.isSelected ?? props.modelValue ?? false);
    let state = useBaseButtonSemantics(
      props,
      attrs as Record<string, unknown>,
      (event) => {
        let nextSelected = !selected.value;
        emit('update:modelValue', nextSelected);
        emit('change', nextSelected);
        emit('click', event);
      }
    );

    let toggleClass = computed(() => classNames(
      styles,
      'spectrum-ActionButton',
      {
        'focus-ring': state.interaction.isFocusVisible.value,
        'is-active': state.interaction.isPressed.value,
        'is-disabled': state.isDisabled.value,
        'is-hovered': state.interaction.isHovered.value,
        'is-selected': selected.value,
        'spectrum-ActionButton--emphasized': props.isEmphasized,
        'spectrum-ActionButton--quiet': props.isQuiet,
        'spectrum-ActionButton--staticBlack': props.staticColor === 'black',
        'spectrum-ActionButton--staticColor': !!props.staticColor,
        'spectrum-ActionButton--staticWhite': props.staticColor === 'white'
      }
    ));

    return () => h(state.elementType.value, {
      ...state.domProps.value,
      'aria-pressed': selected.value ? 'true' : 'false',
      class: [
        toggleClass.value,
        'vs-button',
        'vs-button--secondary',
        'vs-button--medium',
        state.isDisabled.value ? 'is-disabled' : null,
        selected.value ? 'is-selected' : null,
        attrs.class
      ],
      'data-vac': ''
    }, slots.default ? slots.default() : 'Toggle');
  }
});

export const FieldButton = defineComponent({
  name: 'VueFieldButton',
  inheritAttrs: false,
  props: {
    ...sharedButtonProps,
    isActive: {
      type: Boolean,
      default: false
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isQuiet: {
      type: Boolean,
      default: false
    },
    validationState: {
      type: String as PropType<'invalid' | 'valid' | undefined>,
      default: undefined
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {attrs, emit, slots}) {
    let state = useBaseButtonSemantics(
      props,
      attrs as Record<string, unknown>,
      (event) => emit('click', event)
    );

    let fieldClass = computed(() => classNames(
      styles,
      'spectrum-FieldButton',
      {
        'focus-ring': state.interaction.isFocusVisible.value,
        'is-active': props.isActive || state.interaction.isPressed.value,
        'is-disabled': state.isDisabled.value,
        'is-hovered': state.interaction.isHovered.value,
        'spectrum-FieldButton--invalid': props.isInvalid || props.validationState === 'invalid',
        'spectrum-FieldButton--quiet': props.isQuiet
      }
    ));

    return () => h(state.elementType.value, {
      ...state.domProps.value,
      class: [
        fieldClass.value,
        'vs-button',
        'vs-button--secondary',
        'vs-button--medium',
        state.isDisabled.value ? 'is-disabled' : null,
        attrs.class
      ],
      'data-vac': ''
    }, slots.default ? slots.default() : 'Field');
  }
});

export const LogicButton = defineComponent({
  name: 'VueLogicButton',
  inheritAttrs: false,
  props: {
    ...sharedButtonProps,
    variant: {
      type: String as PropType<LogicButtonVariant>,
      default: 'and'
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {attrs, emit, slots}) {
    let state = useBaseButtonSemantics(
      props,
      attrs as Record<string, unknown>,
      (event) => emit('click', event)
    );

    let logicClass = computed(() => classNames(
      styles,
      'spectrum-LogicButton',
      {
        'focus-ring': state.interaction.isFocusVisible.value,
        'is-active': state.interaction.isPressed.value,
        'is-disabled': state.isDisabled.value,
        'is-hovered': state.interaction.isHovered.value,
        [`spectrum-LogicButton--${props.variant}`]: true
      }
    ));

    return () => h(state.elementType.value, {
      ...state.domProps.value,
      class: [logicClass.value, attrs.class],
      'data-vac': ''
    }, slots.default ? slots.default() : props.variant.toUpperCase());
  }
});

export const ClearButton = defineComponent({
  name: 'VueClearButton',
  inheritAttrs: false,
  props: {
    ...sharedButtonProps,
    inset: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as PropType<'overBackground' | undefined>,
      default: undefined
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {attrs, emit, slots}) {
    let state = useBaseButtonSemantics(
      props,
      attrs as Record<string, unknown>,
      (event) => emit('click', event)
    );

    let clearClass = computed(() => classNames(
      styles,
      'spectrum-ClearButton',
      {
        'focus-ring': state.interaction.isFocusVisible.value,
        'is-active': state.interaction.isPressed.value,
        'is-disabled': state.isDisabled.value,
        'is-hovered': state.interaction.isHovered.value,
        'spectrum-ClearButton--inset': props.inset,
        [`spectrum-ClearButton--${props.variant}`]: !!props.variant
      }
    ));

    return () => h(state.elementType.value, {
      ...state.domProps.value,
      class: [clearClass.value, attrs.class],
      'data-vac': ''
    }, slots.default ? slots.default() : '×');
  }
});

export type SpectrumButtonProps = Record<string, unknown>;
export type SpectrumActionButtonProps = SpectrumButtonProps;
export type SpectrumLogicButtonProps = SpectrumButtonProps;
export type SpectrumToggleButtonProps = SpectrumButtonProps;
