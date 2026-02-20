import {useBreadcrumbItem as useBreadcrumbItemInternal, type AriaBreadcrumbItemOptions, type BreadcrumbCurrentValue, type BreadcrumbItemAria} from './useBreadcrumbItem';
import {useBreadcrumbs as useBreadcrumbsInternal, type AriaBreadcrumbsOptions, type BreadcrumbsAria} from './useBreadcrumbs';
import type {AriaBreadcrumbItemProps, AriaBreadcrumbsProps} from '@react-types/breadcrumbs';

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
export function useBreadcrumbItem(options?: AriaBreadcrumbItemOptions): BreadcrumbItemAria {
  return useBreadcrumbItemInternal(options);
}

export function useBreadcrumbs(props: AriaBreadcrumbsProps): BreadcrumbsAria;
export function useBreadcrumbs(options?: AriaBreadcrumbsOptions): BreadcrumbsAria;
export function useBreadcrumbs(options?: AriaBreadcrumbsOptions): BreadcrumbsAria {
  return useBreadcrumbsInternal(options);
}
