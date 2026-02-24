import {computed, defineComponent, h, type PropType, ref} from 'vue';
import {getSpectrumContext} from '../context';

type DefaultCamera = 'user' | 'environment';

export const VueFileTrigger = defineComponent({
  name: 'VueFileTrigger',
  props: {
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    acceptedFileTypes: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    allowsMultiple: {
      type: Boolean,
      default: false
    },
    acceptDirectory: {
      type: Boolean,
      default: false
    },
    defaultCamera: {
      type: String as PropType<DefaultCamera>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    select: (files: File[]) => Array.isArray(files),
    change: (files: File[]) => Array.isArray(files)
  },
  setup(props, {slots, attrs, emit}) {
    let context = getSpectrumContext();
    let inputRef = ref<HTMLInputElement | null>(null);
    let classes = computed(() => ([
      'vs-file-trigger',
      context.value.scale === 'large' ? 'vs-file-trigger--large' : 'vs-file-trigger--medium'
    ]));

    let acceptValue = computed(() => {
      if (props.acceptedFileTypes.length > 0) {
        return props.acceptedFileTypes.join(',');
      }

      return props.accept || undefined;
    });

    let allowsMultiple = computed(() => props.allowsMultiple || props.multiple);

    let emitFiles = (list: FileList | null) => {
      let files = Array.from(list ?? []);
      emit('select', files);
      emit('change', files);
    };

    return function render() {
      return h('div', {
        ...attrs,
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        h('button', {
          class: 'vs-file-trigger__button',
          type: 'button',
          disabled: props.disabled,
          onClick: () => inputRef.value?.click()
        }, slots.default ? slots.default() : 'Choose file'),
        h('input', {
          ref: inputRef,
          class: 'vs-file-trigger__input',
          type: 'file',
          accept: acceptValue.value,
          multiple: allowsMultiple.value,
          capture: props.defaultCamera,
          disabled: props.disabled,
          webkitdirectory: props.acceptDirectory ? 'true' : undefined,
          directory: props.acceptDirectory ? 'true' : undefined,
          onChange: (event: Event) => {
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
