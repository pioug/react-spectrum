import type {PressHookProps} from './usePress';

export interface PressResponderContextValue extends PressHookProps {
  register?: () => void
}

export const PressResponderContext = {
  current: null as PressResponderContextValue | null
};
