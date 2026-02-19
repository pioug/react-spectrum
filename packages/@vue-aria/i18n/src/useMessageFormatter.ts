import {type LocalizedStrings, useLocalizedStringFormatter} from './useLocalizedStringFormatter';

export type FormatMessage = (key: string, variables?: {[key: string]: unknown}) => string;

export function useMessageFormatter(strings: LocalizedStrings): FormatMessage {
  let formatter = useLocalizedStringFormatter(strings);
  return (key: string, variables?: {[key: string]: unknown}) => formatter.format(key, variables);
}
