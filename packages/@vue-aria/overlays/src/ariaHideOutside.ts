import {nodeContains} from './utils';

function shouldKeepVisible(candidate: Element, targets: Element[]): boolean {
  return targets.some((target) => target === candidate || nodeContains(target, candidate) || nodeContains(candidate, target));
}

export function ariaHideOutside(elements: Array<Element | null | undefined>): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  let targets = elements.filter((element): element is Element => element instanceof Element);
  if (targets.length === 0) {
    return () => {};
  }

  let records: Array<{element: Element, previous: string | null}> = [];
  for (let child of Array.from(document.body.children)) {
    if (shouldKeepVisible(child, targets)) {
      continue;
    }

    records.push({
      element: child,
      previous: child.getAttribute('aria-hidden')
    });
    child.setAttribute('aria-hidden', 'true');
  }

  return () => {
    for (let record of records) {
      if (record.previous == null) {
        record.element.removeAttribute('aria-hidden');
      } else {
        record.element.setAttribute('aria-hidden', record.previous);
      }
    }
  };
}
