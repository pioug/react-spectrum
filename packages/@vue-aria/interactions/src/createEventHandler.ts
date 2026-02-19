export function createEventHandler<EventType extends Event>(
  first?: ((event: EventType) => void) | null,
  second?: ((event: EventType) => void) | null
): (event: EventType) => void {
  return (event: EventType) => {
    first?.(event);
    if (!event.defaultPrevented) {
      second?.(event);
    }
  };
}
