import {computed, type ComputedRef} from 'vue';
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

export function useMove(props: MoveEvents = {}): MoveResult {
  let didMove = false;
  let activePointerId: number | null = null;
  let lastPosition: {x: number, y: number} | null = null;
  let activeTarget: Element | null = null;
  let removeGlobalListeners = () => {};

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
    restoreTextSelection(activeTarget);

    if (didMove) {
      props.onMoveEnd?.({
        pointerType,
        type: 'moveend',
        ...getModifierKeys(event)
      });
    }

    didMove = false;
    activePointerId = null;
    activeTarget = null;
    lastPosition = null;
    removeGlobalListeners();
  };

  let onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || activePointerId != null || typeof window === 'undefined') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    activeTarget = event.currentTarget instanceof Element ? event.currentTarget : null;
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

    window.addEventListener('pointermove', onPointerMove, false);
    window.addEventListener('pointerup', onPointerUpOrCancel, false);
    window.addEventListener('pointercancel', onPointerUpOrCancel, false);

    removeGlobalListeners = () => {
      window.removeEventListener('pointermove', onPointerMove, false);
      window.removeEventListener('pointerup', onPointerUpOrCancel, false);
      window.removeEventListener('pointercancel', onPointerUpOrCancel, false);
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

    activeTarget = event.currentTarget instanceof Element ? event.currentTarget : null;
    disableTextSelection(activeTarget);

    triggerMove(event, 'keyboard', deltaX, deltaY);
    triggerMoveEnd(event, 'keyboard');
  };

  return {
    moveProps: computed<MoveDOMProps>(() => ({
      onKeyDown,
      onPointerDown
    }))
  };
}
