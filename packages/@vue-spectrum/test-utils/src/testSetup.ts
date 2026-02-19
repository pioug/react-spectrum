function setScreenWidth(width: number): void {
  if (typeof window === 'undefined' || typeof window.screen === 'undefined') {
    return;
  }

  let descriptor = Object.getOwnPropertyDescriptor(window.screen, 'width');
  if (descriptor && descriptor.configurable === false) {
    return;
  }

  Object.defineProperty(window.screen, 'width', {
    configurable: true,
    get: () => width
  });
}

/**
 * Mocks screen width to simulate mobile experience.
 * The value is clamped to the maximum width used for mobile tray behavior.
 */
export function simulateMobile(width: number = 700): void {
  setScreenWidth(Math.min(Math.max(width, 0), 700));
}

/**
 * Mocks screen width to simulate desktop experience.
 * The value is clamped to the minimum desktop breakpoint used by Spectrum.
 */
export function simulateDesktop(width: number = 701): void {
  setScreenWidth(Math.max(width, 701));
}
