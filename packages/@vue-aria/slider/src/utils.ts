import type {MaybeRef, SliderState} from './types';
import {unref} from 'vue';

export interface SliderData {
  'aria-describedby'?: string,
  'aria-details'?: string,
  id: string
}

export interface SliderPoint {
  clientX: number,
  clientY: number,
  pointerId?: number
}

export type SliderTrackRef = MaybeRef<Element | null | undefined>;

export const sliderData = new WeakMap<SliderState, SliderData>();

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getSliderThumbId(state: SliderState, index: number): string {
  let data = sliderData.get(state);
  if (!data) {
    throw new Error('Unknown slider state');
  }

  return `${data.id}-${index}`;
}

export function resolveBoolean(value: MaybeRef<boolean> | undefined): boolean {
  if (value == null) {
    return false;
  }

  return Boolean(unref(value));
}

export function resolveMaybeRef<T>(value: MaybeRef<T> | undefined, fallback: T): T {
  if (value == null) {
    return fallback;
  }

  return unref(value);
}

export function resolveOptionalString(value: MaybeRef<string | undefined> | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return unref(value);
}

export function resolveTrackElement(trackRef: SliderTrackRef): Element | null {
  return unref(trackRef) ?? null;
}

export function eventHasModifiers(event: MouseEvent | PointerEvent): boolean {
  return Boolean(event.altKey || event.ctrlKey || event.metaKey || event.button !== 0);
}

export function getEventPoint(event: MouseEvent | PointerEvent | TouchEvent): SliderPoint | null {
  if ('changedTouches' in event) {
    let touch = event.changedTouches[0] ?? event.touches[0];
    if (!touch) {
      return null;
    }

    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
      pointerId: touch.identifier
    };
  }

  return {
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: 'pointerId' in event ? event.pointerId : undefined
  };
}

export function getInputNumberValue(valueOrEvent: Event | number | string): number | null {
  if (typeof valueOrEvent === 'number') {
    return Number.isFinite(valueOrEvent) ? valueOrEvent : null;
  }

  if (typeof valueOrEvent === 'string') {
    let parsedValue = Number.parseFloat(valueOrEvent);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  let target = valueOrEvent.target;
  if (!target || typeof target !== 'object' || !('value' in target)) {
    return null;
  }

  let rawValue = String(target.value);
  let parsedValue = Number.parseFloat(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}
