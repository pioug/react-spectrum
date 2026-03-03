import {computed, ref} from 'vue';
import {useSelect} from '@vue-aria/select';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const lotsOfItems = Array.from({length: 50}, (_, index) => ({
  key: `item-${index}`,
  textValue: `Item ${index}`
}));

const meta = {
  title: 'useSelect'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollTesting: Story = {
  render: () => ({
    setup() {
      let selectedKey = ref<string | null>(null);
      let select = useSelect({
        label: 'Example',
        options: lotsOfItems,
        selectedKey
      });
      let triggerButtonProps = computed(() => {
        let {role, ...props} = select.triggerProps.value;
        return props;
      });
      let onHiddenSelectChange = (event: Event) => {
        let target = event.currentTarget as HTMLSelectElement | null;
        if (!target) {
          return;
        }

        if (target.value.length === 0) {
          selectedKey.value = null;
          select.close();
          return;
        }

        if (target.value != null) {
          select.selectKey(target.value);
        }
      };

      return {
        ...select,
        triggerButtonProps,
        onHiddenSelectChange
      };
    },
    template: `
      <div style="position: relative; display: inline-block;">
        <div v-bind="labelProps">Example</div>
        <div style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: fixed; width: 1px; white-space: nowrap; top: 0px; left: 0px;">
          <label>
            <select
              :disabled="hiddenSelectProps.isDisabled"
              :form="hiddenSelectProps.form"
              :name="hiddenSelectProps.name"
              :value="hiddenSelectProps.selectedKey ?? ''"
              @change="onHiddenSelectChange">
              <option value=""></option>
              <option
                v-for="option in hiddenSelectProps.options"
                :key="option.key"
                :value="option.key"
                :disabled="option.disabled">
                {{option.textValue}}
              </option>
            </select>
          </label>
        </div>
        <button
          v-bind="triggerButtonProps"
          type="button"
          style="height: 30px; font-size: 14px;">
          <span v-bind="valueProps">
            {{selectedItem ? selectedItem.textValue : 'Select an option'}}
          </span>
          <span aria-hidden="true" style="padding-left: 5px;">▼</span>
        </button>
        <div
          v-if="isOpen"
          style="position: absolute; width: 100%; border: 1px solid gray; background: lightgray; margin-top: 4px;">
          <ul
            v-bind="menuProps"
            style="margin: 0; padding: 0; list-style: none; max-height: 150px; overflow: auto;">
            <li
              v-for="option in hiddenSelectProps.options"
              :key="option.key"
              role="option"
              :aria-selected="selectedKey === option.key"
              :style="{background: selectedKey === option.key ? 'blueviolet' : 'transparent', color: selectedKey === option.key ? 'white' : 'black', padding: '2px 5px', outline: 'none', cursor: 'pointer'}"
              @click="selectKey(option.key)">
              {{option.textValue}}
            </li>
          </ul>
        </div>
      </div>
    `
  }),
  name: 'Scroll Testing'
};
