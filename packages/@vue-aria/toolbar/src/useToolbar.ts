import {computed, type ComputedRef, type Ref, ref, unref} from 'vue';
import {useLocale} from '@vue-aria/i18n';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])'
].join(',');

export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface AriaToolbarOptions {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  orientation?: MaybeRef<ToolbarOrientation | undefined>,
  toolbarRef?: Ref<HTMLElement | null>
}

export interface ToolbarAria {
  isInToolbar: ComputedRef<boolean>,
  toolbarProps: ComputedRef<{
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-orientation': ToolbarOrientation,
    onBlurCapture?: (event: FocusEvent) => void,
    onFocusCapture?: (event: FocusEvent) => void,
    onKeyDownCapture?: (event: KeyboardEvent) => void,
    role: 'group' | 'toolbar'
  }>,
  toolbarRef: Ref<HTMLElement | null>
}

function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function getActiveElement(documentObject: Document | null | undefined): Element | null {
  if (!documentObject) {
    return null;
  }

  return documentObject.activeElement;
}

function getEventTarget(event: Event): EventTarget | null {
  if (typeof event.composedPath === 'function') {
    let composedPath = event.composedPath();
    if (composedPath.length > 0) {
      return composedPath[0] ?? null;
    }
  }

  let typedEvent = event as Event & {srcElement?: EventTarget | null};
  return typedEvent.srcElement ?? null;
}

function nodeContains(target: EventTarget | null | undefined, node: EventTarget | null | undefined): boolean {
  if (!(target instanceof Node) || !(node instanceof Node)) {
    return false;
  }

  if (target === node) {
    return true;
  }

  return Boolean(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
}

function isHiddenElement(element: HTMLElement): boolean {
  if (element.hasAttribute('hidden') || element.closest('[hidden]')) {
    return true;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  return Boolean(element.closest('[aria-hidden="true"]'));
}

function isFocusableElement(element: HTMLElement): boolean {
  if (isHiddenElement(element)) {
    return false;
  }

  if ('disabled' in element && Boolean((element as HTMLInputElement).disabled)) {
    return false;
  }

  if (element.tabIndex < 0) {
    return false;
  }

  if (element instanceof HTMLAnchorElement) {
    return element.hasAttribute('href');
  }

  if (element instanceof HTMLInputElement) {
    return element.type !== 'hidden';
  }

  return true;
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return [];
  }

  let candidates = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return candidates.filter((element) => isFocusableElement(element));
}

function focusElement(element: HTMLElement | undefined): void {
  element?.focus();
}

export function useToolbar(options: AriaToolbarOptions = {}, refArg?: Ref<HTMLElement | null>): ToolbarAria {
  let toolbarRef = refArg ?? options.toolbarRef ?? ref<HTMLElement | null>(null);
  let lastFocused = ref<HTMLElement | null>(null);

  let {direction} = useLocale();
  let orientation = computed(() => unref(options.orientation) ?? 'horizontal');
  let shouldReverse = computed(() => direction === 'rtl' && orientation.value === 'horizontal');
  let ariaLabel = computed(() => resolveOptionalString(options.ariaLabel) ?? resolveOptionalString(options['aria-label']));
  let ariaLabelledby = computed(() => resolveOptionalString(options.ariaLabelledby) ?? resolveOptionalString(options['aria-labelledby']));
  let isInToolbar = computed(() => Boolean(toolbarRef.value?.parentElement?.closest('[role="toolbar"]')));

  let focusFirst = () => {
    focusElement(getFocusableElements(toolbarRef.value)[0]);
  };

  let focusLast = () => {
    let focusableElements = getFocusableElements(toolbarRef.value);
    focusElement(focusableElements[focusableElements.length - 1]);
  };

  let focusNext = () => {
    let focusableElements = getFocusableElements(toolbarRef.value);
    if (!focusableElements.length) {
      return;
    }

    let activeElement = getActiveElement(typeof document === 'undefined' ? null : document);
    let currentIndex = focusableElements.findIndex((element) => element === activeElement);
    if (currentIndex < 0 || currentIndex >= focusableElements.length - 1) {
      return;
    }

    focusElement(focusableElements[currentIndex + 1]);
  };

  let focusPrevious = () => {
    let focusableElements = getFocusableElements(toolbarRef.value);
    if (!focusableElements.length) {
      return;
    }

    let activeElement = getActiveElement(typeof document === 'undefined' ? null : document);
    let currentIndex = focusableElements.findIndex((element) => element === activeElement);
    if (currentIndex <= 0) {
      return;
    }

    focusElement(focusableElements[currentIndex - 1]);
  };

  let onKeyDown = (event: KeyboardEvent) => {
    if (!nodeContains(event.currentTarget, getEventTarget(event))) {
      return;
    }

    if (
      (orientation.value === 'horizontal' && event.key === 'ArrowRight')
      || (orientation.value === 'vertical' && event.key === 'ArrowDown')
    ) {
      if (shouldReverse.value) {
        focusPrevious();
      } else {
        focusNext();
      }
    } else if (
      (orientation.value === 'horizontal' && event.key === 'ArrowLeft')
      || (orientation.value === 'vertical' && event.key === 'ArrowUp')
    ) {
      if (shouldReverse.value) {
        focusNext();
      } else {
        focusPrevious();
      }
    } else if (event.key === 'Tab') {
      event.stopPropagation();
      let activeElement = getActiveElement(typeof document === 'undefined' ? null : document);
      lastFocused.value = activeElement instanceof HTMLElement
        ? activeElement
        : null;

      if (event.shiftKey) {
        focusFirst();
      } else {
        focusLast();
      }

      return;
    } else {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
  };

  let onBlur = (event: FocusEvent) => {
    let target = getEventTarget(event);
    if (!nodeContains(event.currentTarget, event.relatedTarget) && !lastFocused.value && target instanceof HTMLElement) {
      lastFocused.value = target;
    }
  };

  let onFocus = (event: FocusEvent) => {
    let target = getEventTarget(event);
    if (
      !lastFocused.value
      || nodeContains(event.currentTarget, event.relatedTarget)
      || !nodeContains(toolbarRef.value, target)
    ) {
      return;
    }

    if (lastFocused.value.isConnected && nodeContains(toolbarRef.value, lastFocused.value)) {
      lastFocused.value.focus();
    }

    lastFocused.value = null;
  };

  return {
    isInToolbar,
    toolbarProps: computed(() => ({
      role: isInToolbar.value ? 'group' as const : 'toolbar' as const,
      'aria-orientation': orientation.value,
      'aria-label': ariaLabel.value,
      'aria-labelledby': ariaLabel.value == null ? ariaLabelledby.value : undefined,
      onKeyDownCapture: isInToolbar.value ? undefined : onKeyDown,
      onFocusCapture: isInToolbar.value ? undefined : onFocus,
      onBlurCapture: isInToolbar.value ? undefined : onBlur
    })),
    toolbarRef
  };
}
