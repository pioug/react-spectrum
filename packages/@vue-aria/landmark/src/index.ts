import {
  type AriaLandmarkProps,
  type AriaLandmarkRole,
  type LandmarkAria,
  type LandmarkController,
  type LandmarkControllerOptions,
  type LandmarkDOMProps,
  UNSTABLE_createLandmarkController,
  useLandmark as useLandmarkInternal
} from './useLandmark';
import {ref} from 'vue';

type RefObject<T> = {
  current: T
};
type FocusableElement = Element;

export {UNSTABLE_createLandmarkController};
export type {
  AriaLandmarkProps,
  AriaLandmarkRole,
  LandmarkAria,
  LandmarkController,
  LandmarkControllerOptions,
  LandmarkDOMProps
};

export function useLandmark(props: AriaLandmarkProps, ref: RefObject<FocusableElement | null>): LandmarkAria;
export function useLandmark(props: AriaLandmarkProps, refObject: RefObject<FocusableElement | null>): LandmarkAria {
  let candidate = arguments[1] as
    | RefObject<FocusableElement | null>
    | {value: FocusableElement | null}
    | FocusableElement
    | null
    | undefined;

  if (candidate && typeof candidate === 'object' && 'value' in candidate) {
    return useLandmarkInternal(props, candidate);
  }

  if (candidate && typeof candidate === 'object' && 'current' in candidate) {
    return useLandmarkInternal(props, ref(candidate.current));
  }

  return useLandmarkInternal(props, (candidate ?? null) as FocusableElement | null);
}
