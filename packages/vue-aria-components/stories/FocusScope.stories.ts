import {FocusScope} from '@vue-aria/focus';
import {computed, defineComponent, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

interface StoryProps {
  autoFocus?: boolean,
  contain?: boolean,
  isPortaled?: boolean,
  restoreFocus?: boolean
}

const Example = defineComponent({
  name: 'VueFocusScopeExample',
  props: {
    contain: {
      type: Boolean,
      default: true
    },
    isPortaled: {
      type: Boolean,
      default: false
    }
  },
  components: {FocusScope},
  setup() {
    let open = ref(false);
    let nestedOpen = ref(false);
    let showReplacement = ref(false);

    return {
      nestedOpen,
      open,
      showReplacement
    };
  },
  template: `
    <div>
      <input aria-label="input before" />
      <button type="button" @click="open = true">Open dialog</button>
      <input aria-label="input after" />

      <Teleport v-if="isPortaled && open" to="#dialogsRoot">
        <FocusScope :contain="contain" restore-focus auto-focus>
          <div role="dialog">
            <template v-if="!showReplacement">
              <input />
              <input />
              <input />
              <button type="button" @click="showReplacement = true">replace focusscope children</button>
              <button type="button" @click="nestedOpen = !nestedOpen">Open dialog</button>
              <button type="button" @click="open = false">close</button>
            </template>
            <template v-else>
              <input />
              <input autofocus />
              <input />
            </template>
          </div>
          <div v-if="nestedOpen" role="dialog" style="margin-top: 8px;">
            <input />
            <button type="button" @click="nestedOpen = false">close nested</button>
          </div>
        </FocusScope>
      </Teleport>

      <FocusScope v-else-if="open" :contain="contain" restore-focus auto-focus>
        <div role="dialog">
          <template v-if="!showReplacement">
            <input />
            <input />
            <input />
            <button type="button" @click="showReplacement = true">replace focusscope children</button>
            <button type="button" @click="nestedOpen = !nestedOpen">Open dialog</button>
            <button type="button" @click="open = false">close</button>
          </template>
          <template v-else>
            <input />
            <input autofocus />
            <input />
          </template>
        </div>
        <div v-if="nestedOpen" role="dialog" style="margin-top: 8px;">
          <input />
          <button type="button" @click="nestedOpen = false">close nested</button>
        </div>
      </FocusScope>

      <div id="dialogsRoot" />
    </div>
  `
});

const FocusableFirstInScopeExample = defineComponent({
  name: 'VueFocusableFirstInScopeExample',
  components: {FocusScope},
  setup() {
    let contentIndex = ref(0);
    let buttonRemoved = ref(false);
    let nextLabel = computed(() => `Dialog ${contentIndex.value === 2 ? 1 : contentIndex.value + 2}`);

    return {
      buttonRemoved,
      contentIndex,
      nextLabel
    };
  },
  template: `
    <FocusScope contain>
      <div role="dialog" tabindex="-1" :aria-labelledby="'heading-' + contentIndex" style="border: 1px solid currentColor; border-radius: 5px; padding: 0 1.5rem 1.5rem; width: 15rem;">
        <h1 :id="'heading-' + contentIndex">Dialog {{contentIndex + 1}}</h1>
        <template v-if="contentIndex === 2">
          <p>The end of the road.</p>
          <button
            v-if="!buttonRemoved"
            type="button"
            :id="'button-' + contentIndex"
            @click="buttonRemoved = true">
            Remove Me
          </button>
          <p v-else>With no tabbable elements within the scope, FocusScope tries to focus the first focusable element.</p>
        </template>
        <template v-else>
          <p>Content that will be replaced by <strong>{{nextLabel}}</strong>.</p>
          <button type="button" :id="'button-' + contentIndex" @click="contentIndex = contentIndex === 2 ? 0 : contentIndex + 1">
            Go to {{nextLabel}}
          </button>
        </template>
      </div>
    </FocusScope>
  `
});

const IgnoreRestoreFocusExample = defineComponent({
  name: 'VueIgnoreRestoreFocusExample',
  components: {FocusScope},
  setup() {
    let display = ref(false);
    return {display};
  },
  template: `
    <div>
      <button type="button" @click="display = !display">
        {{display ? 'Close dialog 1' : 'Open dialog 1'}}
      </button>
      <button type="button" @click="display = !display">
        {{display ? 'Close dialog 2' : 'Open dialog 2'}}
      </button>
      <FocusScope v-if="display" restore-focus>
        <div role="dialog">
          <input />
          <input />
          <input />
        </div>
      </FocusScope>
    </div>
  `
});

const FocusableInputFormExample = defineComponent({
  name: 'VueFocusableInputFormExample',
  components: {FocusScope},
  props: {
    autoFocus: {
      type: Boolean,
      default: true
    },
    contain: {
      type: Boolean,
      default: true
    },
    restoreFocus: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    let isOpen = ref(false);
    return {isOpen};
  },
  template: `
    <div>
      <button type="button" @click="isOpen = true">Open</button>
      <template v-if="isOpen">
        <div style="display: flex; flex-direction: column; margin-bottom: 10px;">
          <FocusScope :contain="contain" :restore-focus="restoreFocus" :auto-focus="autoFocus">
            <label for="first-input">First Input</label>
            <input id="first-input" />
            <label for="second-input">Second Input</label>
            <input id="second-input" />
          </FocusScope>
        </div>
        <div style="display: flex; flex-direction: column;">
          <label for="third-input">Third Input</label>
          <input id="third-input" />
        </div>
        <button type="button" @click="isOpen = false">Close</button>
      </template>
    </div>
  `
});

const meta = {
  title: 'FocusScope',
  parameters: {
    description: {
      data: 'Should not be able to click or navigate back into inputs from previous dialogs.'
    }
  },
  excludeStories: ['Example']
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExampleStory: Story = {
  render: (args) => ({
    components: {Example},
    setup() {
      return {args};
    },
    template: '<Example v-bind="args" />'
  }),
  name: 'Example'
};

export const KeyboardNavigation: Story = {
  render: ExampleStory.render,
  args: {isPortaled: false}
};

export const KeyboardNavigationInsidePortal: Story = {
  render: ExampleStory.render,
  args: {isPortaled: true}
};

export const KeyboardNavigationNoContain: Story = {
  render: ExampleStory.render,
  args: {isPortaled: false, contain: false}
};

export const KeyboardNavigationInsidePortalNoContain: Story = {
  render: ExampleStory.render,
  args: {isPortaled: true, contain: false}
};

export const IgnoreRestoreFocus: Story = {
  render: () => ({
    components: {IgnoreRestoreFocusExample},
    template: '<IgnoreRestoreFocusExample />'
  })
};

export const FocusableFirstInScope: Story = {
  render: () => ({
    components: {FocusableFirstInScopeExample},
    template: '<FocusableFirstInScopeExample />'
  })
};

export const FocusableInputForm: Story = {
  render: (args) => ({
    components: {FocusableInputFormExample},
    setup() {
      return {args};
    },
    template: '<FocusableInputFormExample v-bind="args" />'
  }),
  name: 'FocusableInputForm',
  args: {
    contain: true,
    restoreFocus: true,
    autoFocus: true
  },
  argTypes: {
    contain: {
      control: 'boolean'
    },
    restoreFocus: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    }
  }
};

export const ContainsHiddenElement: Story = {
  render: (args) => ({
    components: {FocusScope},
    setup() {
      return {args};
    },
    template: `
      <FocusScope v-bind="args">
        <input />
        <input style="visibility: hidden;" />
        <input />
      </FocusScope>
    `
  }),
  args: {
    contain: true
  },
  argTypes: {
    contain: {
      control: 'boolean'
    },
    restoreFocus: {
      control: 'boolean'
    },
    autoFocus: {
      control: 'boolean'
    }
  }
};
