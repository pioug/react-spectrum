import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueDateRangePicker, VueDialog, VueTextField} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Modal',
  component: VueDialog
} satisfies Meta<typeof VueDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ModalExample: Story = {
  render: () => ({
    components: {
      VueButton,
      VueDialog
    },
    setup() {
      let open = ref(false);
      let close = () => {
        open.value = false;
      };
      return {
        close,
        open
      };
    },
    template: `
      <button class="react-aria-Button" type="button" @click="open = true">Open modal</button>
      <VueDialog :open="open" title="Sign up" @close="close">
        <form style="display: flex; flex-direction: column; gap: 8px;">
          <label>
            First Name: <input placeholder="John">
          </label>
          <label>
            Last Name: <input placeholder="Smith">
          </label>
          <VueButton @click="close">Submit</VueButton>
        </form>
      </VueDialog>
    `
  })
};

export const InertTestStory: Story = {
  render: () => ({
    components: {
      VueButton,
      VueDialog,
      VueTextField
    },
    setup() {
      let open = ref(false);
      let close = () => {
        open.value = false;
      };
      return {
        close,
        open
      };
    },
    template: `
      <button class="react-aria-Button" type="button" @click="open = true">Open modal</button>
      <VueDialog :open="open" title="Inert test" @close="close">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <VueTextField label="First name" />
          <VueButton>Combobox Trigger</VueButton>
        </div>
      </VueDialog>
    `
  }),
  parameters: {
    description: {
      data: 'You should be able to click "Combobox Trigger" and then click on the textfield, closing the subdialog. A second click should move focus into the textfield'
    }
  }
};

export const DateRangePickerInsideModalStory: Story = {
  render: () => ({
    components: {
      VueButton,
      VueDateRangePicker,
      VueDialog
    },
    setup() {
      let open = ref(false);
      let range = ref({start: '', end: ''});
      let close = () => {
        open.value = false;
      };
      return {
        close,
        open,
        range
      };
    },
    template: `
      <button class="react-aria-Button" type="button" @click="open = true">Open modal</button>
      <VueDialog :open="open" title="Date range picker" @close="close">
        <VueDateRangePicker v-model="range" label="Date range" />
      </VueDialog>
    `
  }),
  parameters: {
    description: {
      data: 'Open the Modal, then open the DateRangePicker and select a start date. Clicking outside the Modal should close the picker but keep the Modal open.'
    }
  }
};
