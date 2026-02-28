import {type AriaBreadcrumbItemOptions, type BreadcrumbCurrentValue, type BreadcrumbItemAria, useBreadcrumbItem as useBreadcrumbItemInternal} from './useBreadcrumbItem';
import type {AriaBreadcrumbItemProps, AriaBreadcrumbsProps} from '@vue-types/breadcrumbs';
import {type AriaBreadcrumbsOptions, type BreadcrumbsAria, useBreadcrumbs as useBreadcrumbsInternal} from './useBreadcrumbs';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;

export type {AriaBreadcrumbItemOptions, BreadcrumbCurrentValue, BreadcrumbItemAria, AriaBreadcrumbsOptions, BreadcrumbsAria, AriaBreadcrumbItemProps, AriaBreadcrumbsProps};

export function useBreadcrumbItem(
  props: AriaBreadcrumbItemProps,
  ref: RefObject<FocusableElement | null>
): BreadcrumbItemAria;
export function useBreadcrumbItem(options?: AriaBreadcrumbItemOptions): BreadcrumbItemAria;
export function useBreadcrumbItem(
  options?: AriaBreadcrumbItemOptions,
  refObject?: RefObject<FocusableElement | null>
): BreadcrumbItemAria {
  void refObject;
  return useBreadcrumbItemInternal(options);
}

export function useBreadcrumbs(props: AriaBreadcrumbsProps): BreadcrumbsAria;
export function useBreadcrumbs(options?: AriaBreadcrumbsOptions): BreadcrumbsAria;
export function useBreadcrumbs(options?: AriaBreadcrumbsOptions): BreadcrumbsAria {
  return useBreadcrumbsInternal(options);
}
