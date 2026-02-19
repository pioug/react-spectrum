#  [React Spectrum Libraries](https://react-spectrum.adobe.com/)

A collection of libraries and tools that help you build adaptive, accessible, and robust user experiences.

## Vue migration baseline

This repository now includes a Vue migration baseline so teams can begin moving off React incrementally:

* `packages/@vue-spectrum/components` contains initial Vue primitives (`VueSpectrumProvider`, `VueButton`, and `VueTextField`).
* `packages/@vue-spectrum/provider` provides the first package-level port (`Provider`/`VueProvider`) layered on the Vue primitives.
* `packages/@vue-spectrum/button`, `packages/@vue-spectrum/avatar`, `packages/@vue-spectrum/badge`, `packages/@vue-spectrum/autocomplete`, `packages/@vue-spectrum/buttongroup`, `packages/@vue-spectrum/well`, `packages/@vue-spectrum/view`, `packages/@vue-spectrum/text`, `packages/@vue-spectrum/textfield`, `packages/@vue-spectrum/searchfield`, `packages/@vue-spectrum/numberfield`, `packages/@vue-spectrum/slider`, `packages/@vue-spectrum/progress`, `packages/@vue-spectrum/meter`, `packages/@vue-spectrum/statuslight`, `packages/@vue-spectrum/checkbox`, `packages/@vue-spectrum/radio`, `packages/@vue-spectrum/switch`, `packages/@vue-spectrum/tabs`, `packages/@vue-spectrum/tag`, `packages/@vue-spectrum/test-utils`, `packages/@vue-spectrum/theme-dark`, `packages/@vue-spectrum/theme-default`, `packages/@vue-spectrum/theme-express`, `packages/@vue-spectrum/theme-light`, `packages/@vue-spectrum/toast`, `packages/@vue-spectrum/tooltip`, `packages/@vue-spectrum/utils`, `packages/@vue-spectrum/divider`, `packages/@vue-spectrum/link`, `packages/@vue-spectrum/list`, `packages/@vue-spectrum/label`, `packages/@vue-spectrum/labeledvalue`, `packages/@vue-spectrum/form`, `packages/@vue-spectrum/icon`, `packages/@vue-spectrum/image`, `packages/@vue-spectrum/inlinealert`, `packages/@vue-spectrum/illustratedmessage`, `packages/@vue-spectrum/layout`, `packages/@vue-spectrum/table`, `packages/@vue-spectrum/tree`, `packages/@vue-spectrum/dnd`, `packages/@vue-spectrum/dropzone`, `packages/@vue-spectrum/filetrigger`, `packages/@vue-spectrum/s2`, `packages/@vue-spectrum/steplist`, `packages/@vue-spectrum/story-utils`, and `packages/@vue-spectrum/style-macro-s1` provide first-wave and early data-heavy package-level ports.
* `packages/@vue-aria/actiongroup`, `packages/@vue-aria/autocomplete`, `packages/@vue-aria/breadcrumbs`, `packages/@vue-aria/button`, `packages/@vue-aria/calendar`, `packages/@vue-aria/checkbox`, `packages/@vue-aria/collections`, `packages/@vue-aria/combobox`, `packages/@vue-aria/datepicker`, `packages/@vue-aria/dialog`, `packages/@vue-aria/dnd`, `packages/@vue-aria/example-theme`, `packages/@vue-aria/focus`, `packages/@vue-aria/form`, `packages/@vue-aria/grid`, `packages/@vue-aria/gridlist`, `packages/@vue-aria/i18n`, `packages/@vue-aria/interactions`, `packages/@vue-aria/label`, `packages/@vue-aria/landmark`, `packages/@vue-aria/link`, `packages/@vue-aria/listbox`, `packages/@vue-aria/live-announcer`, `packages/@vue-aria/menu`, `packages/@vue-aria/meter`, `packages/@vue-aria/numberfield`, `packages/@vue-aria/overlays`, `packages/@vue-aria/progress`, `packages/@vue-aria/radio`, `packages/@vue-aria/searchfield`, `packages/@vue-aria/select`, `packages/@vue-aria/selection`, `packages/@vue-aria/separator`, `packages/@vue-aria/slider`, `packages/@vue-aria/spinbutton`, `packages/@vue-aria/ssr`, `packages/@vue-aria/steplist`, `packages/@vue-aria/switch`, `packages/@vue-aria/toggle`, `packages/@vue-aria/toolbar`, `packages/@vue-aria/tooltip`, `packages/@vue-aria/tree`, `packages/@vue-aria/utils`, `packages/@vue-aria/visually-hidden`, `packages/@vue-aria/tag`, `packages/@vue-aria/tabs`, `packages/@vue-aria/table`, `packages/@vue-aria/test-utils`, `packages/@vue-aria/textfield`, `packages/@vue-aria/toast`, `packages/@vue-aria/disclosure`, `packages/@vue-aria/color`, `packages/@vue-aria/aria-modal-polyfill`, and `packages/@vue-aria/virtualizer` start React Aria composable migration on the Vue layer.
* `packages/@vue-stately/autocomplete`, `packages/@vue-stately/calendar`, `packages/@vue-stately/checkbox`, `packages/@vue-stately/collections`, `packages/@vue-stately/color`, `packages/@vue-stately/combobox`, `packages/@vue-stately/data`, `packages/@vue-stately/datepicker`, `packages/@vue-stately/disclosure`, `packages/@vue-stately/dnd`, `packages/@vue-stately/flags`, `packages/@vue-stately/form`, `packages/@vue-stately/grid`, `packages/@vue-stately/layout`, `packages/@vue-stately/list`, `packages/@vue-stately/menu`, and `packages/@vue-stately/numberfield` start React Stately state migration on the Vue layer.
* `starters/vue` includes a virtualized backlog demo wired to `@vue-aria/virtualizer`.
* `packages/@vue-spectrum/accordion`, `packages/@vue-spectrum/actionbar`, `packages/@vue-spectrum/actiongroup`, `packages/@vue-spectrum/breadcrumbs`, `packages/@vue-spectrum/calendar`, `packages/@vue-spectrum/card`, `packages/@vue-spectrum/color`, `packages/@vue-spectrum/contextualhelp`, `packages/@vue-spectrum/datepicker`, `packages/@vue-spectrum/dialog`, `packages/@vue-spectrum/overlays`, `packages/@vue-spectrum/picker`, `packages/@vue-spectrum/combobox`, `packages/@vue-spectrum/menu`, and `packages/@vue-spectrum/listbox` start the composition-component migration layer.
* `packages/tailwindcss-vue-aria-components` provides a Vue-tailored Tailwind variant plugin baseline.
* `starters/vue` is a runnable Vue + Vite starter wired to the new package.
* `MIGRATION_TO_VUE.md` describes the migration plan from existing React packages to Vue packages.
* `VUE_MIGRATION_TRACKER.md` tracks package-by-package migration status and acceptance tests.
* `migration/VUE_PUBLISH_CHECKLIST.md`, `migration/REACT_DEPRECATION_PLAN.md`, `migration/REACT_TO_VUE_MIGRATION_GUIDE.md`, and `migration/VUE_PACKAGE_ARCHITECTURE.md` track publish/deprecation execution, consumer migration guidance, and package-layout rationale for the stabilization phase.

Use the starter from the repository root:

```sh
yarn start:vue
```

Regenerate and validate the migration tracker:

```sh
yarn vue:migration:report
yarn vue:migration:test
yarn test:vue
```

The Vue starter test harness currently covers primitive, composition, and data-heavy migration ports.

### React Spectrum

A React implementation of Spectrum, Adobe’s design system. Spectrum provides adaptive, accessible, and cohesive experiences for all Adobe applications.

[Explore React Spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html)

### React Aria

A library of unstyled React components and hooks that helps you build accessible, high quality UI components for your application or design system.

[Learn more about React Aria](https://react-spectrum.adobe.com/react-aria/index.html)

### React Stately

A library of React Hooks that provides cross-platform state management for your design system.

[More information about React Stately](https://react-spectrum.adobe.com/react-stately/index.html)

### Internationalized

A collection of framework-agnostic internationalization libraries for the web.

[Internationalized Packages](https://react-spectrum.adobe.com/internationalized/index.html)

## Features

* ♿️ **[Accessible](https://react-spectrum.adobe.com/react-aria/accessibility.html)** – Accessibility and behavior is implemented according to [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.2/), including full screen reader and keyboard navigation support. All components have been tested across a wide variety of screen readers and devices to ensure the best experience possible for all users.
* 📱 **[Adaptive](https://react-spectrum.adobe.com/react-aria/interactions.html)** – All components are designed to work with mouse, touch, and keyboard interactions. They’re built with responsive design principles to deliver a great experience, no matter the device.
* 🌍 **[International](https://react-spectrum.adobe.com/react-aria/internationalization.html)** – Support over 30 languages is included out of the box, including support for right-to-left languages, date and number formatting, and more.
* 🎨 **[Customizable](https://react-spectrum.adobe.com/react-spectrum/theming.html)** – React Spectrum components support custom themes, and automatically adapt for dark mode. For even more customizability, you can build your own components with your own DOM structure and styling using the [React Aria](https://react-spectrum.adobe.com/react-aria/index.html) and [React Stately](https://react-spectrum.adobe.com/react-stately/index.html) hooks to provide behavior, accessibility, and interactions.

## Getting started

React Spectrum includes several libraries, which you can choose depending on your usecase.

* [React Spectrum](https://react-spectrum.adobe.com/react-spectrum/getting-started.html) is an implementation of Adobe's design system. If you’re integrating with Adobe software or would like a complete component library to use in your project, look no further!
* [React Aria](https://react-spectrum.adobe.com/react-aria/getting-started.html) is a collection of unstyled React components and hooks that helps you build accessible, high quality UI components for your own application or design system. If you're building a component library for the web from scratch with your own styling, start here.
* [React Stately](https://react-spectrum.adobe.com/react-stately/getting-started.html) is a library of state management hooks for use in your component library. If you're using React Aria, you'll likely also use React Stately, but it can also be used independently (e.g. on other platforms like React Native).

[Read more about our architecture](https://react-spectrum.adobe.com/architecture.html).

## Contributing

One of the goals of the React Spectrum project is to make building design systems and component libraries as easy as possible, while maintaining high quality interactions and accessibility support. We aim to raise the bar for web applications. The best way to achieve that goal is **together**. We would love contributions from the community no matter how big or small. 😍

Read our [contributing guide](https://github.com/adobe/react-spectrum/blob/main/CONTRIBUTING.md) to learn about how to propose bugfixes and improvements, and how the development process works. For detailed information about our architecture, and how all of the pieces fit together, read our [architecture docs](https://react-spectrum.adobe.com/architecture.html).
