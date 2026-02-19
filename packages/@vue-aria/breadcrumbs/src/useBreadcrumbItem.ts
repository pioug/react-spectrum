import {computed, type ComputedRef, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type BreadcrumbCurrentValue = 'date' | 'location' | 'page' | 'step' | 'time' | true;

export interface AriaBreadcrumbItemOptions {
  ariaCurrent?: MaybeRef<BreadcrumbCurrentValue | undefined>,
  autoFocus?: MaybeRef<boolean>,
  elementType?: MaybeRef<string>,
  href?: MaybeRef<string | undefined>,
  isCurrent?: MaybeRef<boolean>,
  isDisabled?: MaybeRef<boolean>,
  onPress?: () => void
}

export interface BreadcrumbItemAria {
  isCurrent: ComputedRef<boolean>,
  isDisabled: ComputedRef<boolean>,
  itemProps: ComputedRef<{
    'aria-current'?: BreadcrumbCurrentValue,
    'aria-disabled'?: boolean,
    href?: string,
    role?: 'link',
    tabindex?: number
  }>,
  press: () => void
}

function isHeadingElement(elementType: string): boolean {
  return /^h[1-6]$/i.test(elementType);
}

export function useBreadcrumbItem(options: AriaBreadcrumbItemOptions = {}): BreadcrumbItemAria {
  let elementType = computed(() => String(unref(options.elementType ?? 'a')));
  let isCurrent = computed(() => Boolean(unref(options.isCurrent)));
  let isDisabled = computed(() => Boolean(unref(options.isDisabled)) || isCurrent.value);

  let itemProps = computed(() => {
    let nextItemProps: {
      'aria-current'?: BreadcrumbCurrentValue,
      'aria-disabled'?: boolean,
      href?: string,
      role?: 'link',
      tabindex?: number
    } = {};

    if (!isHeadingElement(elementType.value)) {
      if (elementType.value === 'a') {
        let href = unref(options.href);
        if (typeof href === 'string' && href.length > 0) {
          nextItemProps.href = href;
        }
      } else {
        nextItemProps.role = 'link';
      }

      if (!isDisabled.value) {
        nextItemProps.tabindex = 0;
      }
    }

    if (isCurrent.value) {
      nextItemProps['aria-current'] = unref(options.ariaCurrent) ?? 'page';
      if (unref(options.autoFocus)) {
        nextItemProps.tabindex = -1;
      } else {
        delete nextItemProps.tabindex;
      }
    }

    if (isDisabled.value) {
      nextItemProps['aria-disabled'] = true;
    }

    return nextItemProps;
  });

  let press = () => {
    if (isDisabled.value) {
      return;
    }

    options.onPress?.();
  };

  return {
    isCurrent,
    isDisabled,
    itemProps,
    press
  };
}
