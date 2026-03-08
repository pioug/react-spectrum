import '@adobe/spectrum-css-temp/components/button/vars.css';
import './stateClassOverrides.css';
import {ProgressCircle} from '@vue-spectrum/progress';
import {useProviderProps} from '@vue-spectrum/provider';
import {classNames} from '@vue-spectrum/utils';
import {
  cloneVNode,
  computed,
  type ComputedRef,
  defineComponent,
  h,
  isVNode,
  mergeProps,
  onBeforeUnmount,
  type PropType,
  ref,
  Text as VueText,
  type VNode,
  type VNodeChild,
  watch
} from 'vue';
import {getEventTarget, isAppleDevice, isFirefox, useId} from '@vue-aria/utils';
const styles: {[key: string]: string} = {};


type ButtonElementType = 'a' | 'button' | 'div' | 'span';
type ButtonNativeType = 'button' | 'reset' | 'submit';
type ButtonVariant = 'accent' | 'cta' | 'negative' | 'overBackground' | 'primary' | 'secondary';
type ButtonStyle = 'fill' | 'outline';
type StaticColor = 'black' | 'white';
type LogicButtonVariant = 'and' | 'or';

type EventHandler<EventType> = ((event: EventType) => void) | Array<(event: EventType) => void> | undefined;

let hasGlobalModalityListeners = false;
let isKeyboardModality = true;
const PENDING_LABEL = 'pending';

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

function hasVisibleTextChild(value: unknown): boolean {
  if (value == null || typeof value === 'boolean') {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(hasVisibleTextChild);
  }

  if (typeof value === 'object' && 'children' in (value as Record<string, unknown>)) {
    return hasVisibleTextChild((value as {children?: unknown}).children);
  }

  return false;
}

function isTextOnlyChild(value: unknown): boolean {
  if (value == null || typeof value === 'boolean') {
    return true;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isTextOnlyChild);
  }

  if (isVNode(value)) {
    if (value.type !== VueText) {
      return false;
    }

    return isTextOnlyChild(value.children);
  }

  return false;
}

function toClassTokens(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => toClassTokens(entry));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, isEnabled]) => Boolean(isEnabled))
      .map(([className]) => className);
  }

  return [];
}

function mergeClassTokens(...values: unknown[]): string | undefined {
  let merged = Array.from(new Set(values.flatMap((value) => toClassTokens(value))));
  return merged.length > 0 ? merged.join(' ') : undefined;
}

function normalizeButtonChildren(
  children: VNodeChild[],
  options: {
    iconClassName: string,
    iconId?: string,
    labelClassName: string,
    labelId?: string
  }
): {
  children: VNodeChild[],
  hasIcon: boolean,
  hasLabel: boolean
} {
  let hasIcon = false;
  let hasLabel = false;
  let assignedIconId = false;
  let assignedLabelId = false;

  let visit = (value: VNodeChild): VNodeChild[] => {
    if (Array.isArray(value)) {
      return value.flatMap((entry) => visit(entry));
    }

    if (value == null || typeof value === 'boolean') {
      return [];
    }

    if (typeof value === 'string' || typeof value === 'number') {
      let text = String(value);
      if (text.trim().length === 0) {
        return [];
      }

      hasLabel = true;

      let labelProps: Record<string, unknown> = {
        class: options.labelClassName,
        role: 'none'
      };

      if (!assignedLabelId && options.labelId) {
        labelProps.id = options.labelId;
        assignedLabelId = true;
      }

      return [h('span', labelProps, text)];
    }

    if (!isVNode(value)) {
      return [value];
    }

    if (value.type === VueText) {
      let text = typeof value.children === 'string' || typeof value.children === 'number'
        ? String(value.children)
        : '';

      if (text.trim().length === 0) {
        return [];
      }

      hasLabel = true;

      let labelProps: Record<string, unknown> = {
        class: options.labelClassName,
        role: 'none'
      };

      if (!assignedLabelId && options.labelId) {
        labelProps.id = options.labelId;
        assignedLabelId = true;
      }

      return [h('span', labelProps, text)];
    }

    let classTokens = toClassTokens(value.props?.class);
    let isLabelNode = classTokens.includes(options.labelClassName) || hasVisibleTextChild(value);
    if (isLabelNode) {
      hasLabel = true;

      let labelProps: Record<string, unknown> = {
        class: mergeClassTokens(value.props?.class, options.labelClassName),
        role: value.props?.role ?? 'none'
      };

      if (!assignedLabelId && options.labelId) {
        labelProps.id = options.labelId;
        assignedLabelId = true;
      }

      return [cloneVNode(value, labelProps, true)];
    }

    if (typeof value.type === 'string' && value.type !== 'svg') {
      return [value];
    }

    hasIcon = true;

    let iconProps: Record<string, unknown> = {};

    if (!assignedIconId && options.iconId) {
      iconProps.id = options.iconId;
      assignedIconId = true;
    }

    if (typeof value.type !== 'string') {
      iconProps.class = mergeClassTokens(options.iconClassName);
      iconProps.size = value.props?.size ?? 'S';
    } else if (value.type === 'svg') {
      let shouldAddDefaultIconSize = !classTokens.includes(options.iconClassName)
        && !classTokens.some((token) => token.startsWith('spectrum-Icon--size'));
      iconProps.class = mergeClassTokens(
        options.iconClassName,
        shouldAddDefaultIconSize ? 'spectrum-Icon--sizeS' : undefined
      );
      iconProps.focusable = value.props?.focusable ?? 'false';
      iconProps.role = value.props?.role ?? 'img';
    }

    return [cloneVNode(value, iconProps, true)];
  };

  return {
    children: children.flatMap((child) => visit(child)),
    hasIcon,
    hasLabel
  };
}

function mergePressedUserSelectStyle(styleValue: unknown): unknown {
  if (styleValue == null) {
    return {userSelect: 'none'};
  }

  if (typeof styleValue === 'string') {
    if (/user-select\s*:/.test(styleValue)) {
      return styleValue;
    }

    let needsDelimiter = styleValue.trim().length > 0 && !styleValue.trim().endsWith(';');
    return `${styleValue}${needsDelimiter ? ';' : ''} user-select: none;`;
  }

  if (Array.isArray(styleValue)) {
    return [
      ...styleValue,
      {userSelect: 'none'}
    ];
  }

  if (typeof styleValue === 'object') {
    return {
      ...(styleValue as Record<string, unknown>),
      userSelect: 'none'
    };
  }

  return styleValue;
}

function useInteractionState(isDisabled: ComputedRef<boolean>) {
  ensureGlobalModalityListeners();

  let isFocused = ref(false);
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
    isFocusVisible.value = false;
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
      if (isFocused.value) {
        isFocusVisible.value = true;
      }
      isPressed.value = true;
    }
  };

  let onKeyUp = () => {
    isPressed.value = false;
  };

  let onFocus = (event: FocusEvent) => {
    isFocused.value = true;
    let target = getEventTarget(event);
    if (target instanceof HTMLElement && target.matches(':focus-visible')) {
      isFocusVisible.value = true;
      return;
    }

    isFocusVisible.value = isKeyboardModality;
  };

  let onBlur = () => {
    isFocused.value = false;
    isPressed.value = false;
    isFocusVisible.value = false;
  };

  return {
    isFocused,
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
    isPending?: boolean,
    isDisabled?: boolean,
    rel?: string,
    target?: string,
    type?: ButtonNativeType
  },
  attrs: Record<string, unknown>,
  emitClick: (event: MouseEvent) => void
) {
  let isDisabled = computed(() => Boolean(props.disabled || props.isDisabled));
  let isUnavailable = computed(() => Boolean(isDisabled.value || props.isPending));
  let elementType = computed(() => props.elementType ?? 'button');
  let interaction = useInteractionState(isDisabled);

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
    let unsafeStyle = attrs.UNSAFE_style ?? attrs.unsafeStyle;
    let styleValue = unsafeStyle ?? attrs.style;

    let propsForElement: Record<string, unknown> = {
      ...attrs,
      autofocus: props.autoFocus || attrs.autofocus || undefined,
      'data-react-aria-pressable': 'true',
      onBlur: (event: FocusEvent) => {
        invokeEventHandler(userBlur, event);
        interaction.onBlur(event);
      },
      onClick: (event: MouseEvent) => {
        if (isUnavailable.value) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        invokeEventHandler(userClick, event);
        emitClick(event);
      },
      onFocus: (event: FocusEvent) => {
        invokeEventHandler(userFocus, event);
        interaction.onFocus(event);
      },
      onKeydown: (event: KeyboardEvent) => {
        if (!isUnavailable.value) {
          invokeEventHandler(userKeyDown, event);
          interaction.onKeyDown(event);
        }
      },
      onKeyup: (event: KeyboardEvent) => {
        invokeEventHandler(userKeyUp, event);
        interaction.onKeyUp(event);
      },
      onMouseenter: (event: MouseEvent) => {
        invokeEventHandler(userMouseEnter, event);
        interaction.onMouseEnter();
      },
      onMouseleave: (event: MouseEvent) => {
        invokeEventHandler(userMouseLeave, event);
        interaction.onMouseLeave();
      },
      onPointercancel: (event: PointerEvent) => {
        invokeEventHandler(userPointerCancel, event);
        interaction.onPointerCancel();
      },
      onPointerdown: (event: PointerEvent) => {
        if (isUnavailable.value) {
          return;
        }

        invokeEventHandler(userPointerDown, event);
        interaction.onPointerDown(event);
      },
      onPointerleave: (event: PointerEvent) => {
        invokeEventHandler(userPointerLeave, event);
        interaction.onPointerLeave();
      },
      onPointerup: (event: PointerEvent) => {
        invokeEventHandler(userPointerUp, event);
        interaction.onPointerUp();
      }
    };

    delete propsForElement.UNSAFE_style;
    delete propsForElement.unsafeStyle;

    if (interaction.isPressed.value) {
      propsForElement.style = mergePressedUserSelectStyle(styleValue);
    } else {
      propsForElement.style = styleValue ?? null;
      if (propsForElement.style === '') {
        propsForElement.style = null;
      }
    }

    if (elementType.value === 'button') {
      propsForElement.type = props.type ?? 'button';
      propsForElement.disabled = isDisabled.value || undefined;
      propsForElement.tabindex = isDisabled.value ? undefined : attrs.tabindex ?? 0;
      propsForElement['aria-disabled'] = props.isPending ? 'true' : undefined;
      return propsForElement;
    }

    propsForElement.role = 'button';
    propsForElement.tabindex = isDisabled.value ? undefined : attrs.tabindex ?? 0;
    propsForElement['aria-disabled'] = props.isPending ? 'true' : undefined;

    if (elementType.value === 'a') {
      propsForElement.href = isUnavailable.value ? undefined : props.href;
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
    isPending: {
      type: Boolean,
      default: false
    },
    style: {
      type: String as PropType<ButtonStyle | undefined>,
      default: undefined
    },
    staticColor: {
      type: String as PropType<StaticColor | undefined>,
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
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));
    let baseButtonProps = new Proxy(props as typeof props, {
      get(_target, key) {
        return (resolvedProps.value as Record<string, unknown>)[key as string];
      }
    }) as typeof props;
    let pendingTimer = ref<ReturnType<typeof setTimeout> | null>(null);
    let isProgressVisible = ref(false);
    let fallbackButtonId = useId();
    let iconId = useId();
    let textId = useId();
    let spinnerId = useId();

    watch(() => props.isPending, (isPending) => {
      if (pendingTimer.value) {
        clearTimeout(pendingTimer.value);
        pendingTimer.value = null;
      }

      if (!isPending) {
        isProgressVisible.value = false;
        return;
      }

      pendingTimer.value = setTimeout(() => {
        isProgressVisible.value = true;
      }, 1000);
    }, {immediate: true});

    onBeforeUnmount(() => {
      if (pendingTimer.value) {
        clearTimeout(pendingTimer.value);
      }
    });

    let resolvedVariant = computed(() => {
      if (resolvedProps.value.variant === 'cta') {
        return 'accent';
      }

      if (resolvedProps.value.variant === 'overBackground') {
        return 'primary';
      }

      return resolvedProps.value.variant;
    });

    let resolvedStyle = computed<ButtonStyle>(() => {
      if (resolvedProps.value.style) {
        return resolvedProps.value.style;
      }

      return resolvedProps.value.variant === 'accent' || resolvedProps.value.variant === 'cta' ? 'fill' : 'outline';
    });

    let resolvedStaticColor = computed<StaticColor | undefined>(() => {
      if (resolvedProps.value.variant === 'overBackground') {
        return 'white';
      }

      return resolvedProps.value.staticColor;
    });

    let buttonState = useBaseButtonSemantics(
      baseButtonProps,
      attrs as Record<string, unknown>,
      (event) => emit('click', event)
    );

    return () => {
      let children = slots.default ? slots.default() : ['Button'];
      let buttonId = String(buttonState.domProps.value.id ?? fallbackButtonId);
      let normalizedChildren = normalizeButtonChildren(Array.isArray(children) ? children : [children], {
        iconClassName: classNames(styles, 'spectrum-Icon'),
        iconId,
        labelClassName: classNames(styles, 'spectrum-Button-label'),
        labelId: textId
      });
      let hasAriaLabel = typeof buttonState.domProps.value['aria-label'] === 'string' || typeof buttonState.domProps.value['aria-labelledby'] === 'string';
      let pendingAriaLabel = `${hasAriaLabel && typeof buttonState.domProps.value['aria-label'] === 'string' ? buttonState.domProps.value['aria-label'] : ''} ${PENDING_LABEL}`.trim();
      let pendingAriaLabelledby = hasAriaLabel
        ? String(buttonState.domProps.value['aria-labelledby'] ?? spinnerId).replace(buttonId, spinnerId)
        : `${normalizedChildren.hasIcon ? iconId : ''} ${normalizedChildren.hasLabel ? textId : ''} ${spinnerId}`.trim();
      let ariaLive = isAppleDevice() && (!hasAriaLabel || isFirefox()) ? 'off' : 'polite';

      let buttonProps = {
        ...buttonState.domProps.value,
        id: buttonId,
        class: [
          classNames(
            styles,
            'i18nFontFamily',
            'spectrum-BaseButton',
            'spectrum-Button',
            'spectrum-FocusRing',
            'spectrum-FocusRing-ring',
            {
              'focus-ring': buttonState.interaction.isFocusVisible.value,
              'is-active': buttonState.interaction.isPressed.value,
              'is-disabled': buttonState.isDisabled.value || isProgressVisible.value,
              'is-hovered': buttonState.interaction.isHovered.value,
              'spectrum-Button--iconOnly': normalizedChildren.hasIcon && !normalizedChildren.hasLabel,
              'spectrum-Button--pending': isProgressVisible.value
            }
          ),
          attrs.class
        ],
        'data-static-color': resolvedStaticColor.value || undefined,
        'data-style': resolvedStyle.value,
        'data-variant': resolvedVariant.value,
        'aria-label': resolvedProps.value.isPending ? pendingAriaLabel : buttonState.domProps.value['aria-label'],
        'aria-labelledby': resolvedProps.value.isPending ? pendingAriaLabelledby : buttonState.domProps.value['aria-labelledby']
      };
      let renderedChildren = [...normalizedChildren.children];

      if (resolvedProps.value.isPending) {
        buttonProps['aria-disabled'] = 'true';
        renderedChildren.push(
          h('div', {
            'aria-hidden': 'true',
            class: classNames(styles, 'spectrum-Button-circleLoader'),
            style: {visibility: isProgressVisible.value ? 'visible' : 'hidden'}
          }, [
            h(ProgressCircle, {
              'aria-label': pendingAriaLabel,
              isIndeterminate: true,
              size: 'S',
              staticColor: resolvedStaticColor.value
            })
          ])
        );

        renderedChildren.push(
          h('div', {
            'aria-live': buttonState.interaction.isFocused.value ? ariaLive : 'off'
          }, isProgressVisible.value
            ? [
              h('div', {
                role: 'img',
                'aria-labelledby': pendingAriaLabelledby
              })
            ]
            : []
          )
        );
        renderedChildren.push(
          h('div', {
            id: spinnerId,
            role: 'img',
            'aria-label': pendingAriaLabel
          })
        );
      }

      if (resolvedProps.value.render) {
        return resolvedProps.value.render(buttonProps, renderedChildren);
      }

      return h(buttonState.elementType.value, buttonProps, renderedChildren);
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

    return () => {
      let children = slots.default ? slots.default() : ['Action'];
      let renderedChildren = normalizeButtonChildren(children.every(isTextOnlyChild)
        ? [h('span', {
          class: classNames(styles, 'spectrum-ActionButton-label')
        }, children)]
        : children, {
        iconClassName: classNames(styles, 'spectrum-Icon'),
        labelClassName: classNames(styles, 'spectrum-ActionButton-label')
      }).children;

      return h(state.elementType.value, {
        ...state.domProps.value,
        class: [
          classNames(
            styles,
            'i18nFontFamily',
            'spectrum-ActionButton',
            'spectrum-BaseButton',
            'spectrum-FocusRing',
            'spectrum-FocusRing-ring',
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
          ),
          attrs.class
        ]
      }, renderedChildren);
    };
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
    variant: {
      type: String as PropType<ButtonVariant | undefined>,
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

    return () => {
      let children = slots.default ? slots.default() : ['Toggle'];
      let renderedChildren = normalizeButtonChildren(children.every(isTextOnlyChild)
        ? [h('span', {
          class: classNames(styles, 'spectrum-ActionButton-label')
        }, children)]
        : children, {
        iconClassName: classNames(styles, 'spectrum-Icon'),
        labelClassName: classNames(styles, 'spectrum-ActionButton-label')
      }).children;

      return h(state.elementType.value, {
        ...state.domProps.value,
        'aria-pressed': selected.value ? 'true' : 'false',
        class: [
          classNames(
            styles,
            'i18nFontFamily',
            'spectrum-ActionButton',
            'spectrum-BaseButton',
            'spectrum-FocusRing',
            'spectrum-FocusRing-ring',
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
          ),
          attrs.class
        ]
      }, renderedChildren);
    };
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
      type: String as PropType<LogicButtonVariant | undefined>,
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

    return () => {
      let children = slots.default ? slots.default() : [props.variant?.toUpperCase() ?? 'LOGIC'];

      return h(state.elementType.value, {
        ...state.domProps.value,
        class: [
          classNames(
            styles,
            'i18nFontFamily',
            'spectrum-LogicButton',
            'spectrum-BaseButton',
            'spectrum-FocusRing',
            'spectrum-FocusRing-ring',
            {
              'focus-ring': state.interaction.isFocusVisible.value,
              'is-active': state.interaction.isPressed.value,
              'is-disabled': state.isDisabled.value,
              'is-hovered': state.interaction.isHovered.value,
              [`spectrum-LogicButton--${props.variant}`]: !!props.variant
            }
          ),
          attrs.class
        ]
      }, [
        h('span', {
          class: classNames(styles, 'spectrum-Button-label')
        }, children)
      ]);
    };
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

export type {
  SpectrumActionButtonProps,
  SpectrumButtonProps,
  SpectrumLogicButtonProps,
  SpectrumToggleButtonProps
} from '@vue-types/button';
