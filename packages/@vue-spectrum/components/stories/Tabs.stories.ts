import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueTabs} from '@vue-spectrum/tabs';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Tabs',
  component: VueTabs
} satisfies Meta<typeof VueTabs>;

export default meta;

export type TabsStory = StoryFn<typeof VueTabs>;

export const TabsExample: TabsStory = () => ({
  components: {
    VueTabs
  },
  setup() {
    let selected = ref('/FoR');
    let items = [
      {
        key: '/FoR',
        label: 'Founding of Rome',
        content: 'Arma virumque cano, Troiae qui primus ab oris.'
      },
      {
        key: '/MaR',
        label: 'Monarchy and Republic',
        content: 'Senatus Populusque Romanus.'
      },
      {
        key: '/Emp',
        label: 'Empire',
        content: 'Alea jacta est.'
      }
    ];

    return {
      items,
      selected
    };
  },
  template: `
    <VueTabs
      v-model="selected"
      aria-label="History of Ancient Rome"
      :items="items" />
  `
});

export const TabsRenderProps: TabsStory = () => ({
  components: {
    VueTabs
  },
  setup() {
    let orientation = ref<'horizontal' | 'vertical'>('vertical');
    let selected = ref('FoR');
    let items = [
      {
        key: 'FoR',
        label: 'Founding of Rome',
        content: 'Arma virumque cano, Troiae qui primus ab oris.'
      },
      {
        key: 'MaR',
        label: 'Monarchy and Republic',
        content: 'Senatus Populusque Romanus.'
      },
      {
        key: 'Emp',
        label: 'Empire',
        content: 'Alea jacta est.'
      }
    ];

    let toggleOrientation = () => {
      orientation.value = orientation.value === 'vertical' ? 'horizontal' : 'vertical';
    };

    return {
      items,
      orientation,
      selected,
      toggleOrientation
    };
  },
  template: `
    <div style="display: flex; flex-direction: row; gap: 8px;">
      <button type="button" @click="toggleOrientation">Change Orientation</button>
      <VueTabs
        v-model="selected"
        aria-label="History of Ancient Rome"
        :items="items"
        :orientation="orientation" />
    </div>
  `
});

export const NestedTabs: TabsStory = () => ({
  components: {
    VueTabs
  },
  setup() {
    let outer = ref('foo');
    let inner = ref('one');

    let outerItems = [
      {key: 'foo', label: 'Foo'},
      {key: 'bar', label: 'Bar'}
    ];

    let innerItems = [
      {key: 'one', label: 'One', content: 'One'},
      {key: 'two', label: 'Two', content: 'Two'}
    ];

    return {
      inner,
      innerItems,
      outer,
      outerItems
    };
  },
  template: `
    <VueTabs v-model="outer" :items="outerItems">
      <template #default="{item}">
        <VueTabs v-if="item?.key === 'foo'" v-model="inner" :items="innerItems" />
        <p v-else>Bar</p>
      </template>
    </VueTabs>
  `
});
