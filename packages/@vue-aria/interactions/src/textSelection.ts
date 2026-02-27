type State = 'default' | 'disabled' | 'restoring';

let state: State = 'default';
let savedUserSelect = '';
let modifiedElementMap = new WeakMap<Element, string>();

function isIOS(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Mac/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
}

function getOwnerDocument(target?: Element | null): Document | null {
  if (target?.ownerDocument) {
    return target.ownerDocument;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

function runAfterTransition(callback: () => void): void {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      callback();
    });
    return;
  }

  setTimeout(callback, 0);
}

export function disableTextSelection(target?: Element | null): void {
  if (isIOS()) {
    let ownerDocument = getOwnerDocument(target);
    if (!ownerDocument) {
      return;
    }

    if (state === 'default') {
      savedUserSelect = ownerDocument.documentElement.style.webkitUserSelect;
      ownerDocument.documentElement.style.webkitUserSelect = 'none';
    }

    state = 'disabled';
    return;
  }

  if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
    return;
  }

  let property: 'userSelect' | 'webkitUserSelect' = 'userSelect' in target.style ? 'userSelect' : 'webkitUserSelect';
  modifiedElementMap.set(target, target.style[property]);
  target.style[property] = 'none';
}

export function restoreTextSelection(target?: Element | null): void {
  if (isIOS()) {
    if (state !== 'disabled') {
      return;
    }

    state = 'restoring';

    setTimeout(() => {
      runAfterTransition(() => {
        if (state !== 'restoring') {
          return;
        }

        let ownerDocument = getOwnerDocument(target);
        if (ownerDocument?.documentElement.style.webkitUserSelect === 'none') {
          ownerDocument.documentElement.style.webkitUserSelect = savedUserSelect || '';
        }

        savedUserSelect = '';
        state = 'default';
      });
    }, 300);
    return;
  }

  if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
    return;
  }

  if (!modifiedElementMap.has(target)) {
    return;
  }

  let property: 'userSelect' | 'webkitUserSelect' = 'userSelect' in target.style ? 'userSelect' : 'webkitUserSelect';
  let previousUserSelect = modifiedElementMap.get(target) ?? '';
  target.style[property] = previousUserSelect;

  if (target.getAttribute('style') === '') {
    target.removeAttribute('style');
  }

  modifiedElementMap.delete(target);
}
