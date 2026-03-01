import type {Preview} from '@storybook/vue3-vite';
import {computed, h, onBeforeUnmount, ref} from 'vue';
import {addons} from 'storybook/preview-api';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {theme as darkTheme} from '@vue-spectrum/theme-dark';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {theme as lightTheme} from '@vue-spectrum/theme-light';
import 'vue-aria-components/styles.css';
import '../../../packages/react-aria-components/stories/styles.css';
import '../../../packages/react-aria-components/example/index.css';

if (typeof document !== 'undefined') {
  document.body.style.margin = '0';
}

let altTheme = {
  ...defaultTheme,
  light: lightTheme.light,
  dark: darkTheme.light
};

let themes = {
  light: defaultTheme,
  dark: altTheme,
  lightest: altTheme,
  darkest: defaultTheme
};

let expressThemes = Object.fromEntries(
  Object.entries(themes).map(([key, theme]) => ([
    key,
    {
      ...theme,
      global: {
        ...theme.global,
        express: expressTheme.global.express
      },
      medium: {
        ...theme.medium,
        express: expressTheme.medium.express
      },
      large: {
        ...theme.large,
        express: expressTheme.large.express
      }
    }
  ]))
);

const PROVIDER_THEME_ITEMS = [
  {title: 'Auto', value: 'auto'},
  {title: 'Light', value: 'light'},
  {title: 'Lightest', value: 'lightest'},
  {title: 'Dark', value: 'dark'},
  {title: 'Darkest', value: 'darkest'}
];

const PROVIDER_SCALE_ITEMS = [
  {title: 'Auto', value: 'auto'},
  {title: 'Medium', value: 'medium'},
  {title: 'Large', value: 'large'}
];

const PROVIDER_EXPRESS_ITEMS = [
  {title: 'Standard', value: false},
  {title: 'Express', value: true}
];

function normalizeProviderValue(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' && value !== 'auto'
    ? value
    : undefined;
}

function getProviderSwitcherValues(params: URLSearchParams, globals: any) {
  return {
    locale: params.get('providerSwitcher-locale') || undefined,
    theme: normalizeProviderValue(globals?.providerTheme)
      ?? normalizeProviderValue(params.get('providerSwitcher-theme'))
      ?? undefined,
    scale: normalizeProviderValue(globals?.providerScale)
      ?? normalizeProviderValue(params.get('providerSwitcher-scale'))
      ?? undefined,
    express: typeof globals?.providerExpress === 'boolean'
      ? globals.providerExpress
      : params.get('providerSwitcher-express') === 'true'
  };
}

function withScrollingSwitcher(story: any) {
  let params = new URLSearchParams(window.location.search);
  let isScrolling = params.get('scrolling') === 'true';
  let baseStyle = {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center'
  };
  let wrapperStyle = isScrolling
    ? {...baseStyle, height: '300vh', width: '300vw'}
    : {...baseStyle, minHeight: '100svh'};
  let Story = story();

  return {
    render() {
      let wrapped = h('div', {
        class: 'react-spectrum-story',
        style: wrapperStyle
      }, [
        h(Story)
      ]);

      if (!isScrolling) {
        return wrapped;
      }

      return h('div', {
        style: {overflow: 'auto', height: '100vh', width: '100vw'}
      }, [wrapped]);
    }
  };
}

function withProviderSwitcher(story: any, context: any) {
  let params = new URLSearchParams(window.location.search);
  let initialValues = getProviderSwitcherValues(params, context?.globals);
  let includeMainElement = context?.parameters?.providerSwitcher?.mainElement == null;
  let Story = story();

  return {
    setup() {
      let localeValue = ref(initialValues.locale);
      let themeValue = ref(initialValues.theme);
      let scaleValue = ref(initialValues.scale);
      let expressValue = ref(initialValues.express);
      let storyReady = ref(window.parent === window || window.parent !== window.top);
      let channel = addons.getChannel();
      let providerUpdate = (event: any) => {
        localeValue.value = event?.locale;
        themeValue.value = normalizeProviderValue(event?.theme);
        scaleValue.value = normalizeProviderValue(event?.scale);
        expressValue.value = Boolean(event?.express);
        storyReady.value = true;
      };

      channel.on('provider/updated', providerUpdate);
      channel.emit('rsp/ready-for-update');

      onBeforeUnmount(() => {
        channel.removeListener('provider/updated', providerUpdate);
      });

      let selectedTheme = computed(() => {
        let selectedThemes = expressValue.value ? expressThemes : themes;
        return selectedThemes[themeValue.value || 'light'] || defaultTheme;
      });

      let colorScheme = computed(() => (
        themeValue.value
          ? themeValue.value.replace(/est$/, '')
          : undefined
      ));

      return () => {
        let storyNode = storyReady.value ? h(Story) : null;
        let content = includeMainElement ? h('main', [storyNode]) : storyNode;

        return h(Provider, {
          theme: selectedTheme.value,
          colorScheme: colorScheme.value,
          scale: scaleValue.value,
          locale: localeValue.value
        }, {
          default: () => [content]
        });
      };
    }
  };
}

const preview: Preview = {
  globalTypes: {
    providerTheme: {
      name: 'Theme',
      description: 'Spectrum provider theme',
      defaultValue: 'auto',
      toolbar: {
        icon: 'paintbrush',
        items: PROVIDER_THEME_ITEMS,
        dynamicTitle: true
      }
    },
    providerScale: {
      name: 'Scale',
      description: 'Spectrum provider scale',
      defaultValue: 'auto',
      toolbar: {
        icon: 'expand',
        items: PROVIDER_SCALE_ITEMS,
        dynamicTitle: true
      }
    },
    providerExpress: {
      name: 'Express',
      description: 'Use Express tokens in Provider theme',
      defaultValue: false,
      toolbar: {
        icon: 'contrast',
        items: PROVIDER_EXPRESS_ITEMS,
        dynamicTitle: true
      }
    }
  },
  parameters: {
    options: {
      storySort: (a, b) => a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, {numeric: true})
    },
    layout: 'fullscreen',
    docs: {
      source: {
        type: 'code'
      }
    },
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withScrollingSwitcher,
    withProviderSwitcher
  ]
};

export default preview;
