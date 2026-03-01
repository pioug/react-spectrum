import '@adobe/spectrum-css-temp/components/dropzone/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, ref, type PropType} from 'vue';
const styles: {[key: string]: string} = {};

let dropZoneId = 0;
type DropOperation = 'copy' | 'move' | 'link' | 'cancel';

type DropItem = {
  kind: 'file',
  type: string,
  name: string,
  getFile: () => Promise<File>,
  getText: () => Promise<string>
} | {
  kind: 'text',
  types: Set<string>,
  getText: (type: string) => Promise<string>
};

type DropZoneDropEvent = {
  type: 'drop',
  x: number,
  y: number,
  dropOperation: DropOperation,
  items: DropItem[]
};

type DropZonePointEvent = {
  type: 'drop' | 'dropenter' | 'dropmove' | 'dropexit',
  x: number,
  y: number
};

function isEventObject(event: unknown): boolean {
  return typeof event === 'object' && event !== null;
}

function getTransferTypes(event: DragEvent): Set<string> {
  return new Set(Array.from(event.dataTransfer?.types ?? []));
}

function getDropOperationFromEvent(event: DragEvent, getDropOperation?: (types: Set<string>) => DropOperation | undefined): DropOperation {
  if (!getDropOperation) {
    let operation = event.dataTransfer?.dropEffect;
    if (operation === 'move' || operation === 'copy' || operation === 'link') {
      return operation;
    }

    return 'copy';
  }

  return getDropOperation(getTransferTypes(event)) ?? 'cancel';
}

function createDropItems(event: DragEvent, allowsMultiple: boolean): DropItem[] {
  let files = Array.from(event.dataTransfer?.files ?? []);
  let fileItems: DropItem[] = files.map((file) => ({
    kind: 'file',
    type: file.type,
    name: file.name,
    getFile: async () => file,
    getText: async () => file.text()
  }));

  if (!allowsMultiple && fileItems.length > 1) {
    fileItems = fileItems.slice(0, 1);
  }

  let textItems = Array.from(event.dataTransfer?.items ?? [])
    .filter((item) => item.kind === 'string')
    .map((item) => {
      let textValue: string | null = null;
      let textPromise: Promise<string> | null = null;

      let readText = () => {
        if (textValue !== null) {
          return Promise.resolve(textValue);
        }

        if (!textPromise) {
          textPromise = new Promise((resolve) => {
            item.getAsString((value) => {
              textValue = value;
              resolve(value);
            });
          });
        }

        return textPromise;
      };

      return {
        kind: 'text',
        types: new Set([item.type || 'text/plain']),
        getText: async (type: string): Promise<string> => {
          if (type === 'text/plain' || type === item.type || !type) {
            return readText();
          }

          return '';
        }
      };
    });

  return [...fileItems, ...textItems];
}

function createPointEvent(type: DropZonePointEvent['type'], event: DragEvent, target: HTMLElement | null): DropZonePointEvent {
  if (!target) {
    return {type, x: event.clientX, y: event.clientY};
  }

  let rect = target.getBoundingClientRect();
  return {
    type,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

const visuallyHiddenStyle = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px'
} as const;

export const DropZone = defineComponent({
  name: 'VueDropZone',
  inheritAttrs: false,
  props: {
    accept: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: undefined
    },
    isFilled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Drop files here'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    getDropOperation: {
      type: Function as PropType<(types: Set<string>) => DropOperation | undefined>,
      default: undefined
    },
    replaceMessage: {
      type: String,
      default: ''
    }
  },
  emits: {
    blur: (event: FocusEvent) => isEventObject(event),
    drop: (event: DropZoneDropEvent) => isEventObject(event),
    dropEnter: (event: DropZonePointEvent) => isEventObject(event),
    dropExit: (event: DropZonePointEvent) => isEventObject(event),
    dropMove: (event: DropZonePointEvent) => isEventObject(event),
    filesDrop: (files: File[]) => Array.isArray(files),
    focus: (event: FocusEvent) => isEventObject(event),
    paste: (event: ClipboardEvent) => isEventObject(event),
    textDrop: (text: string) => typeof text === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let isOver = ref(false);
    let rootRef = ref<HTMLElement | null>(null);
    let id = `vs-spectrum-dropzone-${++dropZoneId}`;
    let headingId = `${id}-heading`;
    let messageId = `${id}-message`;

    let isDisabled = computed(() => {
      if (props.isDisabled !== undefined) {
        return props.isDisabled;
      }

      return props.disabled;
    });

    let ariaLabelledby = computed(() => props.isFilled ? `${headingId} ${messageId}` : headingId);

    let emitFiles = (list: FileList | null | undefined) => {
      if (!list || list.length === 0) {
        return;
      }

      let files = Array.from(list);
      if (!props.multiple) {
        files = files.slice(0, 1);
      }

      emit('filesDrop', files);
    };

    let allowsDrop = (event: DragEvent) => {
      if (isDisabled.value) {
        return false;
      }

      if (!props.getDropOperation) {
        return true;
      }

      return props.getDropOperation(getTransferTypes(event)) !== 'cancel';
    };

    return () => {
      let {
        class: className,
        style,
        UNSAFE_className: unsafeClassName,
        unsafeClassName: unsafeClassNameAlias,
        UNSAFE_style: unsafeStyle,
        unsafeStyle: unsafeStyleAlias,
        ...domProps
      } = attrs as Record<string, unknown>;

      let mergedClassName = unsafeClassName ?? unsafeClassNameAlias;
      let mergedStyle = unsafeStyle ?? unsafeStyleAlias;

      return h('div', {
        ...domProps,
        ref: rootRef,
        class: [
          classNames(styles, 'spectrum-Dropzone', {
            'spectrum-Dropzone--filled': props.isFilled
          }),
          'vs-spectrum-dropzone',
          isDisabled.value ? 'is-disabled' : null,
          isOver.value ? 'is-over' : null,
          mergedClassName,
          className
        ],
        style: [style, mergedStyle],
        'aria-labelledby': ariaLabelledby.value,
        'aria-disabled': isDisabled.value ? 'true' : undefined,
        'data-vac': '',
        'data-drop-target': isOver.value ? 'true' : undefined,
        role: 'button',
        tabindex: isDisabled.value ? undefined : 0,
        onDragover: (event: DragEvent) => {
          if (!allowsDrop(event)) {
            isOver.value = false;
            return;
          }

          event.preventDefault();
          isOver.value = true;
          emit('dropMove', createPointEvent('dropmove', event, rootRef.value));
        },
        onDragenter: (event: DragEvent) => {
          if (!allowsDrop(event)) {
            isOver.value = false;
            return;
          }

          event.preventDefault();
          isOver.value = true;
          emit('dropEnter', createPointEvent('dropenter', event, rootRef.value));
        },
        onDragleave: (event: DragEvent) => {
          if (isDisabled.value) {
            return;
          }

          event.preventDefault();
          isOver.value = false;
          emit('dropExit', createPointEvent('dropexit', event, rootRef.value));
        },
        onDrop: (event: DragEvent) => {
          if (!allowsDrop(event)) {
            isOver.value = false;
            return;
          }

          event.preventDefault();
          isOver.value = false;
          let point = createPointEvent('drop', event, rootRef.value);
          emit('drop', {
            type: 'drop',
            x: point.x,
            y: point.y,
            dropOperation: getDropOperationFromEvent(event, props.getDropOperation),
            items: createDropItems(event, props.multiple)
          });
          emitFiles(event.dataTransfer?.files);

          let text = event.dataTransfer?.getData('text/plain') ?? '';
          if (text.length > 0) {
            emit('textDrop', text);
          }
        },
        onFocus: (event: FocusEvent) => emit('focus', event),
        onBlur: (event: FocusEvent) => emit('blur', event),
        onPaste: (event: ClipboardEvent) => {
          if (isDisabled.value) {
            return;
          }

          emit('paste', event);
          let text = event.clipboardData?.getData('text/plain') ?? '';
          if (text.length > 0) {
            emit('textDrop', text);
          }
        }
      }, [
        h('span', {
          id: headingId,
          class: 'vs-spectrum-dropzone__label',
          style: visuallyHiddenStyle
        }, props.label),
        slots.default
          ? h('div', {
            class: [classNames(styles, 'spectrum-Dropzone-illustratedMessage'), 'vs-spectrum-dropzone__illustration']
          }, slots.default())
          : h('span', {class: 'react-aria-Text'}, props.label),
        h('div', {
          class: [classNames(styles, 'spectrum-Dropzone-backdrop'), 'vs-spectrum-dropzone__backdrop']
        }),
        h('div', {
          id: messageId,
          class: [classNames(styles, 'spectrum-Dropzone-banner'), 'vs-spectrum-dropzone__banner']
        }, props.replaceMessage || 'Drop to replace')
      ]);
    };
  }
});

export {DropZone as VueDropZone};
export type SpectrumDropZoneProps = InstanceType<typeof DropZone>['$props'];
