import '@adobe/spectrum-css-temp/components/dropzone/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, ref, type PropType} from 'vue';
const styles: {[key: string]: string} = {};

let dropZoneId = 0;
type DropOperation = 'copy' | 'move' | 'link' | 'cancel';

function isEventObject(event: unknown): boolean {
  return typeof event === 'object' && event !== null;
}

function getTransferTypes(event: DragEvent): Set<string> {
  return new Set(Array.from(event.dataTransfer?.types ?? []));
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
    drop: (event: DragEvent) => isEventObject(event),
    dropEnter: (event: DragEvent) => isEventObject(event),
    dropExit: (event: DragEvent) => isEventObject(event),
    filesDrop: (files: File[]) => Array.isArray(files),
    focus: (event: FocusEvent) => isEventObject(event),
    paste: (event: ClipboardEvent) => isEventObject(event),
    textDrop: (text: string) => typeof text === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let isOver = ref(false);
    let id = `vs-drop-zone-${++dropZoneId}`;
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
        class: [
          classNames(styles, 'spectrum-Dropzone', {
            'spectrum-Dropzone--filled': props.isFilled
          }),
          'vs-drop-zone',
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
        },
        onDragenter: (event: DragEvent) => {
          if (!allowsDrop(event)) {
            isOver.value = false;
            return;
          }

          event.preventDefault();
          isOver.value = true;
          emit('dropEnter', event);
        },
        onDragleave: (event: DragEvent) => {
          if (isDisabled.value) {
            return;
          }

          event.preventDefault();
          isOver.value = false;
          emit('dropExit', event);
        },
        onDrop: (event: DragEvent) => {
          if (!allowsDrop(event)) {
            isOver.value = false;
            return;
          }

          event.preventDefault();
          isOver.value = false;
          emit('drop', event);
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
          class: 'vs-drop-zone__label',
          style: visuallyHiddenStyle
        }, props.label),
        slots.default
          ? h('div', {
            class: [classNames(styles, 'spectrum-Dropzone-illustratedMessage'), 'vs-drop-zone__illustration']
          }, slots.default())
          : h('span', {class: 'react-aria-Text'}, props.label),
        h('div', {
          class: [classNames(styles, 'spectrum-Dropzone-backdrop'), 'vs-drop-zone__backdrop']
        }),
        h('div', {
          id: messageId,
          class: [classNames(styles, 'spectrum-Dropzone-banner'), 'vs-drop-zone__banner']
        }, props.replaceMessage || 'Drop to replace')
      ]);
    };
  }
});

export {DropZone as VueDropZone};
export type SpectrumDropZoneProps = InstanceType<typeof DropZone>['$props'];
