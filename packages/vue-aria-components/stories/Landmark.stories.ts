import {UNSTABLE_createLandmarkController, useLandmark} from '@vue-aria/landmark';
import {TextField} from '@vue-spectrum/textfield';
import {defineComponent, h, ref, type PropType} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import type {AriaLandmarkRole} from '@vue-aria/landmark';

const LandmarkNode = defineComponent({
  name: 'VueStoryLandmarkNode',
  props: {
    ariaLabel: {
      type: String,
      default: undefined
    },
    elementType: {
      type: String,
      default: 'section'
    },
    role: {
      type: String as PropType<AriaLandmarkRole>,
      required: true
    }
  },
  setup(props, {slots}) {
    let elementRef = ref<HTMLElement | null>(null);
    let {landmarkProps} = useLandmark({
      role: props.role,
      ariaLabel: props.ariaLabel
    }, elementRef);

    return () => h(props.elementType, {
      ref: elementRef,
      ...landmarkProps.value,
      style: {
        border: '1px solid #c6c6c6',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '10px'
      }
    }, slots.default ? slots.default() : []);
  }
});

const meta = {
  title: 'Landmark',
  parameters: {
    providerSwitcher: {
      mainElement: false
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlatLandmarks: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <LandmarkNode element-type="nav" role="navigation" aria-label="Rainbow lookout">
          <div>Navigation Landmark</div>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </LandmarkNode>
        <LandmarkNode element-type="main" role="main" aria-label="Danni's unicorn corral">
          <div>Main Landmark</div>
          <TextField label="First Name" />
        </LandmarkNode>
      </div>
    `
  })
};

export const NestedLandmarks: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <LandmarkNode element-type="main" role="main" aria-label="Danni's unicorn corral">
          <div>Main Landmark</div>
          <TextField label="First Name" />
          <LandmarkNode element-type="article" role="region" aria-label="The greens">
            <div>Region Landmark inside Main</div>
            <label><input type="checkbox"> Checkbox label</label>
          </LandmarkNode>
        </LandmarkNode>
      </div>
    `
  })
};

export const TableLandmark: Story = {
  render: () => ({
    components: {LandmarkNode},
    template: `
      <div>
        <LandmarkNode element-type="nav" role="navigation" aria-label="Rainbow lookout">
          <div style="display: flex; gap: 8px;">
            <button type="button">One</button>
            <button type="button">Two</button>
            <button type="button">Three</button>
          </div>
        </LandmarkNode>
        <LandmarkNode element-type="main" role="main" aria-label="Danni's unicorn corral">
          <table border="1" cellpadding="6" cellspacing="0">
            <thead>
              <tr>
                <th>Foo</th>
                <th>Bar</th>
                <th>Baz</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Foo 1</td><td>Bar 1</td><td>Baz 1</td></tr>
              <tr><td>Foo 2</td><td>Bar 2</td><td>Baz 2</td></tr>
              <tr><td>Foo 3</td><td>Bar 3</td><td>Baz 3</td></tr>
            </tbody>
          </table>
        </LandmarkNode>
      </div>
    `
  })
};

export const ApplicationWithLandmarks: Story = {
  render: () => ({
    components: {LandmarkNode},
    template: `
      <div style="display: grid; grid-template-columns: 220px 1fr 220px; gap: 10px;">
        <LandmarkNode element-type="article" role="region" aria-label="Global header" style="grid-column: 1 / -1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="//react-spectrum.com">React Spectrum</a>
            <form role="search">
              <label>
                Search
                <input type="search" />
              </label>
            </form>
          </div>
        </LandmarkNode>
        <LandmarkNode element-type="nav" role="navigation" aria-label="Site Nav">
          <button type="button">One</button>
          <button type="button">Two</button>
          <button type="button">Three</button>
        </LandmarkNode>
        <LandmarkNode element-type="main" role="main" aria-label="Main Content">
          <div>Main Landmark</div>
          <p>Application layout with multiple landmark regions.</p>
        </LandmarkNode>
        <LandmarkNode element-type="nav" role="navigation" aria-label="Content Nav">
          <button type="button">One</button>
          <button type="button">Two</button>
          <button type="button">Three</button>
        </LandmarkNode>
      </div>
    `
  })
};

export const DuplicateRolesWithLabels: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <LandmarkNode element-type="nav" role="navigation" aria-label="First Nav">
          <div>Navigation Landmark with 'First Nav' label</div>
        </LandmarkNode>
        <LandmarkNode element-type="nav" role="navigation" aria-label="Second Nav">
          <div>Navigation Landmark with 'Second Nav' label</div>
        </LandmarkNode>
        <LandmarkNode element-type="main" role="main" aria-label="Danni's unicorn corral">
          <TextField label="First Name" />
        </LandmarkNode>
      </div>
    `
  })
};

export const DuplicateRolesWithNoLabels: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <LandmarkNode element-type="nav" role="navigation">
          <div>Navigation Landmark with no label</div>
        </LandmarkNode>
        <LandmarkNode element-type="nav" role="navigation">
          <div>Navigation Landmark with no label</div>
        </LandmarkNode>
        <LandmarkNode element-type="main" role="main">
          <TextField label="First Name" />
        </LandmarkNode>
      </div>
    `
  })
};

export const DuplicateRolesWithSameLabels: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <LandmarkNode element-type="nav" role="navigation" aria-label="First Nav">
          <div>Navigation Landmark with 'First Nav' label</div>
        </LandmarkNode>
        <LandmarkNode element-type="nav" role="navigation" aria-label="First Nav">
          <div>Navigation Landmark with 'First Nav' label</div>
        </LandmarkNode>
        <LandmarkNode element-type="main" role="main">
          <TextField label="First Name" />
        </LandmarkNode>
      </div>
    `
  })
};

export const OneWithNoFocusableChildren: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <TextField label="First Name" />
        <LandmarkNode element-type="main" role="main" aria-label="Danni's unicorn corral">
          <div>Main Landmark</div>
          <div>No focusable children</div>
        </LandmarkNode>
        <TextField label="First Name" />
      </div>
    `
  })
};

export const AllWithNoFocusableChildren: Story = {
  render: () => ({
    components: {LandmarkNode, TextField},
    template: `
      <div>
        <LandmarkNode element-type="article" role="region" aria-label="The greens">
          <div>Region Landmark</div>
          <div>No focusable children</div>
        </LandmarkNode>
        <TextField label="First Name" />
        <LandmarkNode element-type="main" role="main" aria-label="Danni's unicorn corral">
          <div>Main Landmark</div>
          <div>No focusable children</div>
        </LandmarkNode>
      </div>
    `
  })
};

export const IframeExampleStory: Story = {
  render: () => ({
    setup() {
      let navRef = ref<HTMLElement | null>(null);
      let iframeRef = ref<HTMLIFrameElement | null>(null);
      let iframeSrc = '<html><body style="font-family: sans-serif; padding: 16px;"><p>Iframe content</p><button type="button">Focusable button</button></body></html>';
      let controller = UNSTABLE_createLandmarkController();

      let navigation = useLandmark({
        role: 'navigation',
        ariaLabel: 'Site Nav'
      }, navRef);

      let iframeLandmark = useLandmark({
        role: 'main',
        ariaLabel: 'iframe'
      }, iframeRef);

      return {
        controller,
        iframeLandmark,
        iframeRef,
        iframeSrc,
        navigation,
        navRef
      };
    },
    template: `
      <div style="display: grid; gap: 10px;">
        <div style="display: flex; gap: 8px;">
          <button type="button" @click="controller.focusMain()">Focus Main</button>
          <button type="button" @click="controller.focusNext()">Focus Next</button>
          <button type="button" @click="controller.focusPrevious()">Focus Previous</button>
        </div>
        <nav
          ref="navRef"
          v-bind="navigation.landmarkProps"
          style="border: 1px solid #c6c6c6; border-radius: 6px; padding: 12px;">
          <button type="button">One</button>
          <button type="button">Two</button>
          <button type="button">Three</button>
        </nav>
        <iframe
          ref="iframeRef"
          v-bind="iframeLandmark.landmarkProps"
          title="iframe"
          :srcdoc="iframeSrc"
          style="border: 1px solid #c6c6c6; border-radius: 6px; width: 100%; height: 240px;" />
      </div>
    `
  }),
  name: 'iframe example'
};
