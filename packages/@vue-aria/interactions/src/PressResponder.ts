import type {PressHookProps} from './usePress';
import {PressResponderContext, type PressResponderContextValue} from './context';

export function PressResponder(props: PressHookProps = {}): () => void {
  let previousContext = PressResponderContext.current;
  PressResponderContext.current = {
    ...(previousContext ?? {}),
    ...props,
    register: () => {
      previousContext?.register?.();
    }
  } as PressResponderContextValue;

  return () => {
    PressResponderContext.current = previousContext;
  };
}

export function ClearPressResponder(): void {
  PressResponderContext.current = null;
}
