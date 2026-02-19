/**
 * Enables reading pageX/pageY from fireEvent.mouse*(..., {pageX, pageY}).
 */
export function installMouseEvent(): void {
  let oldMouseEvent = MouseEvent;
  beforeAll(() => {
    global.MouseEvent = class FakeMouseEvent extends MouseEvent {
      private _init: MouseEventInit & {pageX?: number, pageY?: number};

      constructor(name: string, init: MouseEventInit & {pageX?: number, pageY?: number} = {}) {
        super(name, init as MouseEventInit);
        this._init = init;
      }

      get pageX() {
        return this._init.pageX ?? 0;
      }

      get pageY() {
        return this._init.pageY ?? 0;
      }
    } as unknown as typeof MouseEvent;
  });

  afterAll(() => {
    global.MouseEvent = oldMouseEvent;
  });
}

function definePointerEvent(): void {
  global.PointerEvent = class FakePointerEvent extends MouseEvent {
    private _init: MouseEventInit & {
      height?: number,
      pageX?: number,
      pageY?: number,
      pointerId?: number,
      pointerType?: string,
      width?: number
    };

    constructor(name: string, init: MouseEventInit & {
      height?: number,
      pageX?: number,
      pageY?: number,
      pointerId?: number,
      pointerType?: string,
      width?: number
    } = {}) {
      super(name, init as MouseEventInit);
      this._init = init;
    }

    get pointerType() {
      return this._init.pointerType ?? 'mouse';
    }

    get pointerId() {
      return this._init.pointerId ?? 1;
    }

    get pageX() {
      return this._init.pageX ?? 0;
    }

    get pageY() {
      return this._init.pageY ?? 0;
    }

    get width() {
      return this._init.width ?? 1;
    }

    get height() {
      return this._init.height ?? 1;
    }
  } as unknown as typeof PointerEvent;
}

export function installPointerEvent(): void {
  beforeAll(definePointerEvent);
  afterAll(() => {
    delete (global as unknown as {PointerEvent?: unknown}).PointerEvent;
  });
}
