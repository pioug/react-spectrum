export function createEventHandler<EventType extends Event>(
  first?: ((event: EventType) => void) | null,
  second?: ((event: EventType) => void) | null
): ((event: EventType) => void) | undefined {
  let wrapHandler = (handler?: ((event: EventType) => void) | null) => {
    if (!handler) {
      return undefined;
    }

    return (event: EventType) => {
      let shouldStopPropagation = true;
      let wrappedEvent = event as EventType & {
        continuePropagation?: () => void,
        isPropagationStopped?: () => boolean,
        isDefaultPrevented?: () => boolean
      };
      let stopPropagation = event.stopPropagation.bind(event);

      wrappedEvent.continuePropagation = () => {
        shouldStopPropagation = false;
      };
      wrappedEvent.isPropagationStopped = () => {
        return shouldStopPropagation;
      };
      wrappedEvent.isDefaultPrevented = () => {
        return event.defaultPrevented;
      };

      handler(wrappedEvent as EventType);

      if (shouldStopPropagation) {
        stopPropagation();
      }

      delete wrappedEvent.continuePropagation;
      delete wrappedEvent.isPropagationStopped;
      delete wrappedEvent.isDefaultPrevented;
    };
  };

  let wrappedFirst = wrapHandler(first);
  let wrappedSecond = wrapHandler(second);
  if (!wrappedFirst && !wrappedSecond) {
    return undefined;
  }

  return (event: EventType) => {
    wrappedFirst?.(event);
    wrappedSecond?.(event);
  };
}
