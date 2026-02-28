import {action} from 'storybook/actions';
import {computed, ref} from 'vue';
import {usePress} from '@vue-aria/interactions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import '../../@react-aria/interactions/stories/usePress-stories.css';

const meta = {
  title: 'usePress'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function createPressHandler(onPress: () => void) {
  let {pressProps} = usePress({onPress});

  return {
    pressProps
  };
}

export const TouchIssue: Story = {
  render: () => ({
    setup() {
      let opened = ref(false);
      let open = createPressHandler(() => {
        action('open')('opening');
        opened.value = true;
      });
      let closeButtons = ['Close 1', 'Close 2', 'Close 3'].map((label) => ({
        ...createPressHandler(() => {
          action('close')('closing');
          opened.value = false;
        }),
        label
      }));
      let onNativeClick = () => {
        action('native click')('clicked it');
      };

      return {
        closeButtons,
        onNativeClick,
        openPressProps: open.pressProps,
        opened
      };
    },
    template: `
      <div class="outer-div">
        <div
          v-bind="openPressProps"
          role="button"
          tabindex="0"
          class="OnPress open-btn">
          Open
        </div>
        <div class="side-by-side">
          <div>Some text</div>
          <a href="https://www.google.com" class="visit-link">Another Link</a>
          <button class="my-btn" type="button" @click="onNativeClick">On Click</button>
        </div>

        <div v-if="opened" class="fake-modal">
          <h1>Header</h1>
          <div class="side-by-side">
            <div
              v-for="button in closeButtons"
              :key="button.label"
              v-bind="button.pressProps"
              role="button"
              tabindex="0"
              class="OnPress close-btn">
              {{button.label}}
            </div>
          </div>
        </div>
      </div>
    `
  }),
  name: 'Touch Issue'
};

export const linkOnPress: Story = {
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
      <div class="outer-div">
        <a
          v-bind="linkPressProps"
          href="http://adobe.com"
          target="_blank"
          rel="noreferrer">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style="height: 2rem; width: 2rem; fill: red;">
            <title>Adobe</title>
            <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
          </svg>
        </a>
      </div>
    `
  }),
  parameters: {
    description: {
      data: 'Pressing on the link should always open a new tab. This tests specifically that usePress doesnt erroneously prevent default, especially on mobile'
    }
  }
};

export const ClickOutsideIssue: Story = {
  render: () => ({
    setup() {
      let open = ref(false);
      let trigger = createPressHandler(() => {
        open.value = true;
      });
      let close = createPressHandler(() => {
        open.value = false;
      });
      let onHelpClick = () => {
        action('outside click')('Clicked!');
      };

      return {
        closeProps: close.pressProps,
        onHelpClick,
        open,
        triggerProps: trigger.pressProps
      };
    },
    template: `
      <div style="align-self: start;">
        <h2 style="font-size: 16px;">
          before clicking the button please make sure 'desktop(touch)' mode is
          active in the responsive dev tools
        </h2>
        <div
          style="position: fixed; display: flex; background-color: black; top: 150px; width: 100%; height: 200px;">
          <div
            style="margin-left: auto; color: #fff; border: 1px solid #fff; width: 400px; background-color: red;"
            @click="onHelpClick">
            Help
          </div>
        </div>
        <button v-bind="triggerProps" type="button">Open drawer</button>
        <div v-if="open" style="position: fixed; inset: 0; background: rgba(45, 0, 0, 0.3);">
          <div
            style="position: fixed; top: 0; right: 0; bottom: 0; width: 300px; background: #fff; outline: none; border-left: 1px solid gray; box-shadow: -8px 0 20px rgba(0 0 0 / 0.1); padding-top: 50px;">
            <h3 style="margin-top: 0;">Notice</h3>
            <p>This is a modal with a custom modal overlay.</p>
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
      let onNativeClick = () => {
        action('native click')('Hello world, native!');
      };

      return {
        ariaPressProps: ariaPress.pressProps,
        onAnchorClick,
        onNativeClick
      };
    },
    template: `
      <div
        style="display: flex; flex-direction: column; gap: 12px; padding: 12px; max-width: 256px; height: 100vh;">
        <p>Focus the input to show the software keyboard, then press the buttons below.</p>
        <input type="text" style="font-size: 16px;">
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
          <a @click="onAnchorClick" style="font-size: 64px;">Don't click me</a>
          <div style="display: flex; gap: 8px; margin-top: 110px;">
            <button v-bind="ariaPressProps" type="button" style="height: 36px;">Aria press me</button>
            <button type="button" style="height: 36px;" @click="onNativeClick">native press me</button>
          </div>
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
      let button = createPressHandler(() => {
        action('onPress')('ra Button pressed');
        showButton.value = false;
      });
      let onUnderButtonClick = () => {
        action('under button')('button underneath was pressed');
      };

      return {
        onUnderButtonClick,
        pressProps: button.pressProps,
        showButton
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>This story tests an Android issue where tapping a button that unmounts causes the element behind it to receive onClick.</p>
        <div style="position: relative; width: 100px; height: 100px;">
          <button type="button" style="position: absolute; top: 0;" @click="onUnderButtonClick">Test 2</button>
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
      let cards = computed(() => Array.from({length: 10}, (_, index) => index + 1));
      let cardPress = usePress({
        onPress: () => {
          action('card press')('pressed');
        }
      });

      return {
        cards,
        cardPressProps: cardPress.pressProps
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p>This story tests an iOS Safari issue that causes onPointerCancel not to be fired with touch-action: manipulation. Scrolling the list should not trigger onPress.</p>
        <div
          style="margin-top: 10px; width: 500px; height: 100px; overflow-y: hidden; overflow-x: auto; border: 1px solid black; display: flex; gap: 8px;">
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
