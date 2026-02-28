import {computed, type ComputedRef, getCurrentScope, onScopeDispose, type Ref, ref, unref, watch} from 'vue';
import {isTabbable as isTabbableUtils} from '@vue-aria/utils';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type MaybeElementRef = MaybeRef<Element | null | undefined>;

export interface AriaHasTabbableChildOptions {
  isDisabled?: MaybeRef<boolean>
}

function findTabbableChild(container: Element): boolean {
  let ownerDocument = container.ownerDocument;
  if (!ownerDocument || typeof ownerDocument.createTreeWalker !== 'function') {
    return false;
  }

  let showElement = typeof NodeFilter === 'undefined' ? 1 : NodeFilter.SHOW_ELEMENT;
  let filterAccept = typeof NodeFilter === 'undefined' ? 1 : NodeFilter.FILTER_ACCEPT;
  let filterSkip = typeof NodeFilter === 'undefined' ? 3 : NodeFilter.FILTER_SKIP;
  let walker = ownerDocument.createTreeWalker(container, showElement, {
    acceptNode(node) {
      if (!(node instanceof Element)) {
        return filterSkip;
      }

      return isTabbableUtils(node) ? filterAccept : filterSkip;
    }
  });
  return Boolean(walker.nextNode());
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
