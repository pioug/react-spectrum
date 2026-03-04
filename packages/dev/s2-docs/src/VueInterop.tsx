'use client';

import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {createApp, h, type App as VueApp, type Component as VueComponent} from 'vue';
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

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    appRef.current?.unmount();
    mountRef.current.innerHTML = '';

    let slotText = getSlotText(children);
    let props = normalizeProps(componentProps);

    let app = createApp({
      render() {
        return h(
          VueSpectrumProvider,
          {style: {display: 'inline-flex'}},
          {
            default: () => h(component as any, props as any, slotText ? {default: () => slotText} : undefined)
          }
        );
      }
    });

    app.mount(mountRef.current);
    appRef.current = app;

    return () => {
      appRef.current?.unmount();
      appRef.current = null;
    };
  }, [children, component, componentProps]);

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

export function VueButtonExample({children, isDisabled, disabled, ...props}: VueButtonExampleProps) {
  return (
    <VueComponentHost component={VueButton} componentProps={{...props, className: 'react-aria-Button button-base', isDisabled: disabled ?? isDisabled}}>
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
