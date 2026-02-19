export function chain<Args extends unknown[]>(
  ...callbacks: Array<((...args: Args) => void) | undefined>
): (...args: Args) => void {
  return (...args: Args) => {
    for (let callback of callbacks) {
      callback?.(...args);
    }
  };
}
