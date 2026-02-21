import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Button} from '@vue-spectrum/button';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Button',
  component: Button
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ButtonExample: Story = {
  render: () => ({
    components: {
      Button
    },
    template: `
      <Button data-testid="button-example">
        Press me
      </Button>
    `
  })
};

export const PendingButton: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let isPending = ref(false);
      let onPress = () => {
        isPending.value = true;
        setTimeout(() => {
          isPending.value = false;
        }, 5000);
      };

      return {
        isPending,
        onPress
      };
    },
    template: `
      <Button :is-disabled="isPending" @click="onPress">
        {{ isPending ? 'Loading…' : 'Press me' }}
      </Button>
    `
  })
};

export const PendingButtonTooltip: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let isPending = ref(false);
      let onPress = () => {
        isPending.value = true;
        setTimeout(() => {
          isPending.value = false;
        }, 5000);
      };

      return {
        isPending,
        onPress
      };
    },
    template: `
      <div>
        <Button :is-disabled="isPending" @click="onPress">
          {{ isPending ? 'Loading…' : 'Press me, then hover again to see tooltip' }}
        </Button>
      </div>
    `
  })
};

export const RippleButtonExample: Story = {
  render: () => ({
    components: {
      Button
    },
    template: `
      <Button data-testid="button-example">
        Press me
      </Button>
    `
  })
};

export const ButtonPerformance: Story = {
  render: () => ({
    components: {
      Button
    },
    setup() {
      let count = ref(0);
      let showButtons = ref(false);

      let handlePress = () => {
        if (!showButtons.value) {
          showButtons.value = true;
        } else {
          count.value += 1;
        }
      };

      return {
        count,
        showButtons,
        handlePress
      };
    },
    template: `
      <div>
        <Button style="margin-top: 24px; margin-bottom: 16px;" @click="handlePress">
          {{ showButtons ? 'Re-render' : 'Render' }}
        </Button>
        <div v-if="showButtons" style="display: flex; gap: 2px; flex-wrap: wrap;" :key="count">
          <Button v-for="item in 2000" :key="item">Press me</Button>
        </div>
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'When usePress is used on the page, there should be a <style> tag placed in the head of the document that applies touch-action: pan-x pan-y pinch-zoom to the [data-react-aria-pressable] elements.'
    }
  }
};

export const ButtonRender: Story = {
  render: () => ({
    components: {
      Button
    },
    template: `
      <Button style="background: red;">
        Testing
      </Button>
    `
  })
};
