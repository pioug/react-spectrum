import {action} from '@storybook/addon-actions';
import type {Meta, StoryFn, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueDialog, VueForm, VueRadio, VueRadioGroup} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/RadioGroup',
  component: VueRadioGroup
} satisfies Meta<typeof VueRadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RadioGroupExample: Story = {
  render: (props: {onFocus?: (event: FocusEvent) => void, onBlur?: (event: FocusEvent) => void}) => ({
    components: {
      VueRadio,
      VueRadioGroup
    },
    setup() {
      let value = ref('');
      return {
        props,
        value,
        onRadioBlur: action('radio blur'),
        onRadioFocus: action('radio focus')
      };
    },
    template: `
      <VueRadioGroup
        v-model="value"
        data-testid="radio-group-example"
        label="Favorite pet">
        <VueRadio value="dogs" data-testid="radio-dog" @focus="onRadioFocus" @blur="onRadioBlur">Dog</VueRadio>
        <VueRadio value="cats" @focus="onRadioFocus" @blur="onRadioBlur">Cat</VueRadio>
        <VueRadio value="dragon" @focus="onRadioFocus" @blur="onRadioBlur">Dragon</VueRadio>
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
      label="Favorite pet (controlled)">
      <VueRadio value="dogs" data-testid="radio-dog">Dog</VueRadio>
      <VueRadio value="cats">Cat</VueRadio>
      <VueRadio value="dragon">Dragon</VueRadio>
    </VueRadioGroup>
  `
});

export const RadioGroupInDialogExample: StoryFn<typeof VueRadioGroup> = () => ({
  components: {
    VueButton,
    VueDialog,
    VueForm,
    VueRadio,
    VueRadioGroup
  },
  setup() {
    let open = ref(false);
    let groupA = ref('');
    let groupB = ref('');
    let groupC = ref('dragon');
    let close = () => {
      open.value = false;
    };

    return {
      close,
      groupA,
      groupB,
      groupC,
      open
    };
  },
  template: `
    <div>
      <VueButton @click="open = true">Open dialog</VueButton>
      <VueDialog :open="open" title="Radio groups" @close="close">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; flex-direction: row; gap: 20px;">
            <VueRadioGroup v-model="groupA" data-testid="radio-group-example" label="Favorite pet">
              <VueRadio value="dogs" data-testid="radio-dog">Dog</VueRadio>
              <VueRadio value="cats">Cat</VueRadio>
              <VueRadio value="dragon">Dragon</VueRadio>
            </VueRadioGroup>
            <VueForm>
              <VueRadioGroup v-model="groupB" data-testid="radio-group-example-2" label="Second Favorite pet">
                <VueRadio value="dogs" data-testid="radio-dog">Dog</VueRadio>
                <VueButton>About dogs</VueButton>
                <VueRadio value="cats">Cat</VueRadio>
                <VueButton>About cats</VueButton>
                <VueRadio value="dragon">Dragon</VueRadio>
                <VueButton>About dragons</VueButton>
              </VueRadioGroup>
            </VueForm>
            <VueForm>
              <VueRadioGroup v-model="groupC" data-testid="radio-group-example-3" label="Third Favorite pet">
                <VueRadio value="dogs" data-testid="radio-dog">Dog</VueRadio>
                <VueButton>About dogs</VueButton>
                <VueRadio value="cats">Cat</VueRadio>
                <VueButton>About cats</VueButton>
                <VueRadio value="dragon">Dragon</VueRadio>
                <VueButton>About dragons</VueButton>
              </VueRadioGroup>
            </VueForm>
          </div>
          <div>
            <VueButton @click="close" style="margin-top: 10px;">Close</VueButton>
          </div>
        </div>
      </VueDialog>
    </div>
  `
});

export const RadioGroupSubmitExample: StoryFn<typeof VueRadioGroup> = () => ({
  components: {
    VueButton,
    VueForm,
    VueRadio,
    VueRadioGroup
  },
  setup() {
    let value = ref('');
    return {
      value
    };
  },
  template: `
    <VueForm>
      <VueRadioGroup
        v-model="value"
        data-testid="radio-group-example"
        label="Favorite pet">
        <VueRadio value="dogs" data-testid="radio-dog">Dog</VueRadio>
        <VueRadio value="cats">Cat</VueRadio>
        <VueRadio value="dragon">Dragon</VueRadio>
      </VueRadioGroup>
      <VueButton type="submit">Submit</VueButton>
      <VueButton type="reset">Reset</VueButton>
    </VueForm>
  `
});
