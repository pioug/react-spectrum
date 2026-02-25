import {defineComponent, ref} from 'vue';
import {useId} from '@vue-aria/utils';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'useId'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

let count = 0;

const AsyncComponent = defineComponent({
  async setup() {
    if (count < 5) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log('resolving', count, Date.now());
          count += 1;
          resolve();
        }, 100);
      });
    }

    return {};
  },
  template: '<div />'
});

const Box = defineComponent({
  setup() {
    let id = useId();

    return {
      id
    };
  },
  template: `
    <div :data-id="id">
      {{id}}
    </div>
  `
});

export const GCuseId: Story = {
  render: () => ({
    components: {
      AsyncComponent,
      Box
    },
    setup() {
      let show = ref(true);
      let toggle = () => {
        count = 0;
        show.value = !show.value;
      };
      let logIds = () => {
        // eslint-disable-next-line no-console
        console.log('Vue useId is backed by useSSRSafeId; no ids updater map is exposed.');
      };

      return {
        logIds,
        show,
        toggle
      };
    },
    template: `
      <div>
        <Suspense v-if="show">
          <template #default>
            <Box />
            <AsyncComponent />
          </template>
        </Suspense>
        <button type="button" @click="toggle">toggle</button>
        <button type="button" @click="logIds">See ids held</button>
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'This story demonstrates the React useId GC scenario shape (toggle + suspense/async remount path) adapted to Vue useId.'
    }
  }
};
