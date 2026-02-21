import '@adobe/spectrum-css-temp/components/dropzone/vars.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, ref} from 'vue';
const styles: {[key: string]: string} = {};


let dropZoneId = 0;

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
    replaceMessage: {
      type: String,
      default: ''
    }
  },
  emits: {
    blur: (event: FocusEvent) => event instanceof FocusEvent,
    filesDrop: (files: File[]) => Array.isArray(files),
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    textDrop: (text: string) => typeof text === 'string'
  },
  setup(props, {attrs, emit, slots}) {
    let isOver = ref(false);
    let inputRef = ref<HTMLInputElement | null>(null);
    let id = `vs-drop-zone-${++dropZoneId}`;

    let headingId = `${id}-heading`;
    let messageId = `${id}-message`;

    let ariaLabelledby = computed(() => props.isFilled ? `${headingId} ${messageId}` : headingId);

    let emitFiles = (list: FileList | null) => {
      if (!list || list.length === 0) {
        return;
      }

      emit('filesDrop', Array.from(list));
    };

    return () => h('div', {
      ...attrs,
      class: [
        classNames(styles, 'spectrum-Dropzone', {
          'spectrum-Dropzone--filled': props.isFilled
        }),
        'vs-drop-zone',
        props.disabled ? 'is-disabled' : null,
        isOver.value ? 'is-over' : null,
        attrs.class
      ],
      'aria-labelledby': ariaLabelledby.value,
      'data-vac': '',
      onDragover: (event: DragEvent) => {
        if (props.disabled) {
          return;
        }

        event.preventDefault();
        isOver.value = true;
      },
      onDragleave: (event: DragEvent) => {
        if (props.disabled) {
          return;
        }

        event.preventDefault();
        isOver.value = false;
      },
      onDrop: (event: DragEvent) => {
        if (props.disabled) {
          return;
        }

        event.preventDefault();
        isOver.value = false;
        emitFiles(event.dataTransfer?.files ?? null);

        let text = event.dataTransfer?.getData('text/plain') ?? '';
        if (text) {
          emit('textDrop', text);
        }
      },
      onFocus: (event: FocusEvent) => emit('focus', event),
      onBlur: (event: FocusEvent) => emit('blur', event)
    }, [
      h('p', {
        id: headingId,
        class: ['vs-drop-zone__label']
      }, props.label),
      slots.default ? h('div', {
        class: [classNames(styles, 'spectrum-Dropzone-illustratedMessage'), 'vs-drop-zone__illustration']
      }, slots.default()) : null,
      h('button', {
        class: 'vs-drop-zone__browse',
        type: 'button',
        disabled: props.disabled,
        onClick: () => inputRef.value?.click()
      }, 'Browse files'),
      h('input', {
        ref: inputRef,
        class: 'vs-drop-zone__input',
        type: 'file',
        accept: props.accept || undefined,
        multiple: props.multiple,
        disabled: props.disabled,
        onInput: (event: Event) => {
          let target = event.currentTarget as HTMLInputElement | null;
          emitFiles(target?.files ?? null);
          if (target) {
            target.value = '';
          }
        }
      }),
      h('div', {
        class: [classNames(styles, 'spectrum-Dropzone-backdrop'), 'vs-drop-zone__backdrop']
      }),
      h('div', {
        id: messageId,
        class: [classNames(styles, 'spectrum-Dropzone-banner'), 'vs-drop-zone__banner']
      }, props.replaceMessage || 'Drop to replace')
    ]);
  }
});

export {DropZone as VueDropZone};
export type SpectrumDropZoneProps = InstanceType<typeof DropZone>['$props'];
