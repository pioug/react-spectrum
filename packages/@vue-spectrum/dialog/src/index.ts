import '@adobe/spectrum-css-temp/components/dialog/vars.css';
import {ActionButton, Button} from '@vue-spectrum/button';
import {Modal, Popover, Tray} from '@vue-spectrum/overlays';
import {classNames} from '@vue-spectrum/utils';
import {cloneVNode, computed, type ComputedRef, defineComponent, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, provide, ref, type InjectionKey, type PropType, type VNode, watch} from 'vue';
const styles: {[key: string]: string} = {};


type DialogType = 'modal' | 'popover' | 'tray' | 'fullscreen' | 'fullscreenTakeover';
type DialogSize = 'S' | 'M' | 'L' | 'fullscreen' | 'fullscreenTakeover';
type AlertDialogVariant = 'confirmation' | 'destructive' | 'error' | 'information' | 'warning';
type AutoFocusButton = 'cancel' | 'primary' | 'secondary';

type EventHandler = (() => void) | undefined;

interface DialogContainerContextValue {
  close: () => void,
  type: DialogType
}

let dialogId = 0;

let sizeMap: Record<DialogSize, string> = {
  S: 'small',
  M: 'medium',
  L: 'large',
  fullscreen: 'fullscreen',
  fullscreenTakeover: 'fullscreenTakeover'
};

const ALERT_ICON_PATH = 'M8.564 1.289L.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const CLOSE_ICON_PATH = 'M11.697 10.283L7.414 6l4.283-4.283A1 1 0 1 0 10.283.303L6 4.586 1.717.303A1 1 0 1 0 .303 1.717L4.586 6 .303 10.283a1 1 0 1 0 1.414 1.414L6 7.414l4.283 4.283a1 1 0 1 0 1.414-1.414z';

function renderSpectrumIcon(className: string, path: string, attrs: Record<string, unknown> = {}) {
  return h('svg', {
    class: className,
    focusable: 'false',
    role: 'img',
    ...attrs
  }, [
    h('path', {d: path})
  ]);
}

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
      default: false
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
    let generatedDialogId = `vs-dialog-${++dialogId}`;
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
    let heroClassName = computed(() => classNames(styles, 'spectrum-Dialog-hero'));
    let buttonGroupClassName = computed(() => classNames(styles, 'spectrum-Dialog-buttonGroup', {'spectrum-Dialog-buttonGroup--noFooter': !hasFooter.value}));
    let gridClassName = computed(() => classNames(styles, 'spectrum-Dialog-grid'));
    let typeIconClassName = computed(() => classNames(styles, 'spectrum-Dialog-typeIcon'));
    let closeButtonClassName = computed(() => classNames(styles, 'spectrum-Dialog-closeButton'));
    let titleId = computed(() => hasHeading.value ? `${generatedDialogId}-title` : undefined);
    let ariaLabelledBy = computed(() => {
      let value = attrs['aria-labelledby'];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }

      return titleId.value;
    });

    let dismissDialog = () => {
      invoke(props.onDismiss);
      emit('close');
    };

    provide(dialogContainerContextKey, {
      close: dismissDialog,
      get type() {
        return props.type;
      }
    });

    let closeDialog = () => {
      if (!isDismissable.value) {
        return;
      }

      dismissDialog();
    };

    return () => {
      if (!isOpen.value) {
        return null;
      }

      let headingNode: VNode | null = null;
      if (slots.heading) {
        let headingContent = slots.heading();
        let firstHeadingNode = headingContent.find((node) => isVNode(node));
        if (firstHeadingNode && headingContent.length === 1) {
          headingNode = cloneVNode(firstHeadingNode, {
            id: titleId.value,
            class: [firstHeadingNode.props?.class, headingClassName.value]
          });
        } else {
          headingNode = h('h2', {
            id: titleId.value,
            class: headingClassName.value
          }, headingContent);
        }
      } else if (props.title) {
        headingNode = h('h2', {
          id: titleId.value,
          class: headingClassName.value
        }, props.title);
      }

      let typeIconNode = slots.typeIcon
        ? h('div', {class: typeIconClassName.value}, slots.typeIcon())
        : null;

      let headerNode: VNode | null = null;
      if (slots.header) {
        headerNode = h('header', {class: headerClassName.value}, slots.header());
      }

      let dividerNode: VNode | VNode[] | null = null;
      if (slots.divider) {
        let dividerContent = [...slots.divider()];
        let firstDividerIndex = dividerContent.findIndex((node) => isVNode(node));
        if (firstDividerIndex >= 0) {
          let firstDividerNode = dividerContent[firstDividerIndex] as VNode;
          dividerContent[firstDividerIndex] = cloneVNode(firstDividerNode, {
            ...(typeof firstDividerNode.type === 'string' ? {} : {size: 'M'}),
            class: [firstDividerNode.props?.class, dividerClassName.value]
          });
          dividerNode = dividerContent.length === 1 ? dividerContent[0] : dividerContent;
        } else {
          dividerNode = h('hr', {class: dividerClassName.value});
        }
      }

      let heroNode = slots.hero
        ? h('div', {class: heroClassName.value}, slots.hero())
        : null;

      let footerNode = slots.footer
        ? h('footer', {class: footerClassName.value}, slots.footer())
        : null;

      let buttonGroupNode = slots.buttonGroup
        ? h('div', {class: buttonGroupClassName.value}, slots.buttonGroup())
        : null;

      let closeButton = isDismissable.value
        ? h(ActionButton, {
          class: closeButtonClassName.value,
          isQuiet: true,
          'aria-label': 'Close dialog',
          onClick: closeDialog
        }, {
          default: () => [
            renderSpectrumIcon(
              'spectrum-Icon spectrum-UIIcon-CrossLarge',
              CLOSE_ICON_PATH,
              {'aria-hidden': 'true', viewBox: '0 0 12 12'}
            )
          ]
        })
        : null;

      let hidden = props.isHidden || attrs.hidden === '' || attrs.hidden === true;

      let leadingNodes = [typeIconNode, headingNode, headerNode];

      return h('section', {
        ...attrs,
        class: [dialogClassName.value, attrs.class],
        role: props.role,
        tabindex: -1,
        'aria-labelledby': ariaLabelledBy.value,
        hidden: hidden || undefined,
        'data-vac': ''
      }, [
        h('div', {class: gridClassName.value}, [
          heroNode,
          ...leadingNodes,
          dividerNode,
          h('div', {class: contentClassName.value}, slots.default ? slots.default() : []),
          footerNode,
          buttonGroupNode,
          closeButton
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
        ? () => [renderSpectrumIcon(
          'spectrum-Icon spectrum-UIIcon-AlertMedium vs-alert-dialog__icon',
          ALERT_ICON_PATH,
          {'aria-label': 'Alert'}
        )]
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

function normalizePopoverPlacement(value: string | undefined): 'bottom' | 'left' | 'right' | 'top' {
  let placement = value?.split(' ')[0];
  if (placement === 'top' || placement === 'left' || placement === 'right') {
    return placement;
  }

  return 'bottom';
}

function hasRenderableNodes(nodes: VNode[] | undefined): boolean {
  return Boolean(nodes && nodes.some((node) => node != null));
}

export const DialogTrigger = defineComponent({
  name: 'VueDialogTrigger',
  inheritAttrs: false,
  props: {
    defaultOpen: {
      type: Boolean,
      default: false
    },
    dismissable: {
      type: Boolean,
      default: false
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
    hideArrow: {
      type: Boolean,
      default: false
    },
    mobileType: {
      type: String as PropType<DialogType | undefined>,
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
    placement: {
      type: String,
      default: 'bottom'
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
    close: () => true,
    openChange: (isOpen: boolean) => typeof isOpen === 'boolean'
  },
  setup(props, {attrs, emit, slots}) {
    let triggerRootRef = ref<HTMLElement | null>(null);
    let lastFocusedElement = ref<HTMLElement | null>(null);
    let pendingDismissClose = ref(false);
    let uncontrolledOpen = ref(Boolean(props.defaultOpen));
    let isOpenControlled = computed(() => props.isOpen !== undefined || props.open !== undefined);
    let isOpen = computed(() => {
      if (props.isOpen !== undefined) {
        return props.isOpen;
      }

      if (props.open !== undefined) {
        return props.open;
      }

      return uncontrolledOpen.value;
    });
    let isDismissable = useResolvedDismissableState(computed(() => props.isDismissable), computed(() => props.dismissable));
    let resolvedType = computed(() => props.mobileType ?? props.type);
    let hasUnmountedWarning = ref(false);

    let setOpen = (nextValue: boolean) => {
      if (isOpen.value === nextValue) {
        return;
      }

      if (nextValue && typeof document !== 'undefined') {
        let activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          lastFocusedElement.value = activeElement;
        }
      }

      if (!isOpenControlled.value) {
        uncontrolledOpen.value = nextValue;
      }

      emit('openChange', nextValue);
    };

    let close = () => {
      if (!isOpen.value) {
        return;
      }

      invoke(props.onDismiss);
      pendingDismissClose.value = true;
      setOpen(false);
      if (isOpenControlled.value) {
        emit('close');
      }
    };

    let restoreFocusToTrigger = () => {
      if (typeof document === 'undefined') {
        return;
      }

      let triggerContainer = triggerRootRef.value?.querySelector('.vs-dialog-trigger__trigger');
      let candidate = lastFocusedElement.value;
      if (!candidate || !candidate.isConnected || !triggerContainer?.contains(candidate)) {
        candidate = triggerContainer?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? null;
      }

      if (!candidate || !candidate.isConnected) {
        return;
      }

      candidate.focus();
    };

    watch(isOpen, (nextValue, previousValue) => {
      if (!previousValue && nextValue) {
        pendingDismissClose.value = false;
      }

      if (!previousValue && nextValue && typeof document !== 'undefined') {
        let activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          lastFocusedElement.value = activeElement;
        }
      }

      if (previousValue && !nextValue) {
        if (pendingDismissClose.value) {
          pendingDismissClose.value = false;
          if (!isOpenControlled.value) {
            emit('close');
          }
        } else {
          emit('close');
        }

        nextTick(() => {
          restoreFocusToTrigger();
        });
      }
    });

    onBeforeUnmount(() => {
      if (hasUnmountedWarning.value) {
        return;
      }

      if (isOpen.value && resolvedType.value !== 'popover' && resolvedType.value !== 'tray' && process.env.NODE_ENV !== 'production') {
        console.warn('A DialogTrigger unmounted while open. This is likely due to being placed within a trigger that unmounts or inside a conditional. Consider using a DialogContainer instead.');
        hasUnmountedWarning.value = true;
      }
    });

    let dialogSlots = {
      buttonGroup: slots.buttonGroup ? () => slots.buttonGroup?.() : undefined,
      default: slots.default ? () => slots.default?.() : undefined,
      divider: slots.divider ? () => slots.divider?.() : undefined,
      footer: slots.footer ? () => slots.footer?.() : undefined,
      header: slots.header ? () => slots.header?.() : undefined,
      heading: slots.heading ? () => slots.heading?.() : undefined,
      typeIcon: slots.typeIcon ? () => slots.typeIcon?.() : undefined
    };

    let renderDialog = () => h(Dialog, {
      dismissable: props.dismissable,
      isDismissable: props.isDismissable,
      isHidden: props.isHidden,
      isOpen: true,
      onDismiss: close,
      role: props.role,
      size: props.size,
      title: props.title,
      type: resolvedType.value,
      onClose: close
    }, dialogSlots);

    let renderOverlay = () => {
      if (!isOpen.value) {
        return null;
      }

      if (resolvedType.value === 'popover') {
        return h(Popover, {
          isDismissable: isDismissable.value,
          isOpen: true,
          hideArrow: props.hideArrow,
          placement: normalizePopoverPlacement(props.placement),
          onClose: close
        }, {
          default: () => [renderDialog()]
        });
      }

      if (resolvedType.value === 'tray') {
        return h(Tray, {
          isOpen: true,
          onClose: close
        }, {
          default: () => [renderDialog()]
        });
      }

      return h(Modal, {
        isDismissable: resolvedType.value === 'modal' ? isDismissable.value : false,
        isOpen: true,
        type: resolvedType.value === 'modal' || resolvedType.value === 'fullscreen' || resolvedType.value === 'fullscreenTakeover'
          ? resolvedType.value
          : 'modal',
        onClose: close
      }, {
        default: () => [renderDialog()]
      });
    };

    return () => {
      let triggerContent = slots.trigger?.({
        close,
        isOpen: isOpen.value,
        open: () => setOpen(true),
        toggle: () => setOpen(!isOpen.value)
      });
      let overlayContent = renderOverlay();

      if (!hasRenderableNodes(triggerContent)) {
        return overlayContent;
      }

      return h('div', {
        ...attrs,
        ref: triggerRootRef,
        class: ['vs-dialog-trigger', attrs.class],
        'data-vac': ''
      }, [
        h('div', {
          class: 'vs-dialog-trigger__trigger'
        }, triggerContent),
        overlayContent
      ]);
    };
  }
});

export const DialogContainer = defineComponent({
  name: 'VueDialogContainer',
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
    type: {
      type: String as PropType<DialogType>,
      default: 'modal'
    }
  },
  emits: {
    close: () => true,
    openChange: (isOpen: boolean) => typeof isOpen === 'boolean'
  },
  setup(props, {attrs, emit, slots}) {
    let lastContent = ref<VNode[] | undefined>(undefined);
    let isDismissable = useResolvedDismissableState(computed(() => props.isDismissable), computed(() => props.dismissable));
    let currentChildren = computed(() => slots.default?.());
    let isOpen = computed(() => {
      if (props.isOpen !== undefined) {
        return props.isOpen;
      }

      if (props.open !== undefined) {
        return props.open;
      }

      return hasRenderableNodes(currentChildren.value);
    });

    let dismiss = () => {
      invoke(props.onDismiss);
      emit('close');
      emit('openChange', false);
    };

    provide(dialogContainerContextKey, {
      close: dismiss,
      get type() {
        return props.type;
      }
    });

    watch(currentChildren, (nextChildren) => {
      if (!hasRenderableNodes(nextChildren)) {
        return;
      }

      lastContent.value = nextChildren;
    }, {immediate: true});

    let modalType = computed<'fullscreen' | 'fullscreenTakeover' | 'modal'>(() => {
      if (props.type === 'fullscreen' || props.type === 'fullscreenTakeover') {
        return props.type;
      }

      return 'modal';
    });

    return () => {
      let dialogAttrs: Record<string, unknown> = {...attrs};
      delete dialogAttrs.class;
      delete dialogAttrs.style;

      let dialogSlots = {
        buttonGroup: slots.buttonGroup ? () => slots.buttonGroup?.() : undefined,
        default: () => lastContent.value ?? currentChildren.value ?? [],
        divider: slots.divider ? () => slots.divider?.() : undefined,
        footer: slots.footer ? () => slots.footer?.() : undefined,
        header: slots.header ? () => slots.header?.() : undefined,
        heading: slots.heading ? () => slots.heading?.() : undefined,
        typeIcon: slots.typeIcon ? () => slots.typeIcon?.() : undefined
      };

      return h(Modal, {
        isDismissable: modalType.value === 'modal' ? isDismissable.value : false,
        isOpen: isOpen.value,
        type: modalType.value,
        onClose: dismiss
      }, {
        default: () => [
          h(Dialog, {
            ...dialogAttrs,
            dismissable: props.dismissable,
            isDismissable: props.isDismissable,
            isOpen: true,
            onDismiss: dismiss,
            type: props.type,
            onClose: dismiss
          }, dialogSlots)
        ]
      });
    };
  }
});

export const VueDialog = Dialog;

export interface DialogContainerValue {
  close: () => void,
  dismiss: () => void,
  type: DialogType
}

export function useDialogContainer(): DialogContainerValue {
  if (!getCurrentInstance()) {
    throw new Error('Cannot call useDialogContext outside a <DialogTrigger> or <DialogContainer>.');
  }

  let context = inject(dialogContainerContextKey, null);
  if (!context) {
    throw new Error('Cannot call useDialogContext outside a <DialogTrigger> or <DialogContainer>.');
  }

  return {
    close: context.close,
    dismiss: context.close,
    type: context.type
  };
}

export type SpectrumDialogProps = InstanceType<typeof Dialog>['$props'];
export type SpectrumAlertDialogProps = InstanceType<typeof AlertDialog>['$props'];
export type SpectrumDialogTriggerProps = InstanceType<typeof DialogTrigger>['$props'];
export type SpectrumDialogContainerProps = InstanceType<typeof DialogContainer>['$props'];
