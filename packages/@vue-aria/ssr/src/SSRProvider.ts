import {computed, type ComputedRef} from 'vue';

export interface SSRContextValue {
  current: number,
  prefix: string
}

export interface SSRProviderProps {
  prefix?: string
}

export interface SSRProviderAria {
  dispose: () => void,
  isSSR: ComputedRef<boolean>,
  value: SSRContextValue
}

let defaultContext: SSRContextValue = {
  prefix: String(Math.round(Math.random() * 10000000000)),
  current: 0
};

let contextStack: SSRContextValue[] = [defaultContext];

function canUseDOM(): boolean {
  return Boolean(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

function getCurrentContext(): SSRContextValue {
  return contextStack[contextStack.length - 1] ?? defaultContext;
}

function pushSSRContext(value: SSRContextValue): () => void {
  contextStack.push(value);
  return () => {
    let index = contextStack.lastIndexOf(value);
    if (index >= 0) {
      contextStack.splice(index, 1);
    }

    if (contextStack.length === 0) {
      contextStack = [defaultContext];
    }
  };
}

function createProviderContext(props: SSRProviderProps = {}): SSRContextValue {
  let currentContext = getCurrentContext();
  if (props.prefix) {
    return {
      prefix: props.prefix,
      current: 0
    };
  }

  if (currentContext === defaultContext) {
    return {
      prefix: '',
      current: 0
    };
  }

  currentContext.current += 1;
  return {
    prefix: `${currentContext.prefix}-${currentContext.current}`,
    current: 0
  };
}

/**
 * Creates a scoped SSR context for nested id generation.
 * Call `dispose` when the scope is no longer needed.
 */
export function SSRProvider(props: SSRProviderProps = {}): SSRProviderAria {
  let context = createProviderContext(props);
  let dispose = pushSSRContext(context);

  return {
    dispose,
    value: context,
    isSSR: computed(() => resolveIsSSR())
  };
}

/**
 * Returns whether execution is happening in an SSR environment.
 */
export function useIsSSR(): boolean {
  return resolveIsSSR();
}

function resolveIsSSR(): boolean {
  return !canUseDOM();
}

function getPrefix(context: SSRContextValue): string {
  if (context !== defaultContext) {
    return `react-aria${context.prefix}`;
  }

  if (process.env.NODE_ENV === 'test') {
    return 'react-aria';
  }

  return `react-aria${defaultContext.prefix}`;
}

/**
 * Generates a stable id string that can be used safely in SSR/client renders.
 */
export function useSSRSafeId(defaultId?: string): string {
  if (defaultId) {
    return defaultId;
  }

  let context = getCurrentContext();

  if (context === defaultContext && !canUseDOM() && process.env.NODE_ENV !== 'production') {
    console.warn('When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.');
  }

  context.current += 1;
  return `${getPrefix(context)}-${context.current}`;
}
