import {computed, getCurrentScope, onScopeDispose, type ComputedRef} from 'vue';
import {disableTextSelection, restoreTextSelection} from './textSelection';
import type {PointerType} from './types';

interface ModifierKeys {
  altKey: boolean,
  ctrlKey: boolean,
  metaKey: boolean,
  shiftKey: boolean
}

export interface MoveStartEvent extends ModifierKeys {
  pointerType: PointerType,
  type: 'movestart'
}

export interface MoveMoveEvent extends ModifierKeys {
  deltaX: number,
  deltaY: number,
  pointerType: PointerType,
  type: 'move'
}

export interface MoveEndEvent extends ModifierKeys {
  pointerType: PointerType,
  type: 'moveend'
}

export interface MoveEvents {
  onMove?: (event: MoveMoveEvent) => void,
  onMoveEnd?: (event: MoveEndEvent) => void,
  onMoveStart?: (event: MoveStartEvent) => void
}

export interface MoveDOMProps {
  onKeyDown?: (event: KeyboardEvent) => void,
  onPointerDown?: (event: PointerEvent) => void
}

export interface MoveResult {
  moveProps: ComputedRef<MoveDOMProps>
}

function getModifierKeys(event: KeyboardEvent | PointerEvent): ModifierKeys {
  return {
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey
  };
}

function normalizePointerType(event: PointerEvent): PointerType {
  if (event.pointerType === 'pen' || event.pointerType === 'touch') {
    return event.pointerType;
  }

  return 'mouse';
}

function isElementNode(value: unknown): value is Element {
  return Boolean(value && typeof value === 'object' && 'nodeType' in (value as Record<string, unknown>) && (value as {nodeType?: unknown}).nodeType === 1);
}

export function useMove(props: MoveEvents = {}): MoveResult {
  let didMove = false;
  let activePointerId: number | null = null;
  let lastPosition: {x: number, y: number} | null = null;
  let activeTarget: Element | null = null;
  let removeGlobalListeners = () => {};

  let getOwnerWindow = (target: Element | null): Window | null => {
    if (target?.ownerDocument?.defaultView) {
      return target.ownerDocument.defaultView;
    }

    if (typeof window !== 'undefined') {
      return window;
    }

    return null;
  };

  let resetMove = () => {
    restoreTextSelection(activeTarget);
    didMove = false;
    activePointerId = null;
    activeTarget = null;
    lastPosition = null;
    removeGlobalListeners();
  };

  let triggerMoveStart = (event: KeyboardEvent | PointerEvent, pointerType: PointerType) => {
    if (didMove) {
      return;
    }

    didMove = true;
    props.onMoveStart?.({
      pointerType,
      type: 'movestart',
      ...getModifierKeys(event)
    });
  };

  let triggerMove = (
    event: KeyboardEvent | PointerEvent,
    pointerType: PointerType,
    deltaX: number,
    deltaY: number
  ) => {
    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    triggerMoveStart(event, pointerType);

    props.onMove?.({
      deltaX,
      deltaY,
      pointerType,
      type: 'move',
      ...getModifierKeys(event)
    });
  };

  let triggerMoveEnd = (event: KeyboardEvent | PointerEvent, pointerType: PointerType) => {
    if (didMove) {
      props.onMoveEnd?.({
        pointerType,
        type: 'moveend',
        ...getModifierKeys(event)
      });
    }

    resetMove();
  };

  let onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || activePointerId != null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    activeTarget = isElementNode(event.currentTarget) ? event.currentTarget : null;
    let ownerWindow = getOwnerWindow(activeTarget);
    if (!ownerWindow) {
      return;
    }
    disableTextSelection(activeTarget);

    activePointerId = event.pointerId;
    lastPosition = {
      x: event.pageX,
      y: event.pageY
    };

    let onPointerMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== activePointerId) {
        return;
      }

      let deltaX = moveEvent.pageX - (lastPosition?.x ?? moveEvent.pageX);
      let deltaY = moveEvent.pageY - (lastPosition?.y ?? moveEvent.pageY);
      lastPosition = {
        x: moveEvent.pageX,
        y: moveEvent.pageY
      };

      triggerMove(moveEvent, normalizePointerType(moveEvent), deltaX, deltaY);
    };

    let onPointerUpOrCancel = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== activePointerId) {
        return;
      }

      triggerMoveEnd(upEvent, normalizePointerType(upEvent));
    };

    ownerWindow.addEventListener('pointermove', onPointerMove, false);
    ownerWindow.addEventListener('pointerup', onPointerUpOrCancel, false);
    ownerWindow.addEventListener('pointercancel', onPointerUpOrCancel, false);

    removeGlobalListeners = () => {
      ownerWindow.removeEventListener('pointermove', onPointerMove, false);
      ownerWindow.removeEventListener('pointerup', onPointerUpOrCancel, false);
      ownerWindow.removeEventListener('pointercancel', onPointerUpOrCancel, false);
      removeGlobalListeners = () => {};
    };
  };

  let onKeyDown = (event: KeyboardEvent) => {
    let deltaX = 0;
    let deltaY = 0;

    if (event.key === 'ArrowLeft' || event.key === 'Left') {
      deltaX = -1;
    } else if (event.key === 'ArrowRight' || event.key === 'Right') {
      deltaX = 1;
    } else if (event.key === 'ArrowUp' || event.key === 'Up') {
      deltaY = -1;
    } else if (event.key === 'ArrowDown' || event.key === 'Down') {
      deltaY = 1;
    } else {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    activeTarget = isElementNode(event.currentTarget) ? event.currentTarget : null;
    disableTextSelection(activeTarget);

    triggerMove(event, 'keyboard', deltaX, deltaY);
    triggerMoveEnd(event, 'keyboard');
  };
  if (getCurrentScope()) {
    onScopeDispose(() => {
      resetMove();
    });
  }

  return {
    moveProps: computed<MoveDOMProps>(() => ({
      onKeyDown,
      onPointerDown
    }))
  };
}
