import type {SimulatedUser, UserOpts} from './types';

export const DEFAULT_LONG_PRESS_TIME = 500;

function testPlatform(re: RegExp): boolean {
  if (typeof window === 'undefined' || window.navigator == null) {
    return false;
  }

  let navigatorObject = window.navigator as Navigator & {
    userAgentData?: {
      platform?: string
    }
  };

  return re.test(navigatorObject.userAgentData?.platform || window.navigator.platform);
}

function isMac(): boolean {
  return testPlatform(/^Mac/i);
}

export function getAltKey(): 'Alt' | 'ControlLeft' {
  return isMac() ? 'Alt' : 'ControlLeft';
}

export function getMetaKey(): 'MetaLeft' | 'ControlLeft' {
  return isMac() ? 'MetaLeft' : 'ControlLeft';
}

function fire(type: string, element: HTMLElement, init: Record<string, unknown> = {}): void {
  let event = new Event(type, {bubbles: true, cancelable: true}) as Event & Record<string, unknown>;
  for (let [key, value] of Object.entries(init)) {
    event[key] = value;
  }
  element.dispatchEvent(event);
}

export async function triggerLongPress(opts: {
  element: HTMLElement,
  advanceTimer: (time: number) => unknown | Promise<unknown>,
  pointerOpts?: Record<string, any>
}): Promise<void> {
  let {element, advanceTimer, pointerOpts = {}} = opts;
  let pointerType = String(pointerOpts.pointerType ?? 'mouse');

  fire('pointerdown', element, {
    pointerType,
    ...pointerOpts
  });

  if (pointerType === 'touch') {
    fire('touchstart', element, pointerOpts);
  } else {
    fire('mousedown', element, pointerOpts);
    element.focus();
  }

  await advanceTimer(DEFAULT_LONG_PRESS_TIME);

  fire('pointerup', element, {
    pointerType,
    ...pointerOpts
  });

  if (pointerType === 'touch') {
    fire('touchend', element, pointerOpts);
  } else {
    fire('mouseup', element, pointerOpts);
  }

  fire('click', element, {
    detail: 1,
    ...pointerOpts
  });
}

export async function pressElement(
  user: SimulatedUser,
  element: HTMLElement,
  interactionType: UserOpts['interactionType']
): Promise<void> {
  if (interactionType === 'keyboard') {
    element.focus();
    await user.keyboard('[Space]');
    return;
  }

  if (interactionType === 'touch') {
    await user.pointer({target: element, keys: '[TouchA]'});
    return;
  }

  await user.pointer({target: element, keys: '[MouseLeft]', coords: {pressure: .5}});
}
