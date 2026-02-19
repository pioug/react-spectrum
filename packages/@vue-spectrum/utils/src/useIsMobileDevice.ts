import {type Ref} from 'vue';
import {useMediaQuery} from './useMediaQuery';

const DEFAULT_MOBILE_QUERY = '(max-width: 700px)';

export function useIsMobileDevice(query: string = DEFAULT_MOBILE_QUERY): Ref<boolean> {
  return useMediaQuery(query);
}
