import {computed, defineComponent, h, ref} from 'vue';
import {getSpectrumContext} from '../context';

export const VueDropZone = defineComponent({
  name: 'VueDropZone',
  props: {
    label: {
      type: String,
      default: 'Drop files here'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    filesDrop: (files: File[]) => Array.isArray(files),
    textDrop: (text: string) => typeof text === 'string',
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();
    let isOver = ref(false);
    let inputRef = ref<HTMLInputElement | null>(null);

    let classes = computed(() => ([
      'vs-drop-zone',
      context.value.scale === 'large' ? 'vs-drop-zone--large' : 'vs-drop-zone--medium',
      props.disabled ? 'is-disabled' : null,
      isOver.value ? 'is-over' : null
    ]));

    let emitFiles = (list: FileList | null) => {
      if (!list || list.length === 0) {
        return;
      }

      emit('filesDrop', Array.from(list));
    };

    return function render() {
      return h('div', {
        class: [classes.value, attrs.class],
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
        h('p', {class: 'vs-drop-zone__label'}, props.label),
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
        })
      ]);
    };
  }
});
