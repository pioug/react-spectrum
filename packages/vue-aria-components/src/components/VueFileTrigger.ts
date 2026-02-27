import {chain, filterDOMProps} from '@vue-aria/utils';
import {cloneVNode, computed, defineComponent, h, isVNode, type PropType, ref} from 'vue';

type DefaultCamera = 'user' | 'environment';

export const VueFileTrigger = defineComponent({
  name: 'VueFileTrigger',
  inheritAttrs: false,
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
    let inputRef = ref<HTMLInputElement | null>(null);

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

    let openPicker = () => {
      if (inputRef.value?.value) {
        inputRef.value.value = '';
      }

      inputRef.value?.click();
    };

    return function render() {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {global: true}) as Record<string, unknown>;
      let {style: domStyle, ...restDomProps} = domProps;
      let children = slots.default ? slots.default() : [];
      let triggers = children.map((child) => {
        if (!isVNode(child)) {
          return child;
        }

        return cloneVNode(child, {
          onClick: chain((child.props as {onClick?: ((event: Event) => void)} | undefined)?.onClick, openPicker)
        });
      });

      return [
        ...triggers,
        h('input', {
          ...restDomProps,
          ref: inputRef,
          class: '',
          'data-rac': '',
          type: 'file',
          style: [{display: 'none'}, domStyle],
          accept: acceptValue.value,
          multiple: allowsMultiple.value,
          capture: props.defaultCamera,
          disabled: props.disabled,
          webkitdirectory: props.acceptDirectory ? '' : undefined,
          onChange: (event: Event) => {
            let target = event.currentTarget as HTMLInputElement | null;
            emitFiles(target?.files ?? null);
          }
        })
      ];
    };
  }
});
