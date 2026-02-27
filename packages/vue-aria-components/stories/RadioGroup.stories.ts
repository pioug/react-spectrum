import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {ref} from 'vue';
import {VueForm, VueRadio, VueRadioGroup} from 'vue-aria-components';
import '../../react-aria-components/example/index.css';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/RadioGroup',
  component: VueRadioGroup
} satisfies Meta<typeof VueRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RadioGroupExample: Story = {
  render: (args: {onFocus?: (event: FocusEvent) => void, onBlur?: (event: FocusEvent) => void}) => ({
    components: {
      VueRadio,
      VueRadioGroup
    },
    setup() {
      let selected = ref('');

      return {
        args,
        selected,
        onGroupBlur(event: FocusEvent) {
          args.onBlur?.(event);
        },
        onGroupFocus(event: FocusEvent) {
          args.onFocus?.(event);
        },
        onRadioBlur: action('radio blur'),
        onRadioFocus: action('radio focus')
      };
    },
    template: `
      <VueRadioGroup
        v-model="selected"
        data-testid="radio-group-example"
        class="radiogroup"
        label="Favorite pet"
        @focus="onGroupFocus"
        @blur="onGroupBlur">
        <VueRadio value="dogs" data-testid="radio-dog" class="radio" @focus="onRadioFocus" @blur="onRadioBlur">Dog</VueRadio>
        <VueRadio value="cats" class="radio" @focus="onRadioFocus" @blur="onRadioBlur">Cat</VueRadio>
        <VueRadio value="dragon" class="radio" @focus="onRadioFocus" @blur="onRadioBlur">Dragon</VueRadio>
      </VueRadioGroup>
    `
  }),
  args: {
    onFocus: action('onFocus'),
    onBlur: action('onBlur')
  }
};

export const RadioGroupControlledExample: StoryFn<typeof VueRadioGroup> = () => ({
  components: {
    VueRadio,
    VueRadioGroup
  },
  setup() {
    let selected = ref('');

    return {
      selected
    };
  },
  template: `
    <VueRadioGroup
      v-model="selected"
      data-testid="radio-group-example"
      class="radiogroup"
      label="Favorite pet (controlled)">
      <VueRadio value="dogs" data-testid="radio-dog" class="radio">Dog</VueRadio>
      <VueRadio value="cats" class="radio">Cat</VueRadio>
      <VueRadio value="dragon" class="radio">Dragon</VueRadio>
    </VueRadioGroup>
  `
});

export const RadioGroupInDialogExample: StoryFn<typeof VueRadioGroup> = () => ({
  components: {
    VueRadio,
    VueRadioGroup
  },
  setup() {
    let open = ref(false);

    return {
      open
    };
  },
  template: `
    <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" @click="open = true">Open dialog</button>
    <div v-if="open" style="position: fixed; z-index: 100; inset: 0; background: rgba(0, 0, 0, 0.5);" />
    <div v-if="open" style="position: fixed; z-index: 101; inset: 0; display: flex; align-items: center; justify-content: center;">
      <section class="react-aria-Dialog" role="dialog" style="background: Canvas; color: CanvasText; border: 1px solid gray; padding: 30px;">
        <VueRadioGroup data-testid="radio-group-example" class="radiogroup" label="Favorite pet">
          <VueRadio value="dogs" data-testid="radio-dog" class="radio">Dog</VueRadio>
          <VueRadio value="cats" class="radio">Cat</VueRadio>
          <VueRadio value="dragon" class="radio">Dragon</VueRadio>
        </VueRadioGroup>
        <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" style="margin-top: 10px;" @click="open = false">Close</button>
      </section>
    </div>
  `
});

export const RadioGroupSubmitExample: StoryFn<typeof VueRadioGroup> = () => ({
  components: {
    VueForm,
    VueRadio,
    VueRadioGroup
  },
  setup() {
    let selected = ref('');
    let isInvalid = ref(false);

    let onSubmit = (event: Event) => {
      event.preventDefault();
      isInvalid.value = selected.value === '';
    };

    let onReset = (event: Event) => {
      event.preventDefault();
      selected.value = '';
      isInvalid.value = false;
    };

    let onSelectionChange = () => {
      if (selected.value !== '') {
        isInvalid.value = false;
      }
    };

    return {
      isInvalid,
      onReset,
      onSelectionChange,
      onSubmit,
      selected
    };
  },
  template: `
    <VueForm @submit="onSubmit" @reset="onReset">
      <VueRadioGroup
        v-model="selected"
        data-testid="radio-group-example"
        class="radiogroup"
        label="Favorite pet"
        required
        :invalid="isInvalid"
        @update:modelValue="onSelectionChange">
        <VueRadio value="dogs" data-testid="radio-dog" class="radio">Dog</VueRadio>
        <VueRadio value="cats" class="radio">Cat</VueRadio>
        <VueRadio value="dragon" class="radio">Dragon</VueRadio>
      </VueRadioGroup>
      <button class="react-aria-Button" data-rac="" type="submit" tabindex="0" data-react-aria-pressable="true">Submit</button>
      <button class="react-aria-Button" data-rac="" type="reset" tabindex="0" data-react-aria-pressable="true">Reset</button>
    </VueForm>
  `
});
