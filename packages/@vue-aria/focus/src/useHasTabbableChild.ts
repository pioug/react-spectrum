import {computed, type ComputedRef, getCurrentScope, onScopeDispose, type Ref, ref, unref, watch} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type MaybeElementRef = MaybeRef<Element | null | undefined>;

export interface AriaHasTabbableChildOptions {
  isDisabled?: MaybeRef<boolean>
}

const TABBABLE_SELECTOR = [
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

function isDisabledElement(element: Element): boolean {
  return 'disabled' in (element as HTMLInputElement) && Boolean((element as HTMLInputElement).disabled);
}

function isHiddenElement(element: Element): boolean {
  if (element.hasAttribute('hidden') || element.closest('[hidden]')) {
    return true;
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true;
  }

  let hiddenAncestor = element.closest('[aria-hidden="true"]');
  return Boolean(hiddenAncestor);
}

function isTabbable(element: Element): boolean {
  if (isHiddenElement(element) || isDisabledElement(element)) {
    return false;
  }

  let tabIndex = Number((element as HTMLElement).tabIndex);
  if (Number.isNaN(tabIndex) || tabIndex < 0) {
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

function findTabbableChild(container: Element): boolean {
  let tabbableCandidates = container.querySelectorAll(TABBABLE_SELECTOR);
  return Array.from(tabbableCandidates).some((element) => isTabbable(element));
}

export function useHasTabbableChild(
  target: MaybeElementRef,
  options: AriaHasTabbableChildOptions = {}
): Readonly<Ref<boolean>> {
  let hasTabbableChild = ref(false);
  let observer: MutationObserver | null = null;

  let disconnectObserver = () => {
    observer?.disconnect();
    observer = null;
  };

  let stop = watch(
    () => {
      return [unref(target), Boolean(unref(options.isDisabled))] as const;
    },
    ([resolvedTarget, isDisabled]) => {
      disconnectObserver();

      if (isDisabled || !(resolvedTarget instanceof Element)) {
        hasTabbableChild.value = false;
        return;
      }

      let update = () => {
        hasTabbableChild.value = findTabbableChild(resolvedTarget);
      };

      update();

      if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(update);
        observer.observe(resolvedTarget, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['tabindex', 'disabled', 'hidden', 'aria-hidden']
        });
      }
    },
    {immediate: true}
  );

  let cleanup = () => {
    stop();
    disconnectObserver();
  };

  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }

  return computed(() => {
    if (unref(options.isDisabled)) {
      return false;
    }

    return hasTabbableChild.value;
  });
}
