import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {computed, ref} from 'vue';
import {useToolbar as useAriaToolbar} from '@vue-aria/toolbar';
import {VueCheckbox, VueListBox} from 'vue-aria-components';
import '../../react-aria-components/stories/styles.css';

const meta = {
  title: 'React Aria Components/Toolbar'
} satisfies Meta;

export default meta;

export type ToolbarStory = StoryObj<typeof meta>;

export const ToolbarExample: ToolbarStory = {
  args: {
    orientation: 'horizontal'
  },
  render: (args: {orientation?: 'horizontal' | 'vertical'}) => ({
    components: {
      VueCheckbox
    },
    setup() {
      let isNightMode = ref(false);
      let pressed = ref({
        bold: false,
        italic: false,
        underline: false
      });
      let toolbarRef = ref<HTMLElement | null>(null);
      let toolbar = useAriaToolbar({
        orientation: computed(() => args.orientation ?? 'horizontal')
      }, toolbarRef);
      let toolbarStyle = computed(() => ({
        display: 'flex',
        flexDirection: (args.orientation ?? 'horizontal') === 'vertical' ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: '20px'
      }));

      let toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
        pressed.value[style] = !pressed.value[style];
      };

      return {
        isNightMode,
        pressed,
        toolbar,
        toolbarRef,
        toolbarStyle,
        toggleStyle
      };
    },
    template: `
      <div>
        <label for="before">Input Before Toolbar</label>
        <input id="before" type="text">
        <div ref="toolbarRef" v-bind="toolbar.toolbarProps.value" class="react-aria-Toolbar" data-rac="" :data-orientation="toolbar.toolbarProps.value['aria-orientation']" :style="toolbarStyle">
          <div role="group" aria-label="Text style">
            <button class="v7C2Sq_toggleButtonExample" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" :aria-pressed="String(pressed.bold)" @click="toggleStyle('bold')"><strong>B</strong></button>
            <button class="v7C2Sq_toggleButtonExample" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" :aria-pressed="String(pressed.underline)" @click="toggleStyle('underline')"><div style="text-decoration: underline;">U</div></button>
            <button class="v7C2Sq_toggleButtonExample" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" :aria-pressed="String(pressed.italic)" @click="toggleStyle('italic')"><i>I</i></button>
          </div>
          <VueCheckbox v-model="isNightMode">
            <div class="checkbox">
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <polyline points="1 9 7 14 15 4"></polyline>
              </svg>
            </div>
            Night Mode
          </VueCheckbox>
          <a class="react-aria-Link" data-rac="" href="https://google.com" tabindex="0" data-react-aria-pressable="true">Help</a>
        </div>
        <label for="after">Input After Toolbar</label>
        <input id="after" type="text">
      </div>
    `
  })
};

export const SelectSupport: ToolbarStory = {
  args: {
    orientation: 'horizontal'
  },
  render: (args: {orientation?: 'horizontal' | 'vertical'}) => ({
    components: {
      VueListBox
    },
    setup() {
      let selectedAnimal = ref('');
      let isOpen = ref(false);
      let pressed = ref({
        bold: false,
        italic: false,
        underline: false
      });
      let toolbarRef = ref<HTMLElement | null>(null);
      let toolbar = useAriaToolbar({
        ariaLabel: 'Text formatting',
        orientation: computed(() => args.orientation ?? 'horizontal')
      }, toolbarRef);
      let toolbarStyle = computed(() => ({
        display: 'flex',
        flexDirection: (args.orientation ?? 'horizontal') === 'vertical' ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: '20px'
      }));
      let animals = ['Aardvark', 'Cat', 'Dog', 'Kangaroo', 'Panda', 'Snake'];
      let selectText = computed(() => selectedAnimal.value || 'Select an item');
      let selectPlaceholder = computed(() => (selectedAnimal.value ? null : 'true'));

      let toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
        pressed.value[style] = !pressed.value[style];
      };

      let toggleOpen = () => {
        isOpen.value = !isOpen.value;
      };

      let selectAnimal = (animal: string) => {
        selectedAnimal.value = animal;
        isOpen.value = false;
      };

      return {
        animals,
        isOpen,
        pressed,
        selectedAnimal,
        selectAnimal,
        selectPlaceholder,
        selectText,
        toolbar,
        toolbarRef,
        toolbarStyle,
        toggleOpen,
        toggleStyle
      };
    },
    template: `
      <div ref="toolbarRef" v-bind="toolbar.toolbarProps.value" class="react-aria-Toolbar" data-rac="" :data-orientation="toolbar.toolbarProps.value['aria-orientation']" :style="toolbarStyle">
        <div aria-label="Style" class="react-aria-Group" data-rac="" role="group">
          <button class="react-aria-ToggleButton" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-label="Bold" :aria-pressed="String(pressed.bold)" @click="toggleStyle('bold')"><b>B</b></button>
          <button class="react-aria-ToggleButton" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-label="Italic" :aria-pressed="String(pressed.italic)" @click="toggleStyle('italic')"><i>I</i></button>
          <button class="react-aria-ToggleButton" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-label="Underline" :aria-pressed="String(pressed.underline)" @click="toggleStyle('underline')"><u>U</u></button>
        </div>
        <div role="separator" aria-orientation="vertical" class="react-aria-Separator"></div>
        <template data-react-aria-hidden="true"></template>
        <div class="react-aria-Select" data-rac="">
          <span class="react-aria-Label">Favorite Animal</span>
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true" aria-haspopup="listbox" :aria-expanded="String(isOpen)" @click="toggleOpen">
            <span class="react-aria-SelectValue" data-rac="" :data-placeholder="selectPlaceholder">{{ selectText }}</span>
            <span aria-hidden="true">▼</span>
          </button>
          <div v-if="isOpen" class="react-aria-Popover" data-rac="" data-trigger="Select" style="position: absolute; z-index: 5; max-height: 355px; background: Canvas; color: CanvasText; border: 1px solid gray;">
            <VueListBox
              v-model="selectedAnimal"
              aria-label="Favorite Animal"
              class="react-aria-ListBox"
              collection-class="react-aria-ListBox"
              item-class="react-aria-ListBoxItem"
              selection-mode="single"
              :items="animals"
              @select="selectAnimal" />
          </div>
        </div>
        <div role="separator" aria-orientation="vertical" class="react-aria-Separator"></div>
        <div aria-label="Clipboard" class="react-aria-Group" data-rac="" role="group">
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Copy</button>
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Paste</button>
          <button class="react-aria-Button" data-rac="" type="button" tabindex="0" data-react-aria-pressable="true">Cut</button>
        </div>
      </div>
    `
  })
};
