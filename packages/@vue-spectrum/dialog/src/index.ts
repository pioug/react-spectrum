import '@adobe/spectrum-css-temp/components/dialog/vars.css';
import {Button} from '@vue-spectrum/button';
import {classNames} from '@vue-spectrum/utils';
import {computed, type ComputedRef, defineComponent, getCurrentInstance, h, inject, type InjectionKey, type PropType} from 'vue';
const styles: {[key: string]: string} = {};


type DialogType = 'modal' | 'popover' | 'tray' | 'fullscreen' | 'fullscreenTakeover';
type DialogSize = 'S' | 'M' | 'L' | 'fullscreen' | 'fullscreenTakeover';
type AlertDialogVariant = 'confirmation' | 'destructive' | 'error' | 'warning';
type AutoFocusButton = 'cancel' | 'primary' | 'secondary';

type EventHandler = (() => void) | undefined;

interface DialogContainerContextValue {
  close: () => void,
  type: DialogType
}

let sizeMap: Record<DialogSize, string> = {
  S: 'small',
  M: 'medium',
  L: 'large',
  fullscreen: 'fullscreen',
  fullscreenTakeover: 'fullscreenTakeover'
};

let dialogContainerContextKey: InjectionKey<DialogContainerContextValue> = Symbol('VueSpectrumDialogContainerContext');

function invoke(handler: EventHandler) {
  handler?.();
}

function useResolvedOpenState(
  isOpen: ComputedRef<boolean | undefined>,
  open: ComputedRef<boolean | undefined>
) {
  return computed(() => {
    if (isOpen.value !== undefined) {
      return isOpen.value;
    }

    if (open.value !== undefined) {
      return open.value;
    }

    return true;
  });
}

function useResolvedDismissableState(
  isDismissable: ComputedRef<boolean | undefined>,
  dismissable: ComputedRef<boolean>
) {
  return computed(() => {
    if (isDismissable.value !== undefined) {
      return isDismissable.value;
    }

    return dismissable.value;
  });
}

export const Dialog = defineComponent({
  name: 'VueDialog',
  inheritAttrs: false,
  props: {
    dismissable: {
      type: Boolean,
      default: true
    },
    isDismissable: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    onDismiss: {
      type: Function as PropType<EventHandler>,
      default: undefined
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    role: {
      type: String,
      default: 'dialog'
    },
    size: {
      type: String as PropType<DialogSize | undefined>,
      default: undefined
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String as PropType<DialogType>,
      default: 'modal'
    }
  },
  emits: {
    close: () => true
  },
  setup(props, {attrs, emit, slots}) {
    let isOpen = useResolvedOpenState(computed(() => props.isOpen), computed(() => props.open));
    let isDismissable = useResolvedDismissableState(computed(() => props.isDismissable), computed(() => props.dismissable));

    let resolvedSize = computed<DialogSize>(() => {
      if (props.type === 'popover') {
        return props.size ?? 'S';
      }

      return props.size ?? 'L';
    });

    let sizeVariant = computed(() => {
      if (props.type === 'fullscreen' || props.type === 'fullscreenTakeover') {
        return sizeMap[props.type];
      }

      return sizeMap[resolvedSize.value];
    });

    let hasHeader = computed(() => Boolean(slots.header));
    let hasHeading = computed(() => Boolean(slots.heading || props.title));
    let hasFooter = computed(() => Boolean(slots.footer));
    let hasTypeIcon = computed(() => Boolean(slots.typeIcon));

    let dialogClassName = computed(() => classNames(
      styles,
      'spectrum-Dialog',
      {
        [`spectrum-Dialog--${sizeVariant.value}`]: Boolean(sizeVariant.value),
        'spectrum-Dialog--dismissable': isDismissable.value
      }
    ));

    let headingClassName = computed(() => classNames(
      styles,
      'spectrum-Dialog-heading',
      {
        'spectrum-Dialog-heading--noHeader': !hasHeader.value,
        'spectrum-Dialog-heading--noTypeIcon': !hasTypeIcon.value
      }
    ));

    let headerClassName = computed(() => classNames(
      styles,
      'spectrum-Dialog-header',
      {
        'spectrum-Dialog-header--noHeading': !hasHeading.value,
        'spectrum-Dialog-header--noTypeIcon': !hasTypeIcon.value
      }
    ));

    let contentClassName = computed(() => classNames(styles, 'spectrum-Dialog-content'));
    let dividerClassName = computed(() => classNames(styles, 'spectrum-Dialog-divider'));
    let footerClassName = computed(() => classNames(styles, 'spectrum-Dialog-footer'));
    let buttonGroupClassName = computed(() => classNames(styles, 'spectrum-Dialog-buttonGroup', {'spectrum-Dialog-buttonGroup--noFooter': !hasFooter.value}));
    let gridClassName = computed(() => classNames(styles, 'spectrum-Dialog-grid'));
    let typeIconClassName = computed(() => classNames(styles, 'spectrum-Dialog-typeIcon'));
    let closeButtonClassName = computed(() => classNames(styles, 'spectrum-Dialog-closeButton'));

    let closeDialog = () => {
      if (!isDismissable.value) {
        return;
      }

      invoke(props.onDismiss);
      emit('close');
    };

    return () => {
      if (!isOpen.value) {
        return null;
      }

      let headingNode = null;
      if (slots.heading) {
        headingNode = h('div', {class: [headingClassName.value, 'vs-dialog__title']}, slots.heading());
      } else if (props.title) {
        headingNode = h('h2', {class: [headingClassName.value, 'vs-dialog__title']}, props.title);
      }

      let typeIconNode = slots.typeIcon
        ? h('div', {class: [typeIconClassName.value, 'vs-dialog__type-icon']}, slots.typeIcon())
        : null;

      let headerContent = slots.header
        ? slots.header()
        : [
          typeIconNode,
          headingNode
        ];

      let headerNode = (slots.header || headingNode || typeIconNode)
        ? h('header', {class: [headerClassName.value, 'vs-dialog__header']}, headerContent)
        : null;

      let dividerNode = slots.divider
        ? h('div', {class: [dividerClassName.value, 'vs-dialog__divider']}, slots.divider())
        : null;

      let footerNode = slots.footer
        ? h('footer', {class: [footerClassName.value, 'vs-dialog__footer']}, slots.footer())
        : null;

      let buttonGroupNode = slots.buttonGroup
        ? h('div', {class: [buttonGroupClassName.value, 'vs-dialog__button-group']}, slots.buttonGroup())
        : null;

      let closeButton = isDismissable.value
        ? h('button', {
          type: 'button',
          class: [closeButtonClassName.value, 'vs-dialog__close'],
          'aria-label': 'Close dialog',
          onClick: closeDialog
        }, '\u00d7')
        : null;

      let hidden = props.isHidden || attrs.hidden === '' || attrs.hidden === true;

      return h('div', {
        class: 'vs-dialog-layer',
        'data-vac': ''
      }, [
        isDismissable.value
          ? h('button', {
            class: 'vs-dialog-layer__backdrop',
            type: 'button',
            'aria-label': 'Dismiss dialog',
            onClick: closeDialog
          })
          : null,
        h('section', {
          ...attrs,
          class: [dialogClassName.value, 'vs-dialog', attrs.class],
          role: props.role,
          'aria-modal': props.role === 'dialog' || props.role === 'alertdialog' ? 'true' : undefined,
          hidden: hidden || undefined,
          'data-vac': ''
        }, [
          h('div', {class: [gridClassName.value, 'vs-dialog__grid']}, [
            headerNode,
            dividerNode,
            h('div', {class: [contentClassName.value, 'vs-dialog__body']}, slots.default ? slots.default() : []),
            footerNode,
            buttonGroupNode,
            closeButton
          ])
        ])
      ]);
    };
  }
});

export const AlertDialog = defineComponent({
  name: 'VueAlertDialog',
  inheritAttrs: false,
  props: {
    autoFocusButton: {
      type: String as PropType<AutoFocusButton | undefined>,
      default: undefined
    },
    cancelLabel: {
      type: String,
      default: ''
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    isDismissable: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    isPrimaryActionDisabled: {
      type: Boolean,
      default: false
    },
    isSecondaryActionDisabled: {
      type: Boolean,
      default: false
    },
    onCancel: {
      type: Function as PropType<EventHandler>,
      default: undefined
    },
    onClose: {
      type: Function as PropType<EventHandler>,
      default: undefined
    },
    onPrimaryAction: {
      type: Function as PropType<EventHandler>,
      default: undefined
    },
    onSecondaryAction: {
      type: Function as PropType<EventHandler>,
      default: undefined
    },
    open: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    primaryActionLabel: {
      type: String,
      default: 'OK'
    },
    secondaryActionLabel: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    variant: {
      type: String as PropType<AlertDialogVariant | undefined>,
      default: undefined
    }
  },
  emits: {
    cancel: () => true,
    close: () => true,
    primaryAction: () => true,
    secondaryAction: () => true
  },
  setup(props, {attrs, emit, slots}) {
    let variantClassName = computed(() => classNames(styles, {
      [`spectrum-Dialog--${props.variant}`]: Boolean(props.variant)
    }));

    let confirmVariant = computed(() => {
      if (props.variant === 'confirmation') {
        return 'cta' as const;
      }

      if (props.variant === 'destructive') {
        return 'negative' as const;
      }

      return 'primary' as const;
    });

    let closeAndEmit = (event: 'cancel' | 'primaryAction' | 'secondaryAction', callback: EventHandler) => {
      invoke(props.onClose);
      invoke(callback);
      if (event === 'cancel') {
        emit('cancel');
      } else if (event === 'primaryAction') {
        emit('primaryAction');
      } else {
        emit('secondaryAction');
      }
      emit('close');
    };

    return () => h(Dialog, {
      ...attrs,
      class: [variantClassName.value, attrs.class],
      dismissable: props.dismissable,
      isDismissable: props.isDismissable,
      isHidden: props.isHidden,
      isOpen: props.isOpen,
      onDismiss: () => {
        invoke(props.onClose);
        emit('close');
      },
      open: props.open,
      role: 'alertdialog',
      size: 'M',
      title: props.title
    }, {
      divider: () => [h('hr', {class: 'vs-alert-dialog__divider'})],
      typeIcon: (props.variant === 'error' || props.variant === 'warning')
        ? () => [h('span', {
          class: 'vs-alert-dialog__icon',
          'aria-label': 'Alert'
        }, '!')]
        : undefined,
      default: () => slots.default ? slots.default() : [],
      buttonGroup: () => [
        props.cancelLabel
          ? h(Button, {
            autoFocus: props.autoFocusButton === 'cancel',
            'data-testid': 'rsp-AlertDialog-cancelButton',
            onClick: () => closeAndEmit('cancel', props.onCancel),
            variant: 'secondary'
          }, {
            default: () => props.cancelLabel
          })
          : null,
        props.secondaryActionLabel
          ? h(Button, {
            autoFocus: props.autoFocusButton === 'secondary',
            'data-testid': 'rsp-AlertDialog-secondaryButton',
            isDisabled: props.isSecondaryActionDisabled,
            onClick: () => closeAndEmit('secondaryAction', props.onSecondaryAction),
            variant: 'secondary'
          }, {
            default: () => props.secondaryActionLabel
          })
          : null,
        h(Button, {
          autoFocus: props.autoFocusButton === 'primary',
          'data-testid': 'rsp-AlertDialog-confirmButton',
          isDisabled: props.isPrimaryActionDisabled,
          onClick: () => closeAndEmit('primaryAction', props.onPrimaryAction),
          variant: confirmVariant.value
        }, {
          default: () => props.primaryActionLabel
        })
      ]
    });
  }
});

export const DialogTrigger = Dialog;
export const DialogContainer = Dialog;
export const VueDialog = Dialog;

export interface DialogContainerValue {
  close: () => void,
  dismiss: () => void,
  type: DialogType
}

export function useDialogContainer(): DialogContainerValue {
  let fallbackContext: DialogContainerContextValue = {
    close: () => {},
    type: 'modal'
  };

  if (!getCurrentInstance()) {
    return {
      close: fallbackContext.close,
      dismiss: fallbackContext.close,
      type: fallbackContext.type
    };
  }

  let context = inject(dialogContainerContextKey, {
    close: fallbackContext.close,
    type: fallbackContext.type
  });

  return {
    close: context.close,
    dismiss: context.close,
    type: context.type
  };
}

export type SpectrumDialogProps = Record<string, unknown>;
export type SpectrumAlertDialogProps = SpectrumDialogProps;
export type SpectrumDialogTriggerProps = SpectrumDialogProps;
export type SpectrumDialogContainerProps = SpectrumDialogProps;
