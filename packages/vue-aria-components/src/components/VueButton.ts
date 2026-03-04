import {computed, defineComponent, h, ref, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type ButtonVariant = 'primary' | 'secondary' | 'quiet';
type ButtonType = 'button' | 'submit' | 'reset';
type PressPointerType = 'keyboard' | 'mouse' | 'pen' | 'touch' | 'virtual';
type EventHandler<EventType> = ((event: EventType) => void) | Array<(event: EventType) => void> | undefined;
type PressEvent = {
  altKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean,
  pointerType: PressPointerType,
  shiftKey: boolean,
  target: EventTarget | null,
  type: 'press' | 'pressend' | 'pressstart' | 'pressup'
};

function hasClassToken(value: unknown, token: string): boolean {
  if (!value) {
    return false;
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).includes(token);
  }

  if (Array.isArray(value)) {
    return value.some(item => hasClassToken(item, token));
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).some(([key, enabled]) => Boolean(enabled) && key === token);
  }

  return false;
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

function invokeAttrHandler<EventType>(attrs: Record<string, unknown>, keys: string[], event: EventType) {
  for (let key of keys) {
    invokeEventHandler(attrs[key] as EventHandler<EventType>, event);
  }
}

function isPressKeyboardEvent(event: KeyboardEvent) {
  return event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
}

function getPointerType(event: Event): PressPointerType {
  if (typeof PointerEvent !== 'undefined' && event instanceof PointerEvent) {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen' || event.pointerType === 'touch') {
      return event.pointerType;
    }
    return 'virtual';
  }

  if (event instanceof KeyboardEvent) {
    return 'keyboard';
  }

  if (event instanceof MouseEvent) {
    return 'mouse';
  }

  return 'virtual';
}

function toPressEvent(type: PressEvent['type'], event: Event, pointerType = getPointerType(event)): PressEvent {
  let keyboardLikeEvent = event as KeyboardEvent;
  return {
    type,
    pointerType,
    target: event.currentTarget ?? event.target,
    altKey: Boolean(keyboardLikeEvent.altKey),
    ctrlKey: Boolean(keyboardLikeEvent.ctrlKey),
    metaKey: Boolean(keyboardLikeEvent.metaKey),
    shiftKey: Boolean(keyboardLikeEvent.shiftKey)
  };
}

export const VueButton = defineComponent({
  name: 'VueButton',
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary'
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isPending: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent,
    press: (_event: PressEvent) => true,
    pressStart: (_event: PressEvent) => true,
    pressEnd: (_event: PressEvent) => true,
    pressUp: (_event: PressEvent) => true,
    pressChange: (isPressed: boolean) => typeof isPressed === 'boolean'
  },
  setup(props, {slots, emit, attrs}) {
    let context = getSpectrumContext();
    let isPressed = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isHovered = ref(false);
    let activePointerType = ref<PressPointerType>('mouse');
    let isDisabled = computed(() => props.disabled || props.isDisabled);
    let isUnavailable = computed(() => isDisabled.value || props.isPending);
    let attrsRecord = attrs as Record<string, unknown>;
    let externalClass = computed(() => attrsRecord.class);
    let usesExternalButtonBase = computed(() => hasClassToken(externalClass.value, 'button-base'));

    let classes = computed(() => ([
      usesExternalButtonBase.value ? null : 'vs-button',
      usesExternalButtonBase.value ? null : `vs-button--${props.variant}`,
      usesExternalButtonBase.value ? null : (context.value.scale === 'large' ? 'vs-button--large' : 'vs-button--medium'),
      isDisabled.value ? 'is-disabled' : null,
      props.isPending ? 'is-pending' : null,
      isPressed.value ? 'is-pressed' : null
    ]));

    let setPressed = (nextPressed: boolean) => {
      if (isPressed.value === nextPressed) {
        return;
      }

      isPressed.value = nextPressed;
      emit('pressChange', nextPressed);
    };

    let endPress = (event: Event, options: {emitPressUp?: boolean} = {}) => {
      if (!isPressed.value) {
        return;
      }

      emit('pressEnd', toPressEvent('pressend', event, activePointerType.value));
      if (options.emitPressUp) {
        emit('pressUp', toPressEvent('pressup', event, activePointerType.value));
      }
      setPressed(false);
    };

    let onPointerDown = (event: PointerEvent) => {
      invokeAttrHandler(attrsRecord, ['onPointerdown', 'onPointerDown'], event);
      if (isUnavailable.value || event.button !== 0) {
        return;
      }

      activePointerType.value = getPointerType(event);
      emit('pressStart', toPressEvent('pressstart', event, activePointerType.value));
      setPressed(true);
    };

    let onPointerUp = (event: PointerEvent) => {
      invokeAttrHandler(attrsRecord, ['onPointerup', 'onPointerUp'], event);
      if (!isPressed.value || event.button !== 0) {
        return;
      }

      activePointerType.value = getPointerType(event);
      endPress(event, {emitPressUp: true});
    };

    let onPointerCancel = (event: PointerEvent) => {
      invokeAttrHandler(attrsRecord, ['onPointercancel', 'onPointerCancel'], event);
      endPress(event);
    };

    let onPointerEnter = (event: PointerEvent) => {
      invokeAttrHandler(attrsRecord, ['onPointerenter', 'onPointerEnter'], event);
      if (!isUnavailable.value) {
        isHovered.value = true;
      }
    };

    let onPointerLeave = (event: PointerEvent) => {
      invokeAttrHandler(attrsRecord, ['onPointerleave', 'onPointerLeave'], event);
      isHovered.value = false;
      endPress(event);
    };

    let onMouseEnter = (event: MouseEvent) => {
      invokeAttrHandler(attrsRecord, ['onMouseenter', 'onMouseEnter'], event);
      if (!isUnavailable.value) {
        isHovered.value = true;
      }
    };

    let onMouseLeave = (event: MouseEvent) => {
      invokeAttrHandler(attrsRecord, ['onMouseleave', 'onMouseLeave'], event);
      isHovered.value = false;
    };

    let onFocus = (event: FocusEvent) => {
      invokeAttrHandler(attrsRecord, ['onFocus'], event);
      isFocused.value = true;
      let target = event.target;
      if (target instanceof HTMLElement && target.matches(':focus-visible')) {
        isFocusVisible.value = true;
      }
    };

    let onBlur = (event: FocusEvent) => {
      invokeAttrHandler(attrsRecord, ['onBlur'], event);
      isFocused.value = false;
      isFocusVisible.value = false;

      endPress(event);
    };

    let onKeyDown = (event: KeyboardEvent) => {
      invokeAttrHandler(attrsRecord, ['onKeydown', 'onKeyDown'], event);
      if (isUnavailable.value || event.repeat || !isPressKeyboardEvent(event) || isPressed.value) {
        return;
      }

      activePointerType.value = 'keyboard';
      emit('pressStart', toPressEvent('pressstart', event, activePointerType.value));
      setPressed(true);
    };

    let onKeyUp = (event: KeyboardEvent) => {
      invokeAttrHandler(attrsRecord, ['onKeyup', 'onKeyUp'], event);
      if (!isPressKeyboardEvent(event) || !isPressed.value) {
        return;
      }

      activePointerType.value = 'keyboard';
      endPress(event, {emitPressUp: true});
    };

    let onClick = (event: MouseEvent) => {
      if (isUnavailable.value) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      emit('click', event);
      emit('press', toPressEvent('press', event, activePointerType.value));
    };

    return function render() {
      let {
        class: _classAttr,
        ...forwardedAttrs
      } = attrsRecord;

      let children = slots.default ? slots.default() : ['Button'];
      if (props.isPending) {
        children = [
          h('span', {class: 'vs-button__label', style: {visibility: 'hidden'}}, children),
          h('span', {
            class: 'vs-button__spinner',
            role: 'progressbar',
            'aria-label': typeof attrsRecord['aria-label'] === 'string' ? `${attrsRecord['aria-label']} pending` : 'Pending'
          })
        ];
      }

      return h('button', {
        ...forwardedAttrs,
        class: [classes.value, externalClass.value],
        type: props.type === 'submit' && props.isPending ? 'button' : props.type,
        disabled: isDisabled.value || undefined,
        tabindex: isDisabled.value ? undefined : attrs.tabindex ?? 0,
        'data-vac': '',
        'data-react-aria-pressable': 'true',
        'data-disabled': isDisabled.value || undefined,
        'data-focused': isFocused.value || undefined,
        'data-focus-visible': isFocusVisible.value || undefined,
        'data-hovered': isHovered.value || undefined,
        'data-pending': props.isPending || undefined,
        'data-pressed': isPressed.value || undefined,
        'data-variant': props.variant,
        'aria-disabled': isUnavailable.value ? 'true' : undefined,
        onBlur,
        onClick,
        onFocus,
        onKeydown: onKeyDown,
        onKeyup: onKeyUp,
        onMouseenter: onMouseEnter,
        onMouseleave: onMouseLeave,
        onPointercancel: onPointerCancel,
        onPointerdown: onPointerDown,
        onPointerenter: onPointerEnter,
        onPointerleave: onPointerLeave,
        onPointerup: onPointerUp
      }, children);
    };
  }
});
