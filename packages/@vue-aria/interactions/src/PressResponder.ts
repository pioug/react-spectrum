import type {PressHookProps} from './usePress';
import {PressResponderContext, type PressResponderContextValue} from './context';

const PRESS_RESPONDER_WARNING = 'A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.';

export function PressResponder(props: PressHookProps = {}): () => void {
  let previousContext = PressResponderContext.current;
  let isDisposed = false;
  let isRegistered = false;

  let scheduleCheck = typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (callback: () => void) => Promise.resolve().then(callback);

  scheduleCheck(() => {
    if (isDisposed || isRegistered || process.env.NODE_ENV === 'production') {
      return;
    }

    console.warn(PRESS_RESPONDER_WARNING);
    isRegistered = true;
  });

  PressResponderContext.current = {
    ...(previousContext ?? {}),
    ...props,
    register: () => {
      isRegistered = true;
      previousContext?.register?.();
    }
  } as PressResponderContextValue;

  return () => {
    isDisposed = true;
    PressResponderContext.current = previousContext;
  };
}

export function ClearPressResponder(): void {
  PressResponderContext.current = null;
}
