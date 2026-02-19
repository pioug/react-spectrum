# [React Spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html)

A React implementation of Spectrum, Adobe’s design system.

## Migration notice

As of February 19, 2026, this React package is in maintenance mode while Vue migration ports continue.

* Vue replacement package family: `@vue-spectrum/*`.
* Migration guide: [`migration/REACT_TO_VUE_MIGRATION_GUIDE.md`](../../../migration/REACT_TO_VUE_MIGRATION_GUIDE.md).
* Deprecation plan: [`migration/REACT_DEPRECATION_PLAN.md`](../../../migration/REACT_DEPRECATION_PLAN.md).
* Current tracker: [`VUE_MIGRATION_TRACKER.md`](../../../VUE_MIGRATION_TRACKER.md).

## Features

* ♿️ **Accessible** – React Spectrum components are designed with accessibility top-of-mind and include full screen reader and keyboard navigation support.
* 📱 **Adaptive** – React Spectrum components are designed to work with mouse, touch, and keyboard interactions. They’re built with responsive design principles to deliver a great experience, no matter the device.
* 🌍 **International** – React Spectrum components are designed to support over 30 languages, including support for right-to-left languages, date and number formatting, and more.
* 🎨 **Customizable theming** – React Spectrum supports custom themes to match your brand, including automatic support for dark mode.

## Getting started

The easiest way to start building a React Spectrum application is by following our [getting started](https://react-spectrum.adobe.com/react-spectrum/getting-started.html) guide. It walks through all of the steps needed to install the components from npm, set up build tooling, and create your first application.

### Example

Here is a very basic example of using React Spectrum.

```jsx
import {Provider, defaultTheme, Button} from '@adobe/react-spectrum';

// Render it in your app!
function App() {
  return (
    <Provider theme={theme}>
      <Button
        variant="cta"
        onPress={() => alert('Hey there!')}>
        Hello React Spectrum!
      </Button>
    </Provider>
  );
}
```

## Learn more

React Spectrum is part of a family of libraries that help you build adaptive, accessible, and robust user experiences.
Learn more about [React Aria](https://react-spectrum.adobe.com/react-aria/index.html) and [React Stately](https://react-spectrum.adobe.com/react-stately/index.html) if you'd like to build your own component library from scratch on [our website](https://react-spectrum.adobe.com/index.html).
