'use client';

import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {createApp, h, ref as vueRef, type App as VueApp, type Component as VueComponent, type Ref as VueRef} from 'vue';
import {VueButton} from '../../../vue-aria-components/src/components/VueButton';
import {VueLink} from '../../../vue-aria-components/src/components/VueLink';
import {VueSpectrumProvider} from '../../../vue-aria-components/src/components/VueSpectrumProvider';

interface VueComponentHostProps {
  component: VueComponent,
  componentProps?: Record<string, unknown>,
  children?: ReactNode
}

function getSlotText(children: ReactNode): string | null {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    let text = children
      .filter(child => typeof child === 'string' || typeof child === 'number')
      .map(String)
      .join('');
    return text || null;
  }

  return null;
}

function normalizeProps(componentProps: Record<string, unknown> | undefined) {
  if (!componentProps) {
    return {};
  }

  let {
    className,
    ...rest
  } = componentProps;

  return {
    ...rest,
    class: className
  };
}

export function VueComponentHost({component, componentProps, children}: VueComponentHostProps) {
  let mountRef = useRef<HTMLDivElement | null>(null);
  let appRef = useRef<VueApp | null>(null);
  let propsRef = useRef<VueRef<Record<string, unknown>> | null>(null);
  let slotTextRef = useRef<VueRef<string | null> | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    appRef.current?.unmount();
    mountRef.current.innerHTML = '';

    let currentProps = vueRef(normalizeProps(componentProps));
    let currentSlotText = vueRef(getSlotText(children));
    propsRef.current = currentProps;
    slotTextRef.current = currentSlotText;

    let app = createApp({
      render() {
        return h(
          VueSpectrumProvider,
          {style: {display: 'inline-flex'}},
          {
            default: () => h(component as any, currentProps.value as any, currentSlotText.value ? {default: () => currentSlotText.value} : undefined)
          }
        );
      }
    });

    app.mount(mountRef.current);
    appRef.current = app;

    return () => {
      appRef.current?.unmount();
      appRef.current = null;
      propsRef.current = null;
      slotTextRef.current = null;
    };
  }, [component]);

  useEffect(() => {
    if (propsRef.current) {
      propsRef.current.value = normalizeProps(componentProps);
    }

    if (slotTextRef.current) {
      slotTextRef.current.value = getSlotText(children);
    }
  }, [children, componentProps]);

  return <div ref={mountRef} />;
}

type VueButtonExampleProps = {
  children?: ReactNode,
  variant?: 'primary' | 'quiet' | 'secondary',
  type?: 'button' | 'submit' | 'reset',
  isDisabled?: boolean,
  isPending?: boolean,
  disabled?: boolean,
  onClick?: (event: MouseEvent) => void,
  onPress?: (event: unknown) => void,
  onPressChange?: (isPressed: boolean) => void,
  onPressEnd?: (event: unknown) => void,
  onPressStart?: (event: unknown) => void,
  onPressUp?: (event: unknown) => void
};

type VueTailwindButtonVariant = 'primary' | 'secondary' | 'destructive' | 'quiet';
type VueTailwindButtonExampleProps = Omit<VueButtonExampleProps, 'variant'> & {
  variant?: VueTailwindButtonVariant
};

const TAILWIND_BUTTON_BASE_CLASS = [
  'tailwind-base',
  'relative inline-flex items-center justify-center gap-2',
  'border border-transparent dark:border-white/10',
  'h-9 box-border px-3.5 py-0',
  'font-sans text-sm text-center transition rounded-lg cursor-default',
  '[-webkit-tap-highlight-color:transparent]',
  'outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-0',
  'data-[pending]:cursor-progress'
].join(' ');

const TAILWIND_BUTTON_VARIANT_CLASS: Record<VueTailwindButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 pressed:bg-blue-800 text-white',
  secondary: 'border-black/10 bg-neutral-50 hover:bg-neutral-100 pressed:bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:pressed:bg-neutral-500 dark:text-neutral-100',
  destructive: 'bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white',
  quiet: 'border-0 bg-transparent hover:bg-neutral-200 pressed:bg-neutral-300 text-neutral-800 dark:hover:bg-neutral-700 dark:pressed:bg-neutral-600 dark:text-neutral-100'
};

const TAILWIND_BUTTON_DISABLED_CLASS = 'border-transparent dark:border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]';
const TAILWIND_BUTTON_QUIET_DISABLED_CLASS = 'bg-transparent dark:bg-transparent';

function getTailwindButtonClassName(variant: VueTailwindButtonVariant, isDisabled: boolean) {
  let classes = [TAILWIND_BUTTON_BASE_CLASS, TAILWIND_BUTTON_VARIANT_CLASS[variant]];

  if (isDisabled) {
    classes.push(TAILWIND_BUTTON_DISABLED_CLASS);
    if (variant === 'quiet') {
      classes.push(TAILWIND_BUTTON_QUIET_DISABLED_CLASS);
    }
  }

  return classes.join(' ');
}

export function VueButtonExample({children, isDisabled, disabled, ...props}: VueButtonExampleProps) {
  return (
    <VueComponentHost component={VueButton} componentProps={{...props, className: 'react-aria-Button button-base', isDisabled: disabled ?? isDisabled}}>
      {children}
    </VueComponentHost>
  );
}

export function VueTailwindButtonExample({children, isDisabled, disabled, variant = 'primary', ...props}: VueTailwindButtonExampleProps) {
  let resolvedIsDisabled = disabled ?? isDisabled ?? false;

  return (
    <VueComponentHost
      component={VueButton}
      componentProps={{
        ...props,
        className: getTailwindButtonClassName(variant, resolvedIsDisabled),
        isDisabled: resolvedIsDisabled,
        variant
      }}>
      {children}
    </VueComponentHost>
  );
}

type PointerTypeEvent = {
  pointerType: string
};

export function VueButtonEventsDemo() {
  let [pointerType, setPointerType] = useState('');

  return (
    <>
      <VueButtonExample
        onPressStart={event => setPointerType((event as PointerTypeEvent).pointerType)}
        onPressEnd={() => setPointerType('')}>
        Press me
      </VueButtonExample>
      <p>{pointerType ? `You are pressing the button with a ${pointerType}!` : 'Ready to be pressed.'}</p>
    </>
  );
}

const PENDING_TIMEOUT_MS = 5000;

export function VueButtonPendingDemo() {
  let [isPending, setPending] = useState(false);
  let timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return (
    <VueButtonExample
      isPending={isPending}
      onPress={() => {
        if (isPending) {
          return;
        }

        setPending(true);
        timeoutRef.current = setTimeout(() => {
          setPending(false);
          timeoutRef.current = null;
        }, PENDING_TIMEOUT_MS);
      }}>
      Save
    </VueButtonExample>
  );
}

export function VueLinkButtonDemo() {
  return (
    <VueComponentHost component={VueLink} componentProps={{className: 'react-aria-Button button-base', href: 'https://adobe.com/', target: '_blank'}}>
      Adobe
    </VueComponentHost>
  );
}
