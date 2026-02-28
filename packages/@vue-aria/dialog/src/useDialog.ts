import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export interface AriaDialogOptions {
  ariaDescribedby?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  defaultOpen?: MaybeRef<boolean>,
  isDismissable?: MaybeRef<boolean>,
  onOpenChange?: (isOpen: boolean) => void,
  role?: MaybeRef<'alertdialog' | 'dialog'>
}

export interface DialogAria {
  backdropProps: ComputedRef<{
    'aria-hidden': true,
    role: 'presentation'
  }>,
  close: () => void,
  dialogProps: ComputedRef<{
    'aria-describedby'?: string,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-modal': true,
    hidden: boolean,
    id: string,
    role: 'alertdialog' | 'dialog',
    tabindex: number
  }>,
  isDismissable: ComputedRef<boolean>,
  isOpen: Ref<boolean>,
  open: () => void,
  titleProps: ComputedRef<{
    id: string
  }>,
  toggle: () => void,
  triggerProps: ComputedRef<{
    'aria-controls': string | undefined,
    'aria-expanded': boolean,
    'aria-haspopup': 'dialog'
    onClick: () => void
  }>
}

let dialogCounter = 0;

export function useDialog(options: AriaDialogOptions = {}): DialogAria {
  dialogCounter += 1;

  let idBase = `vue-dialog-${dialogCounter}`;
  let dialogId = `${idBase}-content`;
  let titleId = `${idBase}-title`;

  let isOpen = ref(Boolean(unref(options.defaultOpen)));
  let role = computed(() => unref(options.role) ?? 'dialog');
  let isDismissable = computed(() => Boolean(unref(options.isDismissable ?? true)));

  let labelledBy = computed(() => {
    let ariaLabelledby = unref(options.ariaLabelledby);
    if (ariaLabelledby != null && ariaLabelledby.length > 0) {
      return ariaLabelledby;
    }

    if (unref(options.ariaLabel)) {
      return undefined;
    }

    return titleId;
  });

  let setOpen = (nextOpen: boolean) => {
    if (isOpen.value === nextOpen) {
      return;
    }

    isOpen.value = nextOpen;
    options.onOpenChange?.(nextOpen);
  };

  let open = () => {
    setOpen(true);
  };

  let close = () => {
    if (!isDismissable.value) {
      return;
    }

    setOpen(false);
  };

  let toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  let dialogProps = computed(() => ({
    id: dialogId,
    role: role.value,
    tabindex: -1,
    hidden: !isOpen.value,
    'aria-modal': true as const,
    'aria-label': unref(options.ariaLabel),
    'aria-labelledby': labelledBy.value,
    'aria-describedby': unref(options.ariaDescribedby)
  }));

  let titleProps = computed(() => ({
    id: titleId
  }));

  let triggerProps = computed(() => ({
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': isOpen.value,
    'aria-controls': isOpen.value ? dialogId : undefined,
    onClick: toggle
  }));

  let backdropProps = computed(() => ({
    role: 'presentation' as const,
    'aria-hidden': true as const
  }));

  return {
    backdropProps,
    close,
    dialogProps,
    isDismissable,
    isOpen,
    open,
    titleProps,
    toggle,
    triggerProps
  };
}
