import {action} from '@storybook/addon-actions';
import {computed, ref} from 'vue';
import {usePress} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'usePress'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function createPressButton(label: string, handlerName: string) {
  let {isPressed, pressProps} = usePress({
    onPress: () => {
      action(handlerName)(label);
    }
  });

  return {
    isPressed,
    pressProps
  };
}

export const TouchIssue: Story = {
  render: () => ({
    setup() {
      let opened = ref(false);
      let openPress = usePress({
        onPress: () => {
          opened.value = true;
          action('open')('Open');
        }
      });

      let closeButtons = ['Close 1', 'Close 2', 'Close 3'].map((label) => {
        return createPressButton(label, 'close');
      });

      let onNativeClick = () => {
        action('native click')('On Click');
      };

      return {
        closeButtons,
        openIsPressed: openPress.isPressed,
        openPressProps: openPress.pressProps,
        onNativeClick,
        opened
      };
    },
    template: `
      <div style="display: grid; gap: 12px; max-width: 420px;">
        <div
          v-bind="openPressProps"
          role="button"
          tabindex="0"
          :style="{padding: '8px 12px', border: '1px solid #111', cursor: 'pointer', display: 'inline-block', background: openIsPressed ? '#e3e3e3' : 'white', width: 'fit-content'}">
          Open
        </div>
        <div style="display: flex; gap: 12px;">
          <div>Some text</div>
          <a href="https://www.google.com" target="_blank" rel="noreferrer">Another Link</a>
          <button type="button" @click="onNativeClick">On Click</button>
        </div>
        <div v-if="opened" style="border: 1px solid #999; padding: 12px; display: grid; gap: 8px;">
          <h1 style="font-size: 16px; margin: 0;">Header</h1>
          <div style="display: flex; gap: 8px;">
            <div
              v-for="(button, index) in closeButtons"
              :key="index"
              v-bind="button.pressProps"
              role="button"
              tabindex="0"
              :style="{padding: '6px 10px', border: '1px solid #555', cursor: 'pointer', background: button.isPressed ? '#efefef' : 'white'}"
              @click="opened = false">
              Close {{index + 1}}
            </div>
          </div>
        </div>
      </div>
    `
  }),
  name: 'Touch Issue'
};

export const LinkOnPress: Story = {
  render: () => ({
    setup() {
      let linkPress = usePress({
        onPress: () => {
          action('link on press')('Pressed Adobe link');
        }
      });

      return {
        linkPressProps: linkPress.pressProps
      };
    },
    template: `
      <a
        v-bind="linkPressProps"
        href="http://adobe.com"
        target="_blank"
        rel="noreferrer"
        style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem;">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="height: 2rem; width: 2rem; fill: red;">
          <title>Adobe</title>
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
        </svg>
      </a>
    `
  }),
  name: 'Link On Press',
  parameters: {
    description: {
      data: 'Pressing on the link should always open a new tab. This tests usePress not preventing default.'
    }
  }
};

export const ClickOutsideIssue: Story = {
  render: () => ({
    setup() {
      let open = ref(false);
      let trigger = usePress({
        onPress: () => {
          open.value = true;
        }
      });
      let close = usePress({
        onPress: () => {
          open.value = false;
        }
      });
      let onHelpClick = () => {
        action('outside click')('Help clicked');
      };

      return {
        closeProps: close.pressProps,
        open,
        onHelpClick,
        triggerProps: trigger.pressProps
      };
    },
    template: `
      <div style="display: grid; gap: 12px; align-self: start;">
        <h2 style="font-size: 16px; margin: 0;">Tap/click outside panel should not trigger unintended press handlers.</h2>
        <div style="position: fixed; display: flex; background: black; top: 150px; width: 90%; height: 160px;">
          <div
            style="margin-left: auto; color: #fff; border: 1px solid #fff; width: 220px; background: red;"
            @click="onHelpClick">
            Help
          </div>
        </div>
        <button v-bind="triggerProps" type="button" style="width: fit-content;">Open drawer</button>
        <div v-if="open" style="position: fixed; inset: 0; background: rgba(45, 0, 0, 0.3);">
          <div style="position: fixed; top: 0; right: 0; width: 280px; bottom: 0; background: #fff; border-left: 1px solid #aaa; padding: 16px;">
            <h3 style="margin-top: 0;">Notice</h3>
            <p>This is a modal with a custom overlay.</p>
            <button v-bind="closeProps" type="button">Close</button>
          </div>
        </div>
      </div>
    `
  }),
  name: 'Click Outside Issue'
};

export const SoftwareKeyboardIssue: Story = {
  render: () => ({
    setup() {
      let ariaPress = usePress({
        onPress: () => {
          action('aria press')('Hello world, Aria!');
        }
      });
      let onAnchorClick = () => {
        action('anchor click')('I told you not to click me');
      };
      let onNativePress = () => {
        action('native click')('Hello world, native!');
      };

      return {
        ariaPressProps: ariaPress.pressProps,
        onAnchorClick,
        onNativePress
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 12px; max-width: 260px; min-height: 70vh;">
        <p>Focus the input to show the software keyboard, then press the buttons below.</p>
        <input type="text" style="font-size: 16px;" />
        <a
          @click="onAnchorClick"
          style="font-size: 48px; margin-top: auto;">
          Don't click me
        </a>
        <div style="display: flex; gap: 8px; margin-top: 48px;">
          <button v-bind="ariaPressProps" type="button" style="height: 36px;">Aria press me</button>
          <button type="button" style="height: 36px;" @click="onNativePress">native press me</button>
        </div>
      </div>
    `
  }),
  name: 'Software Keyboard Issue'
};

export const AndroidUnmountIssue: Story = {
  render: () => ({
    setup() {
      let showButton = ref(true);
      let press = usePress({
        onPress: () => {
          action('onPress')('ra Button pressed');
          showButton.value = false;
        }
      });
      let onUnderButtonClick = () => {
        action('under button')('button underneath was pressed');
      };

      return {
        onUnderButtonClick,
        pressProps: press.pressProps,
        showButton
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <p style="max-width: 420px;">This story tests an Android issue where tapping a button that unmounts can trigger the element behind it.</p>
        <div style="position: relative; width: 100px; height: 100px;">
          <button
            type="button"
            style="position: absolute; top: 0;"
            @click="onUnderButtonClick">
            Test 2
          </button>
          <button
            v-if="showButton"
            v-bind="pressProps"
            type="button"
            style="position: absolute; top: 0;">
            Test
          </button>
        </div>
      </div>
    `
  }),
  name: 'Android Unmount Issue'
};

export const IOSScrollIssue: Story = {
  render: () => ({
    setup() {
      let cardPress = usePress({
        onPress: () => {
          action('card press')('pressed');
        }
      });

      let cards = computed(() => Array.from({length: 10}, (_, index) => index + 1));

      return {
        cardPressProps: cardPress.pressProps,
        cards
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <p style="max-width: 640px;">Scrolling the horizontal list should not trigger onPress.</p>
        <div style="width: 500px; height: 100px; overflow-y: hidden; overflow-x: auto; border: 1px solid black; display: flex; gap: 8px;">
          <button
            v-for="card in cards"
            :key="card"
            v-bind="cardPressProps"
            type="button"
            style="height: 80px; width: 150px; flex-shrink: 0;">
            Test
          </button>
        </div>
      </div>
    `
  }),
  name: 'iOS Scroll Issue'
};
