export type Assertiveness = 'assertive' | 'polite';
export type Message = string | {'aria-labelledby': string};

const LIVEREGION_TIMEOUT_DELAY = 7000;

let liveAnnouncer: LiveAnnouncer | null = null;

export function announce(
  message: Message,
  assertiveness: Assertiveness = 'assertive',
  timeout: number = LIVEREGION_TIMEOUT_DELAY
): void {
  if (!liveAnnouncer) {
    liveAnnouncer = new LiveAnnouncer();
  }

  liveAnnouncer.announce(message, assertiveness, timeout);
}

export function clearAnnouncer(assertiveness: Assertiveness): void {
  liveAnnouncer?.clear(assertiveness);
}

export function destroyAnnouncer(): void {
  if (!liveAnnouncer) {
    return;
  }

  liveAnnouncer.destroy();
  liveAnnouncer = null;
}

class LiveAnnouncer {
  assertiveLog: HTMLElement | null = null;
  node: HTMLElement | null = null;
  politeLog: HTMLElement | null = null;

  constructor() {
    if (typeof document === 'undefined') {
      return;
    }

    this.node = document.createElement('div');
    this.node.dataset.liveAnnouncer = 'true';
    Object.assign(this.node.style, {
      border: 0,
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: '1px'
    });

    this.assertiveLog = this.createLog('assertive');
    this.node.appendChild(this.assertiveLog);

    this.politeLog = this.createLog('polite');
    this.node.appendChild(this.politeLog);

    document.body.prepend(this.node);
  }

  clear(assertiveness: Assertiveness): void {
    if (!this.node) {
      return;
    }

    if (assertiveness === 'assertive' && this.assertiveLog) {
      this.assertiveLog.innerHTML = '';
      return;
    }

    if (assertiveness === 'polite' && this.politeLog) {
      this.politeLog.innerHTML = '';
    }
  }

  createLog(ariaLive: Assertiveness): HTMLElement {
    let node = document.createElement('div');
    node.setAttribute('role', 'log');
    node.setAttribute('aria-live', ariaLive);
    node.setAttribute('aria-relevant', 'additions');
    return node;
  }

  destroy(): void {
    if (!this.node) {
      return;
    }

    if (this.node.parentElement) {
      this.node.parentElement.removeChild(this.node);
    }

    this.node = null;
    this.assertiveLog = null;
    this.politeLog = null;
  }

  announce(message: Message, assertiveness: Assertiveness, timeout: number): void {
    if (!this.node) {
      return;
    }

    let node = document.createElement('div');
    if (typeof message === 'object') {
      node.setAttribute('role', 'img');
      node.setAttribute('aria-labelledby', message['aria-labelledby']);
    } else {
      node.textContent = message;
    }

    if (assertiveness === 'assertive') {
      this.assertiveLog?.appendChild(node);
    } else {
      this.politeLog?.appendChild(node);
    }

    if (message !== '' && timeout > 0) {
      setTimeout(() => {
        node.remove();
      }, timeout);
    }
  }
}
