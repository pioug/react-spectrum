import {computed, type ComputedRef, ref, type Ref, unref} from 'vue';

type MaybeRef<T> = T | Ref<T> | ComputedRef<T>;

export type AriaLandmarkRole =
  | 'banner'
  | 'complementary'
  | 'contentinfo'
  | 'form'
  | 'main'
  | 'navigation'
  | 'region'
  | 'search';

export interface AriaLandmarkProps {
  'aria-label'?: MaybeRef<string | undefined>,
  'aria-labelledby'?: MaybeRef<string | undefined>,
  ariaLabel?: MaybeRef<string | undefined>,
  ariaLabelledby?: MaybeRef<string | undefined>,
  focus?: (direction: 'backward' | 'forward') => void,
  role: MaybeRef<AriaLandmarkRole>
}

export interface LandmarkDOMProps {
  'aria-label'?: string,
  'aria-labelledby'?: string,
  role: AriaLandmarkRole,
  tabindex?: -1
}

export interface LandmarkAria {
  landmarkProps: ComputedRef<LandmarkDOMProps>
}

export interface LandmarkControllerOptions {
  from?: Element
}

export interface LandmarkController {
  dispose(): void,
  focusMain(): boolean,
  focusNext(opts?: LandmarkControllerOptions): boolean,
  focusPrevious(opts?: LandmarkControllerOptions): boolean,
  navigate(direction: 'backward' | 'forward', opts?: LandmarkControllerOptions): boolean
}

interface Landmark {
  blur: () => void,
  focus: (direction: 'backward' | 'forward') => void,
  label?: string,
  lastFocused?: Element,
  ref: MaybeRef<Element | null>,
  role: AriaLandmarkRole
}

function getActiveElement(documentObject: Document): Element | null {
  return documentObject.activeElement;
}

function nodeContains(target: EventTarget | null, node: EventTarget | null): boolean {
  if (!(target instanceof Node) || !(node instanceof Node)) {
    return false;
  }

  if (target === node) {
    return true;
  }

  return Boolean(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
}

class LandmarkManager {
  landmarks: Landmark[] = [];

  addLandmark(landmark: Landmark): () => void {
    let existingIndex = this.landmarks.findIndex((candidate) => candidate.ref === landmark.ref);
    if (existingIndex >= 0) {
      this.landmarks[existingIndex] = landmark;
    } else {
      this.landmarks.push(landmark);
    }

    return () => {
      this.landmarks = this.landmarks.filter((candidate) => candidate.ref !== landmark.ref);
    };
  }

  createController(): LandmarkController {
    return {
      dispose() {
        // no-op placeholder for compatibility with the React API
      },
      focusMain: () => {
        let mainLandmark = this.landmarks.find((landmark) => landmark.role === 'main');
        return this.focusLandmark(mainLandmark, 'forward');
      },
      focusNext: (opts) => {
        return this.navigate('forward', opts);
      },
      focusPrevious: (opts) => {
        return this.navigate('backward', opts);
      },
      navigate: (direction, opts) => {
        return this.navigate(direction, opts);
      }
    };
  }

  private focusLandmark(landmark: Landmark | undefined, direction: 'backward' | 'forward'): boolean {
    if (!landmark) {
      return false;
    }

    let element = unref(landmark.ref);
    if (!(element instanceof Element) || !element.isConnected) {
      return false;
    }

    landmark.focus(direction);

    for (let candidate of this.landmarks) {
      if (candidate !== landmark) {
        candidate.blur();
      }
    }

    if (
      landmark.lastFocused &&
      landmark.lastFocused.isConnected &&
      (landmark.lastFocused instanceof HTMLElement || landmark.lastFocused instanceof SVGElement)
    ) {
      landmark.lastFocused.focus();
    } else if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.focus();
    }

    return true;
  }

  private resolveFromElement(opts?: LandmarkControllerOptions): Element | null {
    if (opts?.from) {
      return opts.from;
    }

    if (typeof document === 'undefined') {
      return null;
    }

    return getActiveElement(document);
  }

  private findLandmarkFromElement(from: Element | null): Landmark | undefined {
    if (!from) {
      return undefined;
    }

    return this.landmarks.find((landmark) => {
      let element = unref(landmark.ref);
      return element instanceof Element && nodeContains(element, from);
    });
  }

  private navigate(direction: 'backward' | 'forward', opts?: LandmarkControllerOptions): boolean {
    if (this.landmarks.length === 0) {
      return false;
    }

    let from = this.resolveFromElement(opts);
    let currentLandmark = this.findLandmarkFromElement(from);
    let currentIndex = currentLandmark ? this.landmarks.indexOf(currentLandmark) : -1;

    let nextIndex = 0;
    if (direction === 'backward') {
      nextIndex = currentIndex >= 0 ? currentIndex - 1 : this.landmarks.length - 1;
      if (nextIndex < 0) {
        nextIndex = this.landmarks.length - 1;
      }
    } else {
      nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
      if (nextIndex >= this.landmarks.length) {
        nextIndex = 0;
      }
    }

    return this.focusLandmark(this.landmarks[nextIndex], direction);
  }
}

let landmarkManager = new LandmarkManager();

export function UNSTABLE_createLandmarkController(): LandmarkController {
  return landmarkManager.createController();
}

function resolveOptionalValue(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

function resolveLabel(props: AriaLandmarkProps): {ariaLabel?: string, ariaLabelledby?: string, label?: string} {
  let ariaLabel = resolveOptionalValue(props.ariaLabel) ?? resolveOptionalValue(props['aria-label']);
  let ariaLabelledby = resolveOptionalValue(props.ariaLabelledby) ?? resolveOptionalValue(props['aria-labelledby']);

  return {
    ariaLabel,
    ariaLabelledby,
    label: ariaLabel ?? ariaLabelledby
  };
}

export function useLandmark(props: AriaLandmarkProps, refObject: MaybeRef<Element | null>): LandmarkAria {
  let isLandmarkFocused = ref(false);
  let role = computed(() => unref(props.role));
  let labels = computed(() => resolveLabel(props));

  landmarkManager.addLandmark({
    ref: refObject,
    role: role.value,
    label: labels.value.label,
    focus: (direction) => {
      props.focus?.(direction);
      isLandmarkFocused.value = true;
    },
    blur: () => {
      isLandmarkFocused.value = false;
    }
  });

  return {
    landmarkProps: computed(() => ({
      role: role.value,
      tabindex: isLandmarkFocused.value ? -1 : undefined,
      'aria-label': labels.value.ariaLabel,
      'aria-labelledby': labels.value.ariaLabelledby
    }))
  };
}
