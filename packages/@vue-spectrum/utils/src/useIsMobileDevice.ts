const MOBILE_SCREEN_WIDTH = 700;

export function useIsMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.screen.width <= MOBILE_SCREEN_WIDTH;
}
