import {type AriaLinkOptions, type LinkAria, type LinkDOMProps, useLink as useLinkInternal} from './useLink';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;

export type {AriaLinkOptions, LinkAria, LinkDOMProps};

export function useLink(props: AriaLinkOptions, ref: RefObject<FocusableElement | null>): LinkAria;
export function useLink(options: AriaLinkOptions = {}, refObject?: RefObject<FocusableElement | null>): LinkAria {
  void refObject;
  return useLinkInternal(options);
}
