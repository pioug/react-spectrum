const STOP_PROPAGATION_WARNING = 'stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.';

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
        isDefaultPrevented?: () => boolean,
        isPropagationStopped?: () => boolean,
        stopPropagation?: () => void
      };
      let stopPropagation = event.stopPropagation.bind(event);

      wrappedEvent.continuePropagation = () => {
        shouldStopPropagation = false;
      };
      wrappedEvent.stopPropagation = () => {
        if (shouldStopPropagation && process.env.NODE_ENV !== 'production') {
          console.error(STOP_PROPAGATION_WARNING);
        } else {
          shouldStopPropagation = true;
        }
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
      delete wrappedEvent.isDefaultPrevented;
      delete wrappedEvent.isPropagationStopped;
      delete wrappedEvent.stopPropagation;
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
