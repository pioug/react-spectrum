import type {Meta, StoryFn} from '@storybook/vue3-vite';
import {VueComboBox} from '@vue-spectrum/components';
import {computed, ref} from 'vue';
import '../../../react-aria-components/stories/combobox-reproductions.css';
import '../../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/ComboBoxReproductions',
  component: VueComboBox
} satisfies Meta<typeof VueComboBox>;

export default meta;

export type ComboBoxReproductionStory = StoryFn<typeof VueComboBox>;

const reproductionOptions = [
  'Aardvark',
  'Cat',
  'Dooooooooooooooooooooooooooooooooog',
  'Kangaroo',
  'Panda',
  'Snake'
];

let storyInstanceCount = 0;

export const ComboBoxReproductionExample: ComboBoxReproductionStory = () => ({
  setup() {
    let inputValue = ref('');
    let isOpen = ref(false);
    let activeIndex = ref(-1);
    let storyId = `vs-combobox-repro-${++storyInstanceCount}`;
    let listBoxId = `${storyId}-listbox`;

    let optionDomId = (optionText: string) => `${storyId}-option-${optionText.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    let activeDescendant = computed(() => activeIndex.value >= 0
      ? optionDomId(reproductionOptions[activeIndex.value])
      : undefined);

    let openMenu = (focus: 'first' | 'last' = 'first') => {
      isOpen.value = true;
      activeIndex.value = focus === 'last' ? reproductionOptions.length - 1 : 0;
    };

    let closeMenu = () => {
      isOpen.value = false;
      activeIndex.value = -1;
    };

    let selectOption = (index: number) => {
      let option = reproductionOptions[index];
      if (!option) {
        return;
      }

      inputValue.value = option;
      closeMenu();
    };

    let moveActiveOption = (delta: -1 | 1) => {
      if (!isOpen.value) {
        openMenu(delta > 0 ? 'first' : 'last');
        return;
      }

      let nextIndex = activeIndex.value + delta;
      if (activeIndex.value < 0) {
        nextIndex = delta > 0 ? 0 : reproductionOptions.length - 1;
      }

      activeIndex.value = Math.max(0, Math.min(reproductionOptions.length - 1, nextIndex));
    };

    let onInput = (event: Event) => {
      let target = event.currentTarget as HTMLInputElement | null;
      inputValue.value = target?.value ?? '';
      openMenu('first');
    };

    let onTriggerPress = () => {
      if (isOpen.value) {
        closeMenu();
      } else {
        openMenu('first');
      }
    };

    let onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActiveOption(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActiveOption(-1);
        return;
      }

      if (event.key === 'Enter' && isOpen.value && activeIndex.value >= 0) {
        event.preventDefault();
        selectOption(activeIndex.value);
        return;
      }

      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    let onOptionMouseDown = (event: MouseEvent, index: number) => {
      event.preventDefault();
      selectOption(index);
    };

    return {
      activeDescendant,
      activeIndex,
      inputValue,
      isOpen,
      listBoxId,
      onInput,
      onKeyDown,
      onOptionMouseDown,
      onTriggerPress,
      optionDomId,
      options: reproductionOptions
    };
  },
  template: `
    <div class="react-aria-ComboBox" data-rac="" style="color: rgb(57, 57, 57);">
      <label class="react-aria-Label">Favorite Animal</label>
      <div>
        <input
          class="react-aria-Input"
          data-rac=""
          type="text"
          :value="inputValue"
          role="combobox"
          :aria-controls="listBoxId"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-activedescendant="activeDescendant"
          aria-haspopup="listbox"
          style="margin: 0; font-size: 1.072rem; background: rgb(255, 255, 255); color: rgb(57, 57, 57); border: 1px solid rgb(143, 143, 143); border-radius: 6px; padding: 0.286rem 2rem 0.286rem 0.571rem; vertical-align: middle;"
          @input="onInput"
          @keydown="onKeyDown">
        <button
          class="react-aria-Button"
          data-rac=""
          type="button"
          aria-haspopup="listbox"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="listBoxId"
          style="background: rgb(111, 70, 237); color: rgb(255, 255, 255); forced-color-adjust: none; border-radius: 4px; border: none; margin-left: -1.714rem; width: 1.429rem; height: 1.429rem; padding: 0; font-size: 0.857rem; cursor: default;"
          @click="onTriggerPress">▼</button>
      </div>
      <div
        v-if="isOpen"
        :id="listBoxId"
        class="react-aria-ListBox"
        role="listbox"
        style="max-height: 240px; overflow: auto; width: 220px; white-space: nowrap;">
        <div
          v-for="(option, optionIndex) in options"
          :id="optionDomId(option)"
          :key="option"
          class="react-aria-ListBoxItem"
          role="option"
          aria-selected="false"
          :data-focused="optionIndex === activeIndex ? 'true' : undefined"
          @mouseenter="activeIndex = optionIndex"
          @mousedown="onOptionMouseDown($event, optionIndex)">
          {{ option }}
        </div>
      </div>
    </div>
  `
});
