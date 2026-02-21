import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Tabs'
} satisfies Meta;

export default meta;

export type TabsStory = StoryFn;

export const TabsExample: TabsStory = () => ({
  setup() {
    let selected = ref('/FoR');
    return {
      selected
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 520px;">
      <div style="display: flex; gap: 8px;">
        <button type="button" @click="selected = '/FoR'">Founding of Rome</button>
        <button type="button" @click="selected = '/MaR'">Monarchy and Republic</button>
        <button type="button" @click="selected = '/Emp'">Empire</button>
      </div>
      <p v-if="selected === '/FoR'">Arma virumque cano, Troiae qui primus ab oris.</p>
      <p v-else-if="selected === '/MaR'">Senatus Populusque Romanus.</p>
      <p v-else>Alea jacta est.</p>
    </div>
  `
});

export const TabsRenderProps: TabsStory = () => ({
  setup() {
    let orientation = ref<'horizontal' | 'vertical'>('vertical');
    let selected = ref('FoR');

    let toggleOrientation = () => {
      orientation.value = orientation.value === 'vertical' ? 'horizontal' : 'vertical';
    };

    return {
      orientation,
      selected,
      toggleOrientation
    };
  },
  template: `
    <div style="display: flex; flex-direction: row; gap: 8px;">
      <button type="button" @click="toggleOrientation">Change Orientation</button>
      <div :style="{display: 'flex', gap: '8px', flexDirection: orientation === 'vertical' ? 'row' : 'column'}">
        <div :style="{display: 'flex', gap: '8px', flexDirection: orientation === 'vertical' ? 'column' : 'row'}">
          <button type="button" @click="selected = 'FoR'">Founding of Rome</button>
          <button type="button" @click="selected = 'MaR'">Monarchy and Republic</button>
          <button type="button" @click="selected = 'Emp'">Empire</button>
        </div>
        <p v-if="selected === 'FoR'">Arma virumque cano, Troiae qui primus ab oris.</p>
        <p v-else-if="selected === 'MaR'">Senatus Populusque Romanus.</p>
        <p v-else>Alea jacta est.</p>
      </div>
    </div>
  `
});

export const NestedTabs: TabsStory = () => ({
  setup() {
    let outer = ref('foo');
    let inner = ref('one');
    return {
      inner,
      outer
    };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; gap: 8px;">
        <button type="button" @click="outer = 'foo'">Foo</button>
        <button type="button" @click="outer = 'bar'">Bar</button>
      </div>
      <template v-if="outer === 'foo'">
        <div style="display: flex; gap: 8px;">
          <button type="button" @click="inner = 'one'">One</button>
          <button type="button" @click="inner = 'two'">Two</button>
        </div>
        <p>{{ inner === 'one' ? 'One' : 'Two' }}</p>
      </template>
      <p v-else>Bar</p>
    </div>
  `
});
