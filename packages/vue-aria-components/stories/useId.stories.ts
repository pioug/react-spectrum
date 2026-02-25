import {ref} from 'vue';
import {useId} from '@vue-aria/utils';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useId'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const GCuseId: Story = {
  render: () => ({
    setup() {
      let show = ref(true);
      let ids = ref<string[]>([]);
      let currentId = ref(useId());
      ids.value.push(currentId.value);

      let toggle = () => {
        show.value = !show.value;
        if (show.value) {
          currentId.value = useId();
          ids.value.push(currentId.value);
        }
      };

      let logIds = () => {
        // eslint-disable-next-line no-console
        console.log('useId values seen', ids.value);
      };

      return {
        currentId,
        logIds,
        show,
        toggle
      };
    },
    template: `
      <div>
        <div v-if="show" :data-id="currentId">{{currentId}}</div>
        <button type="button" @click="toggle">toggle</button>
        <button type="button" @click="logIds">See ids held</button>
      </div>
    `
  }),
  name: 'G Cuse Id',
  parameters: {
    description: {
      data: 'Demonstrates useId value changes and how ids are retained when toggling rendered content.'
    }
  }
};
