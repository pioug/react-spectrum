import {computed, defineComponent, h, type PropType} from 'vue';
import {getSpectrumContext} from '../context';

type ButtonVariant = 'primary' | 'secondary';
type ButtonType = 'button' | 'submit' | 'reset';

export const VueButton = defineComponent({
  name: 'VueButton',
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary'
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    click: (event: MouseEvent) => event instanceof MouseEvent
  },
  setup(props, {slots, emit, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-button',
      `vs-button--${props.variant}`,
      context.value.scale === 'large' ? 'vs-button--large' : 'vs-button--medium',
      props.disabled ? 'is-disabled' : null
    ]));

    let onClick = (event: MouseEvent) => {
      if (props.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      emit('click', event);
    };

    return function render() {
      return h('button', {
        ...attrs,
        class: [classes.value, attrs.class],
        type: props.type,
        disabled: props.disabled,
        'aria-disabled': props.disabled ? 'true' : undefined,
        onClick
      }, slots.default ? slots.default() : 'Button');
    };
  }
});
