import {computed, reactive, ref, watch} from 'vue';
import {useToast, useToastRegion} from '@vue-aria/toast';
import {useToastState} from '@vue-stately/toast';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

type ToastContent = {
  description: string,
  title: string
};

const meta = {
  title: 'useToast',
  args: {
    maxVisibleToasts: 1,
    timeout: null
  },
  argTypes: {
    timeout: {
      control: 'radio',
      options: [null, 5000]
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

let count = 0;

export const Default: Story = {
  render: (args) => ({
    setup() {
      let state = useToastState<ToastContent>({maxVisibleToasts: args.maxVisibleToasts ?? 1});
      let activeToast = reactive({
        content: {
          description: '',
          title: ''
        },
        key: 'empty',
        timeout: undefined as number | undefined,
        timer: null as {pause: () => void, reset: (timeout: number) => void} | null
      });

      watch(
        state.visibleToasts,
        (visibleToasts) => {
          let nextToast = visibleToasts[0];
          if (!nextToast) {
            activeToast.key = 'empty';
            activeToast.content = {
              description: '',
              title: ''
            };
            activeToast.timeout = undefined;
            activeToast.timer = null;
            return;
          }

          activeToast.key = nextToast.key;
          activeToast.content = nextToast.content;
          activeToast.timeout = nextToast.timeout;
          activeToast.timer = nextToast.timer ?? null;
        },
        {immediate: true}
      );

      let toastAria = useToast({
        toast: activeToast
      }, state);
      let regionAria = useToastRegion({
        ariaLabel: 'Notifications'
      }, state);

      let hasToast = computed(() => state.visibleToasts.value.length > 0);
      let addToast = () => {
        count += 1;
        state.add(
          {
            description: 'Toast body',
            title: `Mmmmm toast ${count}`
          },
          {
            timeout: args.timeout ?? undefined
          }
        );
      };

      return {
        addToast,
        hasToast,
        regionProps: regionAria.regionProps,
        toastAria,
        toastContent: computed(() => activeToast.content)
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 420px;">
        <button type="button" @click="addToast">Add toast</button>
        <section
          v-if="hasToast"
          v-bind="regionProps"
          style="border: 1px solid #999; padding: 8px;">
          <article
            v-bind="toastAria.toastProps"
            style="display: grid; gap: 6px; border: 1px solid #d0d0d0; padding: 8px;">
            <div v-bind="toastAria.contentProps">
              <strong v-bind="toastAria.titleProps">{{toastContent.title}}</strong>
              <p v-bind="toastAria.descriptionProps" style="margin: 4px 0 0;">{{toastContent.description}}</p>
            </div>
            <button
              type="button"
              :aria-label="toastAria.closeButtonProps['aria-label']"
              @click="toastAria.closeButtonProps.onPress()">
              Close
            </button>
          </article>
        </section>
      </div>
    `
  }),
  name: 'Default'
};
