type Revert = () => void;

const MODAL_SELECTOR = '[aria-modal="true"], [data-ismodal="true"]';
const currentDocument = typeof document !== 'undefined' ? document : undefined;

function nodeContains(target: Node, node: Node): boolean {
  if (target === node) {
    return true;
  }

  return Boolean(target.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
}

function createAriaHiddenReverter(visibleRoots: HTMLElement[], document: Document): Revert {
  let touchedNodes: Array<{element: HTMLElement, previousValue: string | null}> = [];
  let allElements = Array.from(document.body.querySelectorAll<HTMLElement>('*'));

  for (let element of allElements) {
    let isVisible = visibleRoots.some((root) => {
      return nodeContains(root, element) || nodeContains(element, root);
    });

    if (isVisible) {
      continue;
    }

    let previousValue = element.getAttribute('aria-hidden');
    touchedNodes.push({element, previousValue});
    element.setAttribute('aria-hidden', 'true');
  }

  return () => {
    for (let node of touchedNodes) {
      if (node.previousValue === null) {
        node.element.removeAttribute('aria-hidden');
      } else {
        node.element.setAttribute('aria-hidden', node.previousValue);
      }
    }
  };
}

function findModalContainer(nodes: NodeList): Element | null {
  for (let node of Array.from(nodes)) {
    if (!(node instanceof Element)) {
      continue;
    }

    if (node.matches(MODAL_SELECTOR) || node.querySelector(MODAL_SELECTOR)) {
      return node;
    }
  }

  return null;
}

function findLiveAnnouncer(document: Document): HTMLElement | null {
  return document.querySelector('[data-live-announcer="true"]');
}

/**
 * Watches for modal containers and hides non-modal regions using `aria-hidden`.
 */
export function watchModals(
  selector: string = 'body',
  {document = currentDocument}: {document?: Document} = {}
): Revert {
  if (!document) {
    return () => {};
  }

  let target = document.querySelector(selector);
  if (!target) {
    return () => {};
  }

  let modalContainers: Element[] = [];
  let undo: Revert | undefined;

  let updateAriaHiddenState = () => {
    undo?.();
    undo = undefined;

    if (modalContainers.length === 0) {
      return;
    }

    let activeContainer = modalContainers[modalContainers.length - 1];
    let activeModal = activeContainer.matches(MODAL_SELECTOR)
      ? activeContainer
      : activeContainer.querySelector(MODAL_SELECTOR);
    if (!(activeModal instanceof HTMLElement)) {
      return;
    }

    let liveAnnouncer = findLiveAnnouncer(document);
    let visibleRoots = liveAnnouncer ? [activeModal, liveAnnouncer] : [activeModal];
    undo = createAriaHiddenReverter(visibleRoots, document);
  };

  let observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type !== 'childList') {
        continue;
      }

      let addedContainer = findModalContainer(mutation.addedNodes);
      if (addedContainer) {
        modalContainers.push(addedContainer);
      }

      if (mutation.removedNodes.length > 0) {
        let removedNodes = Array.from(mutation.removedNodes).filter((node): node is Element => node instanceof Element);
        modalContainers = modalContainers.filter((container) => !removedNodes.includes(container));
      }
    }

    updateAriaHiddenState();
  });

  observer.observe(target, {childList: true});

  return () => {
    undo?.();
    observer.disconnect();
  };
}
