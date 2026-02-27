import {computed, defineComponent, h, ref, type PropType} from 'vue';

type DropOperation = 'copy' | 'move' | 'link' | 'cancel';

function transferTypes(dataTransfer: DataTransfer | null | undefined): Set<string> {
  let types = dataTransfer?.types ?? [];
  return new Set(Array.from(types));
}

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
    isDisabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    getDropOperation: {
      type: Function as PropType<(types: Set<string>) => DropOperation | undefined>,
      default: undefined
    }
  },
  emits: {
    filesDrop: (files: File[]) => Array.isArray(files),
    textDrop: (text: string) => typeof text === 'string',
    drop: (event: DragEvent) => typeof event === 'object' && event !== null,
    dropEnter: (event: DragEvent) => typeof event === 'object' && event !== null,
    dropExit: (event: DragEvent) => typeof event === 'object' && event !== null,
    press: (event: MouseEvent) => event instanceof MouseEvent,
    focus: (event: FocusEvent) => event instanceof FocusEvent,
    blur: (event: FocusEvent) => event instanceof FocusEvent
  },
  setup(props, {emit, attrs, slots}) {
    let isHovered = ref(false);
    let isFocused = ref(false);
    let isFocusVisible = ref(false);
    let isKeyboardModality = ref(false);
    let isOver = ref(false);

    let isDisabled = computed(() => props.isDisabled ?? props.disabled);

    let emitFiles = (list: FileList | null) => {
      if (!list || list.length === 0) {
        return;
      }

      emit('filesDrop', Array.from(list));
    };

    let allowsDrop = (event: DragEvent) => {
      if (isDisabled.value) {
        return false;
      }

      if (!props.getDropOperation) {
        return true;
      }

      return props.getDropOperation(transferTypes(event.dataTransfer)) !== 'cancel';
    };

    return function render() {
      let slotState = {
        isHovered: isHovered.value,
        isFocused: isFocused.value,
        isFocusVisible: isFocusVisible.value,
        isDropTarget: isOver.value,
        isDisabled: isDisabled.value
      };

      return h('div', {
        ...attrs,
        class: ['react-aria-DropZone', attrs.class],
        role: 'button',
        tabindex: isDisabled.value ? undefined : 0,
        'data-rac': '',
        'data-react-aria-pressable': 'true',
        'data-disabled': isDisabled.value ? 'true' : undefined,
        'data-drop-target': isOver.value ? 'true' : undefined,
        'data-hovered': isHovered.value ? 'true' : undefined,
        'data-focused': isFocused.value ? 'true' : undefined,
        'data-focus-visible': isFocusVisible.value ? 'true' : undefined,
        'aria-disabled': isDisabled.value ? 'true' : undefined,
        onMouseenter: () => {
          if (isDisabled.value) {
            return;
          }
          isHovered.value = true;
        },
        onMouseleave: () => {
          isHovered.value = false;
        },
        onKeydown: (event: KeyboardEvent) => {
          isKeyboardModality.value = true;
          if (event.key === 'Tab' && isFocused.value) {
            isFocusVisible.value = true;
          }
        },
        onMousedown: () => {
          isKeyboardModality.value = false;
        },
        onPointerdown: () => {
          isKeyboardModality.value = false;
        },
        onClick: (event: MouseEvent) => {
          if (isDisabled.value) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          emit('press', event);
        },
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
            return;
          }

          emit('drop', event);
          event.preventDefault();
          isOver.value = false;
          emitFiles(event.dataTransfer?.files ?? null);
          let text = event.dataTransfer?.getData('text/plain') ?? '';
          if (text) {
            emit('textDrop', text);
          }
        },
        onFocus: (event: FocusEvent) => {
          isFocused.value = true;
          let target = event.currentTarget as HTMLElement | null;
          isFocusVisible.value = Boolean(target?.matches(':focus-visible')) || isKeyboardModality.value;
          emit('focus', event);
        },
        onBlur: (event: FocusEvent) => {
          isFocused.value = false;
          isFocusVisible.value = false;
          emit('blur', event);
        }
      }, [
        ...(slots.default ? slots.default(slotState) : [
          h('span', {class: 'react-aria-Text'}, props.label)
        ])
      ]);
    };
  }
});
