import type {Preview} from '@storybook/vue3-vite';
import {h} from 'vue';
import {version as reactVersion} from 'react';
import {Provider} from '@vue-spectrum/provider';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {theme as darkTheme} from '@vue-spectrum/theme-dark';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {theme as lightTheme} from '@vue-spectrum/theme-light';
import '@vue-spectrum/components/styles.css';
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
        h('span', {
          style: {position: 'absolute', top: '0', left: '0'}
        }, reactVersion),
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
  let localeValue = params.get('providerSwitcher-locale') || undefined;
  let themeValue = params.get('providerSwitcher-theme') || undefined;
  let scaleValue = params.get('providerSwitcher-scale') || undefined;
  let expressValue = params.get('providerSwitcher-express') === 'true';
  let selectedThemes = expressValue ? expressThemes : themes;
  let theme = selectedThemes[themeValue || 'light'] || defaultTheme;
  let colorScheme = themeValue ? themeValue.replace(/est$/, '') : undefined;
  let includeMainElement = context?.parameters?.providerSwitcher?.mainElement == null;
  let Story = story();

  return {
    render() {
      let storyNode = h(Story);
      let content = includeMainElement ? h('main', [storyNode]) : storyNode;

      return h(Provider, {
        theme,
        colorScheme,
        scale: scaleValue,
        locale: localeValue
      }, {
        default: () => [content]
      });
    }
  };
}

const preview: Preview = {
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
