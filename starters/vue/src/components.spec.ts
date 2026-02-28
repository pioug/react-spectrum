import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import {h, nextTick} from 'vue';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {setInteractionModality} from '@vue-aria/interactions';
import EditWorkflow from '@spectrum-icons-vue/workflow/Edit';
import CheckmarkCircle from '@spectrum-icons-vue/workflow/CheckmarkCircle';
import {Avatar} from '@vue-spectrum/avatar';
import {Badge} from '@vue-spectrum/badge';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {ActionBar} from '@vue-spectrum/actionbar';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {ActionButton, Button, LogicButton, ToggleButton} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle} from '@vue-spectrum/accordion';
import {Calendar, RangeCalendar} from '@vue-spectrum/calendar';
import {Card, CardView, GalleryLayout, WaterfallLayout} from '@vue-spectrum/card';
import {Checkbox, CheckboxGroup} from '@vue-spectrum/checkbox';
import {ComboBox} from '@vue-spectrum/combobox';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {ColorField, ColorPicker, ColorSlider, ColorSwatchPicker} from '@vue-spectrum/color';
import {DatePicker, DateRangePicker, TimeField} from '@vue-spectrum/datepicker';
import {Dialog, DialogTrigger} from '@vue-spectrum/dialog';
import {Divider} from '@vue-spectrum/divider';
import {DropZone} from '@vue-spectrum/dropzone';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import {Form} from '@vue-spectrum/form';
import {Image} from '@vue-spectrum/image';
import {Icon, Illustration, UIIcon} from '@vue-spectrum/icon';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {InlineAlert} from '@vue-spectrum/inlinealert';
import {Flex, Grid, fitContent, minmax, repeat} from '@vue-spectrum/layout';
import {Field, HelpText, Label} from '@vue-spectrum/label';
import {LabeledValue} from '@vue-spectrum/labeledvalue';
import {Link} from '@vue-spectrum/link';
import {ListBox} from '@vue-spectrum/listbox';
import {ListView} from '@vue-spectrum/list';
import {Menu, MenuTrigger} from '@vue-spectrum/menu';
import {Meter} from '@vue-spectrum/meter';
import {NumberField} from '@vue-spectrum/numberfield';
import {Modal, Popover, Tray} from '@vue-spectrum/overlays';
import {Picker} from '@vue-spectrum/picker';
import {Provider} from '@vue-spectrum/provider';
import {ProgressBar, ProgressCircle} from '@vue-spectrum/progress';
import {Radio, RadioGroup} from '@vue-spectrum/radio';
import {SearchField} from '@vue-spectrum/searchfield';
import {StatusLight} from '@vue-spectrum/statuslight';
import {RangeSlider, Slider} from '@vue-spectrum/slider';
import {StepList} from '@vue-spectrum/steplist';
import {Switch} from '@vue-spectrum/switch';
import {Table} from '@vue-spectrum/table';
import {TagGroup} from '@vue-spectrum/tag';
import {Tabs} from '@vue-spectrum/tabs';
import {TextArea, TextField} from '@vue-spectrum/textfield';
import {Text} from '@vue-spectrum/text';
import {createToastQueue, ToastContainer} from '@vue-spectrum/toast';
import {Tooltip, TooltipTrigger} from '@vue-spectrum/tooltip';
import {Tree} from '@vue-spectrum/tree';
import {Content, Footer, Header, View} from '@vue-spectrum/view';
import {Well} from '@vue-spectrum/well';
import {theme as darkTheme} from '@vue-spectrum/theme-dark';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {theme as lightTheme} from '@vue-spectrum/theme-light';
import {VueDropZone as RacDropZone} from '../../../packages/vue-aria-components/src/components/VueDropZone';

describe('Vue migration primitives', () => {
  it('maps avatar DOM contract and size semantics to react parity', () => {
    let wrapper = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png'
      }
    });

    expect(wrapper.element.tagName).toBe('IMG');
    expect(wrapper.classes()).toContain('spectrum-Avatar');
    expect(wrapper.attributes('src')).toBe('https://example.com/avatar.png');
    expect(wrapper.attributes('alt')).toBe('');
    expect(wrapper.attributes('style')).toContain('height: var(--spectrum-global-dimension-avatar-size-100');
    expect(wrapper.attributes('style')).toContain('width: var(--spectrum-global-dimension-avatar-size-100');

    let disabled = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        isDisabled: true
      }
    });

    expect(disabled.classes()).toContain('spectrum-Avatar');
    expect(disabled.classes()).toContain('is-disabled');

    let sized = mount(Avatar, {
      props: {
        src: 'https://example.com/avatar.png',
        size: 'avatar-size-700'
      }
    });
    expect(sized.attributes('style')).toContain('height: var(--spectrum-global-dimension-avatar-size-700');
    expect(sized.attributes('style')).toContain('width: var(--spectrum-global-dimension-avatar-size-700');
  });

  it('renders badge variants and slot content', () => {
    let wrapper = mount(Badge, {
      props: {
        variant: 'positive'
      },
      slots: {
        default: 'Ready for review'
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Badge');
    expect(wrapper.classes()).toContain('spectrum-Badge--positive');
    expect(wrapper.attributes('role')).toBe('presentation');
    expect(wrapper.find('.spectrum-Badge-label').text()).toContain('Ready for review');
  });

  it('maps badge icon slot classes and icon sizing to react parity', () => {
    let wrapper = mount(Badge, {
      props: {
        variant: 'positive'
      },
      slots: {
        default: () => [
          h(CheckmarkCircle, {'aria-label': 'Done'}),
          'Licensed'
        ]
      }
    });

    expect(wrapper.attributes('role')).toBe('presentation');
    expect(wrapper.find('.spectrum-Badge-label').text()).toBe('Licensed');

    let icon = wrapper.get('svg');
    expect(icon.classes()).toContain('spectrum-Badge-icon');
    expect(icon.classes()).toContain('spectrum-Icon--sizeS');
  });

  it('applies provider theme classes and metadata for token variants', () => {
    let expressWrapper = mount(Provider, {
      props: {
        theme: expressTheme,
        scale: 'large'
      },
      slots: {
        default: () => 'Express shell'
      }
    });

    let expressRoot = expressWrapper.get('.vs-provider');
    expect(expressRoot.attributes('data-theme')).toBe('express');
    expect(expressRoot.classes()).toContain('spectrum');
    expect(expressRoot.classes()).toContain('express');
    expect(expressRoot.classes()).toContain('large');

    let lightWrapper = mount(Provider, {
      props: {
        theme: lightTheme
      },
      slots: {
        default: () => 'Light shell'
      }
    });

    expect(lightWrapper.get('.vs-provider').attributes('data-theme')).toBe('light');

    let darkWrapper = mount(Provider, {
      props: {
        theme: darkTheme,
        colorScheme: 'dark'
      },
      slots: {
        default: () => 'Dark shell'
      }
    });

    let darkRoot = darkWrapper.get('.vs-provider');
    expect(darkRoot.attributes('data-theme')).toBe('dark');
    expect(darkRoot.attributes('data-color-scheme')).toBe('dark');
  });

  it('warns when provider direction is nested with an opposite parent direction', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount({
      components: {Provider},
      template: `
        <Provider dir="ltr">
          <Provider dir="rtl">
            <div>Nested direction shell</div>
          </Provider>
        </Provider>
      `
    });

    await nextTick();
    expect(warn).toHaveBeenCalledWith('Language directions cannot be nested. rtl inside ltr.');
    warn.mockRestore();
  });

  it('renders well content and role-based aria labelling', () => {
    let wrapper = mount(Well, {
      props: {
        role: 'group'
      },
      attrs: {
        'aria-label': 'Migration block details',
        class: 'custom-well',
        style: {
          width: '300px'
        }
      },
      slots: {
        default: 'Migration block'
      }
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toContain('Migration block');
    expect(wrapper.classes()).toContain('spectrum-Well');
    expect(wrapper.classes()).toContain('custom-well');
    expect(wrapper.classes()).not.toContain('vs-spectrum-well');
    expect(wrapper.attributes('data-vac')).toBeUndefined();
    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-label')).toBe('Migration block details');
    expect((wrapper.element as HTMLElement).style.width).toBe('300px');
  });

  it('removes aria labels from well without a role', () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    let wrapper = mount(Well, {
      attrs: {
        'aria-label': 'Migration block details'
      },
      slots: {
        default: 'Migration block'
      }
    });

    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith('A labelled Well must have a role.');
    warn.mockRestore();
  });

  it('maps view element type and style props to react parity', () => {
    let wrapper = mount(View, {
      props: {
        elementType: 'section',
        width: 'single-line-width',
        height: 'size-500',
        backgroundColor: 'blue-400'
      },
      slots: {
        default: 'View content'
      }
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.attributes('style')).toContain('width: var(--spectrum-global-dimension-single-line-width');
    expect(wrapper.attributes('style')).toContain('height: var(--spectrum-global-dimension-size-500');
    expect(wrapper.attributes('style')).toContain('background-color: var(--spectrum-alias-background-color-blue-400');
    expect(wrapper.text()).toContain('View content');
  });

  it('maps header/content/footer semantic element defaults', () => {
    let header = mount(Header, {slots: {default: 'Header text'}});
    expect(header.element.tagName).toBe('HEADER');
    expect(header.text()).toBe('Header text');

    let content = mount(Content, {slots: {default: 'Main content'}});
    expect(content.element.tagName).toBe('SECTION');
    expect(content.text()).toBe('Main content');

    let footer = mount(Footer, {slots: {default: 'Footer text'}});
    expect(footer.element.tagName).toBe('FOOTER');
    expect(footer.text()).toBe('Footer text');
  });

  it('renders flex layout styles from props', () => {
    let wrapper = mount(Flex, {
      props: {
        direction: 'column',
        gap: 'size-200',
        justifyContent: 'space-between',
        alignItems: 'center',
        wrap: true
      },
      slots: {
        default: 'Flex content'
      }
    });

    let element = wrapper.element as HTMLElement;
    expect(wrapper.classes()).toContain('vs-flex');
    expect(element.style.display).toBe('flex');
    expect(element.style.flexDirection).toBe('column');
    expect(element.style.gap).toBe('16px');
    expect(element.style.justifyContent).toBe('space-between');
    expect(element.style.alignItems).toBe('center');
    expect(element.style.flexWrap).toBe('wrap');
  });

  it('renders grid layout styles and helper expressions', () => {
    let columns = repeat(2, minmax(0, '1fr'));
    let wrapper = mount(Grid, {
      props: {
        columns,
        gap: 'size-100'
      }
    });

    let element = wrapper.element as HTMLElement;
    expect(wrapper.classes()).toContain('vs-grid');
    expect(element.style.display).toBe('grid');
    expect(element.style.gridTemplateColumns).toContain('minmax(0, 1fr)');
    expect(element.style.gap).toBe('8px');
    expect(fitContent('240px')).toBe('fit-content(240px)');
  });

  it('maps inline alert DOM contract and variant class to react parity', () => {
    let wrapper = mount(InlineAlert, {
      props: {
        variant: 'notice'
      },
      slots: {
        default: () => [
          h('h3', {class: 'spectrum-InLineAlert-heading'}, 'Attention'),
          h('section', {class: 'spectrum-InLineAlert-content'}, 'Action required.')
        ]
      }
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('spectrum-InLineAlert');
    expect(wrapper.classes()).toContain('spectrum-FocusRing');
    expect(wrapper.classes()).toContain('spectrum-FocusRing-ring');
    expect(wrapper.classes()).toContain('spectrum-InLineAlert--notice');
    expect(wrapper.attributes('role')).toBe('alert');
    expect(wrapper.classes()).not.toContain('vs-inline-alert');
    expect(wrapper.attributes('data-vac')).toBeUndefined();
    expect(wrapper.attributes('aria-label')).toBeUndefined();
    expect(wrapper.get('.spectrum-InLineAlert-heading').element.tagName).toBe('H3');
    expect(wrapper.get('.spectrum-InLineAlert-content').element.tagName).toBe('SECTION');
  });

  it('maps inline alert icon contract for semantic variants', () => {
    let infoWrapper = mount(InlineAlert, {
      props: {
        variant: 'info'
      },
      slots: {
        default: () => [
          h('h3', {class: 'spectrum-InLineAlert-heading'}, 'Title'),
          h('section', {class: 'spectrum-InLineAlert-content'}, 'Content')
        ]
      }
    });

    let infoIcon = infoWrapper.get('.spectrum-InLineAlert-icon');
    expect(infoIcon.element.tagName.toLowerCase()).toBe('svg');
    expect(infoIcon.classes()).toContain('spectrum-Icon');
    expect(infoIcon.classes()).toContain('spectrum-UIIcon-InfoMedium');
    expect(infoIcon.attributes('aria-label')).toBe('Information');

    let negativeWrapper = mount(InlineAlert, {
      props: {
        variant: 'negative'
      },
      slots: {
        default: () => [
          h('h3', {class: 'spectrum-InLineAlert-heading'}, 'Title'),
          h('section', {class: 'spectrum-InLineAlert-content'}, 'Content')
        ]
      }
    });
    let negativeIcon = negativeWrapper.get('.spectrum-InLineAlert-icon');
    expect(negativeIcon.classes()).toContain('spectrum-UIIcon-AlertMedium');
    expect(negativeIcon.attributes('aria-label')).toBe('Error');
  });

  it('maps inline alert focus-ring class on focus-visible', async () => {
    let wrapper = mount(InlineAlert, {
      slots: {
        default: () => [
          h('h3', {class: 'spectrum-InLineAlert-heading'}, 'Title'),
          h('section', {class: 'spectrum-InLineAlert-content'}, 'Content')
        ]
      }
    });
    let element = wrapper.element as HTMLElement;
    let originalMatches = element.matches.bind(element);
    let matchesSpy = vi.spyOn(element, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return originalMatches(selector);
    });

    await wrapper.trigger('focus');
    expect(wrapper.classes()).toContain('focus-ring');
    await wrapper.trigger('blur');
    expect(wrapper.classes()).not.toContain('focus-ring');
    matchesSpy.mockRestore();
  });

  it('autofocuses inline alert when autoFocus is true', async () => {
    let wrapper = mount(InlineAlert, {
      attachTo: document.body,
      props: {
        autoFocus: true
      },
      slots: {
        default: () => [
          h('h3', {class: 'spectrum-InLineAlert-heading'}, 'Notice'),
          h('section', {class: 'spectrum-InLineAlert-content'}, 'Alert details')
        ]
      }
    });

    await nextTick();
    expect(wrapper.attributes('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(wrapper.element);
    wrapper.unmount();
  });

  it('maps illustrated message DOM contract and structure to react parity', () => {
    let wrapper = mount(IllustratedMessage, {
      slots: {
        default: () => [
          h('svg', {focusable: 'false'}),
          h('h3', {class: 'spectrum-IllustratedMessage-heading'}, 'Empty state'),
          h('section', {class: 'spectrum-IllustratedMessage-description'}, 'No migration tasks found.')
        ]
      }
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('flex');
    expect(wrapper.classes()).toContain('spectrum-IllustratedMessage');
    expect(wrapper.classes()).not.toContain('vs-illustrated-message');
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.attributes('data-vac')).toBeUndefined();
    expect(wrapper.get('.spectrum-IllustratedMessage-heading').element.tagName).toBe('H3');
    expect(wrapper.get('.spectrum-IllustratedMessage-description').element.tagName).toBe('SECTION');
    expect(wrapper.get('.spectrum-IllustratedMessage-heading').text()).toBe('Empty state');
    expect(wrapper.get('.spectrum-IllustratedMessage-description').text()).toBe('No migration tasks found.');

    let hidden = mount(IllustratedMessage, {
      attrs: {hidden: true}
    });
    expect(hidden.attributes('hidden')).toBeDefined();
  });

  it('supports illustrated message rendering with illustration only', () => {
    let wrapper = mount(IllustratedMessage, {
      slots: {
        default: () => h('svg', {'aria-label': 'No Results', role: 'img'})
      }
    });

    expect(wrapper.find('svg[aria-label=\"No Results\"]').exists()).toBe(true);
    expect(wrapper.find('.spectrum-IllustratedMessage-heading').exists()).toBe(false);
    expect(wrapper.find('.spectrum-IllustratedMessage-description').exists()).toBe(false);
  });

  it('renders icon variants with expected accessibility and classes', () => {
    let wrapper = mount(Icon, {
      props: {
        size: 'l'
      },
      attrs: {
        'aria-label': 'Direction'
      },
      slots: {
        default: () => h('svg', {viewBox: '0 0 24 24'}, [h('path', {d: 'M5 12h14'})])
      }
    });

    expect(wrapper.element.tagName).toBe('svg');
    expect(wrapper.classes()).toContain('spectrum-Icon');
    expect(wrapper.classes()).toContain('spectrum-Icon--sizeL');
    expect(wrapper.attributes('aria-label')).toBe('Direction');
    expect(wrapper.attributes('aria-hidden')).toBeUndefined();
    expect(wrapper.attributes('focusable')).toBe('false');
    expect(wrapper.attributes('role')).toBe('img');

    let unlabeled = mount(Icon, {
      slots: {
        default: () => h('svg', {viewBox: '0 0 24 24'}, [h('path', {d: 'M5 12h14'})])
      }
    });
    expect(unlabeled.attributes('aria-hidden')).toBe('true');

    let uiIcon = mount(UIIcon, {
      attrs: {
        'aria-label': 'Status'
      },
      slots: {
        default: () => h('svg', {viewBox: '0 0 24 24'}, [h('circle', {cx: '12', cy: '12', r: '8'})])
      }
    });
    expect(uiIcon.element.tagName).toBe('svg');
    expect(uiIcon.classes()).toContain('spectrum-Icon');
    expect(uiIcon.attributes('aria-label')).toBe('Status');
    expect(uiIcon.attributes('aria-hidden')).toBeUndefined();

    let illustration = mount(Illustration, {
      slots: {
        default: () => h('svg', {viewBox: '0 0 24 24'}, [h('rect', {x: '4', y: '4', width: '16', height: '16'})])
      }
    });
    expect(illustration.element.tagName).toBe('svg');
    expect(illustration.attributes('aria-hidden')).toBeUndefined();
    expect(illustration.attributes('role')).toBeUndefined();

    let labelledIllustration = mount(Illustration, {
      attrs: {
        'aria-label': 'No Results'
      },
      slots: {
        default: () => h('svg', {viewBox: '0 0 24 24'}, [h('rect', {x: '4', y: '4', width: '16', height: '16'})])
      }
    });
    expect(labelledIllustration.attributes('role')).toBe('img');
    expect(labelledIllustration.attributes('aria-label')).toBe('No Results');
  });

  it('renders icon size from provider scale when explicit size is not passed', () => {
    let wrapper = mount(Provider, {
      props: {
        scale: 'large'
      },
      slots: {
        default: () => h(Icon, null, {
          default: () => h('svg', {viewBox: '0 0 24 24'}, [h('path', {d: 'M5 12h14'})])
        })
      }
    });

    let icon = wrapper.get('svg');
    expect(icon.classes()).toContain('spectrum-Icon');
    expect(icon.classes()).toContain('spectrum-Icon--sizeL');
  });

  it('renders vue workflow icon markup without react wrappers', () => {
    let wrapper = mount(EditWorkflow, {
      props: {
        size: 'S',
        label: 'Edit item'
      }
    });

    expect(wrapper.element.tagName).toBe('svg');
    expect(wrapper.classes()).toContain('spectrum-Icon');
    expect(wrapper.classes()).toContain('spectrum-Icon--sizeS');
    expect(wrapper.attributes('aria-label')).toBe('Edit item');
    expect(wrapper.find('path').exists()).toBe(true);
  });

  it('renders image src/alt and handles image load errors', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    let wrapper = mount(Image, {
      props: {
        src: 'https://example.com/image.png',
        alt: 'Preview',
        objectFit: 'contain',
        width: '500px',
        height: '500px'
      }
    });

    let image = wrapper.get('img');
    expect(image.attributes('src')).toBe('https://example.com/image.png');
    expect(image.attributes('alt')).toBe('Preview');
    expect((image.element as HTMLImageElement).style.objectFit).toBe('contain');
    expect(wrapper.attributes('style')).toContain('overflow: hidden');
    expect(wrapper.attributes('style')).toContain('width: 500px');
    expect(wrapper.attributes('style')).toContain('height: 500px');

    let onError = vi.fn();
    let fallback = mount(Image, {
      props: {
        src: 'https://example.com/hidden.png',
        alt: 'Fallback image',
        onError
      }
    });

    await fallback.get('img').trigger('error');
    expect(onError).toHaveBeenCalledTimes(1);

    mount(Image, {
      props: {
        src: 'https://example.com/missing-alt.png'
      }
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('The `alt` prop was not provided to an image.'));
    warn.mockRestore();
  });

  it('maps divider element semantics and size classes to react parity', () => {
    let horizontal = mount(Divider);
    expect(horizontal.element.tagName).toBe('HR');
    expect(horizontal.classes()).toContain('spectrum-Rule');
    expect(horizontal.classes()).toContain('spectrum-Rule--large');
    expect(horizontal.classes()).toContain('spectrum-Rule--horizontal');
    expect(horizontal.attributes('role')).toBeUndefined();
    expect(horizontal.attributes('aria-orientation')).toBeUndefined();

    let vertical = mount(Divider, {
      props: {
        orientation: 'vertical',
        size: 'S'
      }
    });
    expect(vertical.element.tagName).toBe('DIV');
    expect(vertical.classes()).toContain('spectrum-Rule--small');
    expect(vertical.classes()).toContain('spectrum-Rule--vertical');
    expect(vertical.attributes('role')).toBe('separator');
    expect(vertical.attributes('aria-orientation')).toBe('vertical');
  });

  it('maps form element semantics and native validation toggle to react parity', () => {
    let wrapper = mount(Form, {
      props: {
        labelAlign: 'end',
        labelPosition: 'side'
      },
      attrs: {
        action: '/submit',
        method: 'post'
      },
      slots: {
        default: '<div />'
      }
    });

    expect(wrapper.element.tagName).toBe('FORM');
    expect(wrapper.classes()).toContain('spectrum-Form');
    expect(wrapper.classes()).toContain('spectrum-Form--positionSide');
    expect(wrapper.classes()).not.toContain('spectrum-Form--positionTop');
    expect(wrapper.attributes('action')).toBe('/submit');
    expect(wrapper.attributes('method')).toBe('post');
    expect(wrapper.attributes('novalidate')).toBeDefined();

    let native = mount(Form, {
      props: {
        validationBehavior: 'native'
      },
      slots: {
        default: '<div />'
      }
    });

    expect(native.classes()).toContain('spectrum-Form--positionTop');
    expect(native.attributes('novalidate')).toBeUndefined();
  });

  it('renders label content and required indicator', () => {
    let wrapper = mount(Label, {
      props: {
        forId: 'field-name',
        required: true,
        width: '80px'
      },
      slots: {
        default: 'Name'
      }
    });

    expect(wrapper.attributes('for')).toBe('field-name');
    expect(wrapper.text()).toContain('Name');
    expect(wrapper.find('.spectrum-FieldLabel-requiredIcon').exists()).toBe(true);
    expect(wrapper.classes()).toContain('spectrum-FieldLabel');
    expect(wrapper.get('.spectrum-FieldLabel-requiredIcon').attributes('aria-hidden')).toBe('true');
    expect((wrapper.element as HTMLElement).style.width).toBe('80px');
  });

  it('maps help text disabled/invalid states and field aria wiring', () => {
    let helpText = mount(HelpText, {
      props: {
        description: 'Enter a value',
        errorMessage: 'Required',
        isInvalid: true,
        isDisabled: true
      }
    });

    expect(helpText.classes()).toContain('spectrum-HelpText');
    expect(helpText.classes()).toContain('is-disabled');
    expect(helpText.classes()).toContain('is-invalid');
    expect(helpText.find('.spectrum-HelpText-validationIcon').exists()).toBe(true);

    let field = mount(Field, {
      props: {
        label: 'Field label',
        description: 'Description'
      },
      slots: {
        default: '<input />'
      }
    });
    expect(field.attributes('aria-labelledby')).toBeTruthy();
  });

  it('maps labeled value DOM contract and list formatting to react parity', () => {
    let wrapper = mount(LabeledValue, {
      props: {
        label: 'Libraries',
        value: ['Vue Spectrum', 'React Spectrum']
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Field');
    expect(wrapper.classes()).toContain('spectrum-LabeledValue');
    expect(wrapper.classes()).toContain('spectrum-Field--positionTop');
    expect(wrapper.get('.spectrum-FieldLabel').text()).toBe('Libraries');
    let value = wrapper.get('.spectrum-Field-field').text();
    expect(value).toContain('Vue Spectrum');
    expect(value).toContain('React Spectrum');
  });

  it('maps labeled value width, side-label, and contextual help classes to react parity', () => {
    let wrapper = mount(LabeledValue, {
      props: {
        contextualHelp: h('button', {type: 'button'}, 'Help'),
        label: 'Count',
        labelAlign: 'end',
        labelPosition: 'side',
        value: {start: 10, end: 20},
        width: '300px'
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Field--positionSide');
    expect(wrapper.classes()).toContain('spectrum-Field--alignEnd');
    expect(wrapper.classes()).toContain('spectrum-Field--hasContextualHelp');
    expect(wrapper.find('.spectrum-Field-contextualHelp').exists()).toBe(true);
    expect((wrapper.element as HTMLElement).style.width).toBe('300px');
    expect(wrapper.get('.spectrum-Field-field').text()).toContain('10');
    expect(wrapper.get('.spectrum-Field-field').text()).toContain('20');
  });

  it('renders text element, variant, and emphasis classes', () => {
    let wrapper = mount(Text, {
      props: {
        elementType: 'span',
        variant: 'detail',
        emphasized: true
      },
      slots: {
        default: 'Detail copy'
      }
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('vs-text--detail');
    expect(wrapper.classes()).toContain('is-emphasized');
    expect(wrapper.text()).toContain('Detail copy');
  });

  it('emits click from button', async () => {
    let wrapper = mount(Button, {
      slots: {default: 'Press me'}
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('maps button state classes and spectrum data attributes', async () => {
    let wrapper = mount(Button, {
      props: {
        variant: 'overBackground'
      },
      slots: {
        default: 'Stateful button'
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Button');
    expect(wrapper.attributes('data-react-aria-pressable')).toBe('true');
    expect(wrapper.attributes('data-variant')).toBe('primary');
    expect(wrapper.attributes('data-style')).toBe('outline');
    expect(wrapper.attributes('data-static-color')).toBe('white');
    expect(wrapper.attributes('tabindex')).toBe('0');

    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('is-hovered');
    await wrapper.trigger('mouseleave');
    expect(wrapper.classes()).not.toContain('is-hovered');

    await wrapper.trigger('pointerdown', {button: 0});
    expect(wrapper.classes()).toContain('is-active');
    expect(wrapper.attributes('style')).toContain('user-select: none');
    await wrapper.trigger('pointerup');
    expect(wrapper.classes()).not.toContain('is-active');
    expect(wrapper.attributes('style')).toBeUndefined();

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
    await wrapper.trigger('focus');
    expect(wrapper.classes()).toContain('focus-ring');

    await wrapper.trigger('pointerdown', {button: 0});
    expect(wrapper.classes()).not.toContain('focus-ring');
  });

  it('keeps button focus-ring state class style overrides wired for parity', () => {
    let cssPath = resolve(process.cwd(), '../../packages/@vue-spectrum/button/src/stateClassOverrides.css');
    let css = readFileSync(cssPath, 'utf8');

    expect(css).toContain(".spectrum-FocusRing.focus-ring:after");
    expect(css).toContain(".spectrum-Button.focus-ring[data-style='fill']");
    expect(css).toContain('--spectrum-button-color-key-focus');
  });

  it('keeps native disabled button attrs aligned with react', () => {
    let wrapper = mount(Button, {
      props: {
        isDisabled: true
      },
      slots: {
        default: 'Disabled button'
      }
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-disabled')).toBeUndefined();
    expect(wrapper.attributes('data-disabled')).toBeUndefined();
    expect(wrapper.attributes('tabindex')).toBeUndefined();
    expect(wrapper.attributes('data-react-aria-pressable')).toBe('true');
  });

  it('marks pending native button as aria-disabled without disabled attr', () => {
    let wrapper = mount(Button, {
      props: {
        isPending: true
      },
      slots: {
        default: 'Pending button'
      }
    });

    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('disabled')).toBeUndefined();
    expect(wrapper.attributes('tabindex')).toBe('0');
    expect(wrapper.attributes('data-react-aria-pressable')).toBe('true');
  });

  it('maps action button DOM contract, classes, and keyboard focus-ring parity', async () => {
    let wrapper = mount(ActionButton, {
      props: {
        isQuiet: true,
        staticColor: 'white'
      },
      slots: {
        default: 'Action'
      }
    });

    expect(wrapper.get('.spectrum-ActionButton-label').text()).toBe('Action');
    expect(wrapper.classes()).toContain('spectrum-ActionButton');
    expect(wrapper.classes()).toContain('spectrum-BaseButton');
    expect(wrapper.classes()).toContain('i18nFontFamily');
    expect(wrapper.classes()).toContain('spectrum-FocusRing');
    expect(wrapper.classes()).toContain('spectrum-FocusRing-ring');
    expect(wrapper.classes()).toContain('spectrum-ActionButton--quiet');
    expect(wrapper.classes()).toContain('spectrum-ActionButton--staticColor');
    expect(wrapper.classes()).toContain('spectrum-ActionButton--staticWhite');
    expect(wrapper.attributes('data-react-aria-pressable')).toBe('true');
    expect(wrapper.attributes('tabindex')).toBe('0');
    expect(wrapper.attributes('data-vac')).toBeUndefined();

    await wrapper.trigger('pointerdown', {button: 0});
    expect(wrapper.classes()).toContain('is-active');
    expect(wrapper.attributes('style')).toContain('user-select: none');
    await wrapper.trigger('pointerup');
    expect(wrapper.classes()).not.toContain('is-active');
    expect(wrapper.attributes('style')).toBeUndefined();

    window.dispatchEvent(new MouseEvent('mousedown'));
    await wrapper.trigger('focus');
    expect(wrapper.classes()).not.toContain('focus-ring');

    await wrapper.trigger('keydown', {key: ' ', code: 'Space', keyCode: 32});
    expect(wrapper.classes()).toContain('focus-ring');
    expect(wrapper.classes()).toContain('is-active');
    await wrapper.trigger('keyup', {key: ' ', code: 'Space', keyCode: 32});
    expect(wrapper.classes()).not.toContain('is-active');
    expect(wrapper.classes()).toContain('focus-ring');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('removes href and blocks click when pending anchor button', async () => {
    let wrapper = mount(Button, {
      props: {
        elementType: 'a',
        href: '//example.com',
        isPending: true
      },
      slots: {
        default: 'Pending link'
      }
    });

    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('emits toggle button model updates and selected wiring', async () => {
    let wrapper = mount(ToggleButton, {
      props: {
        modelValue: true
      },
      slots: {
        default: 'Toggle me'
      }
    });

    expect(wrapper.classes()).toContain('spectrum-ActionButton');
    expect(wrapper.classes()).toContain('spectrum-BaseButton');
    expect(wrapper.classes()).toContain('i18nFontFamily');
    expect(wrapper.find('.spectrum-ActionButton-label').text()).toBe('Toggle me');
    expect(wrapper.attributes('aria-pressed')).toBe('true');
    expect(wrapper.classes()).toContain('is-selected');
    expect(wrapper.attributes('data-react-aria-pressable')).toBe('true');
    expect(wrapper.attributes('data-vac')).toBeUndefined();

    await wrapper.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('change')?.[0]).toEqual([false]);
  });

  it('maps logic button variant class and disabled semantics', async () => {
    let neutral = mount(LogicButton, {
      slots: {
        default: 'Neutral'
      }
    });

    expect(neutral.classes()).toContain('spectrum-LogicButton');
    expect(neutral.classes()).toContain('spectrum-BaseButton');
    expect(neutral.classes()).toContain('i18nFontFamily');
    expect(neutral.classes()).not.toContain('spectrum-LogicButton--and');
    expect(neutral.find('.spectrum-Button-label').text()).toBe('Neutral');
    expect(neutral.attributes('data-react-aria-pressable')).toBe('true');
    expect(neutral.attributes('data-vac')).toBeUndefined();

    let enabled = mount(LogicButton, {
      props: {
        variant: 'and'
      },
      slots: {
        default: 'Enabled'
      }
    });

    expect(enabled.classes()).toContain('spectrum-LogicButton');
    expect(enabled.classes()).toContain('spectrum-LogicButton--and');
    expect(enabled.find('.spectrum-Button-label').text()).toBe('Enabled');

    await enabled.trigger('click');
    expect(enabled.emitted('click')).toHaveLength(1);

    let disabled = mount(LogicButton, {
      props: {
        variant: 'or',
        isDisabled: true
      },
      slots: {
        default: 'Disabled'
      }
    });

    expect(disabled.classes()).toContain('spectrum-LogicButton--or');
    expect(disabled.classes()).toContain('is-disabled');
    expect(disabled.attributes('aria-disabled')).toBeUndefined();
    expect(disabled.attributes('disabled')).toBeDefined();
    expect(disabled.attributes('data-react-aria-pressable')).toBe('true');

    await disabled.trigger('click');
    expect(disabled.emitted('click')).toBeUndefined();
  });

  it('maps button group to Spectrum classes and child button slots', async () => {
    let wrapper = mount(ButtonGroup, {
      props: {
        orientation: 'vertical',
        align: 'end',
        isDisabled: true
      },
      slots: {
        default: () => [
          h(Button, {variant: 'primary'}, {default: () => 'First'}),
          h(Button, {variant: 'secondary'}, {default: () => 'Second'})
        ]
      }
    });

    expect(wrapper.classes()).toContain('spectrum-ButtonGroup');
    expect(wrapper.classes()).toContain('spectrum-ButtonGroup--vertical');
    expect(wrapper.classes()).toContain('spectrum-ButtonGroup--alignEnd');

    let buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].classes()).toContain('spectrum-ButtonGroup-Button');
    expect(buttons[1].classes()).toContain('spectrum-ButtonGroup-Button');
    expect(buttons[0].attributes('disabled')).toBeDefined();
    expect(buttons[1].attributes('disabled')).toBeDefined();

    await buttons[0].trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('switches horizontal button group to vertical on overflow and back on resize', async () => {
    let groupWidth = 88;
    let originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    let originalOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
    let offsetWidthSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function getOffsetWidth(this: HTMLElement) {
      if (this.classList.contains('spectrum-ButtonGroup')) {
        return groupWidth;
      }

      if (this.tagName === 'BUTTON') {
        return 30;
      }

      return originalOffsetWidth?.get ? originalOffsetWidth.get.call(this) : 0;
    });
    let offsetLeftSpy = vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(function getOffsetLeft(this: HTMLElement) {
      if (this.textContent?.includes('Button1')) {
        return 0;
      }

      if (this.textContent?.includes('Button2')) {
        return 30;
      }

      if (this.textContent?.includes('Button3')) {
        return 60;
      }

      return originalOffsetLeft?.get ? originalOffsetLeft.get.call(this) : 0;
    });

    try {
      let wrapper = mount(ButtonGroup, {
        slots: {
          default: () => [
            h(Button, {variant: 'primary'}, {default: () => 'Button1'}),
            h(Button, {variant: 'primary'}, {default: () => 'Button2'}),
            h(Button, {variant: 'primary'}, {default: () => 'Button3'})
          ]
        }
      });

      await nextTick();
      expect(wrapper.classes()).toContain('spectrum-ButtonGroup--vertical');

      groupWidth = 100;
      window.dispatchEvent(new Event('resize'));
      await nextTick();
      expect(wrapper.classes()).not.toContain('spectrum-ButtonGroup--vertical');
    } finally {
      offsetWidthSpy.mockRestore();
      offsetLeftSpy.mockRestore();
    }
  });

  it('maps actiongroup selected and hovered states with aria wiring', async () => {
    let wrapper = mount(ActionGroup, {
      props: {
        items: ['One', 'Two'],
        modelValue: ['One'],
        selectionMode: 'multiple'
      },
      attrs: {
        'aria-label': 'Row actions'
      }
    });

    let items = wrapper.findAll('button.vs-action-group__item');
    expect(items).toHaveLength(2);
    expect(items[0].classes()).toContain('is-selected');
    expect(wrapper.get('.vs-action-group').attributes('aria-label')).toBe('Row actions');
    await items[1].trigger('mouseenter');
    expect(items[1].classes()).toContain('is-hovered');
    await items[1].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Two']);
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['One', 'Two']);
    let emittedChange = wrapper.emitted('change')?.[0]?.[0] as unknown;
    expect(emittedChange).toBeInstanceOf(Set);
    expect(Array.from(emittedChange as Set<string>)).toEqual(['One', 'Two']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['One', 'Two']);
    expect(wrapper.get('.vs-action-group__hidden-marker').attributes('hidden')).toBeDefined();
  });

  it('accepts actiongroup disabledKeys as a Set and blocks disabled actions', async () => {
    let wrapper = mount(ActionGroup, {
      props: {
        items: ['One', 'Two'],
        selectionMode: 'multiple',
        disabledKeys: new Set(['Two'])
      }
    });

    let items = wrapper.findAll('button.vs-action-group__item');
    expect(items).toHaveLength(2);
    expect(items[1].attributes('disabled')).toBeDefined();
    expect(items[1].attributes('aria-disabled')).toBe('true');

    await items[1].trigger('click');
    expect(wrapper.emitted('action')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('selectionChange')).toBeUndefined();

    await items[0].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['One']);
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['One']);
    let emittedChange = wrapper.emitted('change')?.[0]?.[0] as unknown;
    expect(emittedChange).toBeInstanceOf(Set);
    expect(Array.from(emittedChange as Set<string>)).toEqual(['One']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['One']);
  });

  it('accepts actiongroup modelValue as a Set iterable in multiple selection mode', async () => {
    let wrapper = mount(ActionGroup, {
      props: {
        items: ['One', 'Two'],
        selectionMode: 'multiple',
        modelValue: new Set(['One'])
      }
    });

    let items = wrapper.findAll('button.vs-action-group__item');
    expect(items).toHaveLength(2);
    expect(items[0].classes()).toContain('is-selected');
    expect(items[0].attributes('aria-pressed')).toBe('true');

    await items[1].trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['One', 'Two']);
    let emittedChange = wrapper.emitted('change')?.[0]?.[0] as unknown;
    expect(emittedChange).toBeInstanceOf(Set);
    expect(Array.from(emittedChange as Set<string>)).toEqual(['One', 'Two']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['One', 'Two']);
  });

  it('collapses overflowing action group items into a menu trigger', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    let originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    let getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect() {
      if (this.classList.contains('vs-action-group__wrapper')) {
        return {
          width: 170,
          height: 40,
          top: 0,
          right: 170,
          bottom: 40,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.classList.contains('vs-action-group__overflow-measure')) {
        return {
          width: 48,
          height: 30,
          top: 0,
          right: 48,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.getAttribute('data-vs-action-group-item') === 'true') {
        return {
          width: 72,
          height: 30,
          top: 0,
          right: 72,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      return originalGetBoundingClientRect.call(this);
    });

    try {
      let wrapper = mount(ActionGroup, {
        props: {
          items: ['One', 'Two', 'Three'],
          overflowMode: 'collapse'
        },
        attrs: {
          'aria-label': 'Row actions'
        }
      });

      await nextTick();
      await nextTick();

      expect(wrapper.findAll('[data-vs-action-group-item="true"]')).toHaveLength(1);
      expect(wrapper.find('[data-vs-action-group-overflow-trigger="true"]').exists()).toBe(true);

      let overflowButton = wrapper.get('[data-vs-action-group-overflow-trigger="true"]');
      await overflowButton.trigger('click');
      expect(wrapper.findAll('.vs-action-group__overflow-menu .spectrum-Menu-item')).toHaveLength(2);

      let overflowItems = wrapper.findAll('.vs-action-group__overflow-menu .spectrum-Menu-item');
      await overflowItems[0].trigger('click');
      expect(wrapper.emitted('action')?.[0]).toEqual(['Two']);
    } finally {
      getBoundingClientRectSpy.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('supports overflow menu keyboard navigation and dismiss lifecycle parity', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    let originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    let getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect() {
      if (this.classList.contains('vs-action-group__wrapper')) {
        return {
          width: 170,
          height: 40,
          top: 0,
          right: 170,
          bottom: 40,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.classList.contains('vs-action-group__overflow-measure')) {
        return {
          width: 48,
          height: 30,
          top: 0,
          right: 48,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.getAttribute('data-vs-action-group-item') === 'true') {
        return {
          width: 72,
          height: 30,
          top: 0,
          right: 72,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      return originalGetBoundingClientRect.call(this);
    });

    try {
      let wrapper = mount(ActionGroup, {
        attachTo: document.body,
        props: {
          items: ['One', 'Two', 'Three'],
          overflowMode: 'collapse'
        }
      });

      await nextTick();
      await nextTick();

      let overflowButton = wrapper.get('[data-vs-action-group-overflow-trigger="true"]');
      overflowButton.element.focus();
      await overflowButton.trigger('keydown', {key: 'ArrowDown'});
      await nextTick();

      let overflowItems = wrapper.findAll('.vs-action-group__overflow-menu button[role="menuitem"]');
      expect(overflowItems).toHaveLength(2);
      expect(document.activeElement).toBe(overflowItems[0].element);

      await overflowItems[0].trigger('keydown', {key: 'ArrowDown'});
      await nextTick();
      overflowItems = wrapper.findAll('.vs-action-group__overflow-menu button[role="menuitem"]');
      expect(document.activeElement).toBe(overflowItems[1].element);

      document.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      await nextTick();
      expect(wrapper.find('.vs-action-group__overflow-menu').exists()).toBe(false);

      await overflowButton.trigger('keydown', {key: 'ArrowUp'});
      await nextTick();
      overflowItems = wrapper.findAll('.vs-action-group__overflow-menu button[role="menuitem"]');
      expect(document.activeElement).toBe(overflowItems[overflowItems.length - 1].element);

      await overflowItems[overflowItems.length - 1].trigger('keydown', {key: 'Escape'});
      await nextTick();
      expect(wrapper.find('.vs-action-group__overflow-menu').exists()).toBe(false);
      expect(document.activeElement).toBe(overflowButton.element);
    } finally {
      getBoundingClientRectSpy.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('uses icon-only visible actions when collapse overflows and icon slots are provided', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    let originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    let getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect() {
      if (this.classList.contains('vs-action-group__wrapper')) {
        return {
          width: 170,
          height: 40,
          top: 0,
          right: 170,
          bottom: 40,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.classList.contains('vs-action-group__overflow-measure')) {
        return {
          width: 48,
          height: 30,
          top: 0,
          right: 48,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.getAttribute('data-vs-action-group-item') === 'true') {
        return {
          width: 72,
          height: 30,
          top: 0,
          right: 72,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      return originalGetBoundingClientRect.call(this);
    });

    try {
      let wrapper = mount(ActionGroup, {
        props: {
          buttonLabelBehavior: 'collapse',
          items: ['Edit', 'Copy', 'Delete'],
          overflowMode: 'collapse'
        },
        slots: {
          item: ({item}: {item: string}) => [
            h(EditWorkflow),
            h('span', {class: 'spectrum-ActionButton-label'}, item)
          ]
        }
      });

      await nextTick();
      await nextTick();

      let visibleItems = wrapper.findAll('[data-vs-action-group-item="true"]');
      expect(visibleItems).toHaveLength(1);
      expect(visibleItems[0].classes()).toContain('spectrum-ActionGroup-item--iconOnly');
      expect(wrapper.find('[data-vs-action-group-overflow-trigger="true"]').exists()).toBe(true);
    } finally {
      getBoundingClientRectSpy.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('collapses all action items when overflow occurs in selection mode', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});

    let originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    let getBoundingClientRectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect() {
      if (this.classList.contains('vs-action-group__wrapper')) {
        return {
          width: 160,
          height: 40,
          top: 0,
          right: 160,
          bottom: 40,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.classList.contains('vs-action-group__overflow-measure')) {
        return {
          width: 48,
          height: 30,
          top: 0,
          right: 48,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      if (this.getAttribute('data-vs-action-group-item') === 'true') {
        return {
          width: 72,
          height: 30,
          top: 0,
          right: 72,
          bottom: 30,
          left: 0,
          x: 0,
          y: 0,
          toJSON: () => ({})
        } as DOMRect;
      }

      return originalGetBoundingClientRect.call(this);
    });

    try {
      let wrapper = mount(ActionGroup, {
        props: {
          items: ['One', 'Two', 'Three'],
          overflowMode: 'collapse',
          selectionMode: 'multiple'
        }
      });

      await nextTick();
      await nextTick();

      expect(wrapper.findAll('[data-vs-action-group-item="true"]')).toHaveLength(0);
      expect(wrapper.find('[data-vs-action-group-overflow-trigger="true"]').exists()).toBe(true);
    } finally {
      getBoundingClientRectSpy.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('preserves actionbar action key casing and disabled key mapping', async () => {
    let wrapper = mount(ActionBar, {
      props: {
        selectedItemCount: 1,
        items: ['Edit', 'Copy'],
        disabledKeys: new Set(['edit'])
      }
    });

    let actionButtons = wrapper.findAll('button.vs-action-group__item');
    expect(actionButtons).toHaveLength(2);
    expect(actionButtons[0].attributes('disabled')).toBeDefined();

    await actionButtons[1].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Copy']);
  });

  it('renders actionbar item slot with workflow icon content', () => {
    let wrapper = mount(ActionBar, {
      props: {
        selectedItemCount: 1,
        items: ['Edit']
      },
      slots: {
        item: ({item}: {item: string}) => [
          h(EditWorkflow),
          h('span', {class: 'spectrum-ActionButton-label'}, item)
        ]
      }
    });

    let actionButton = wrapper.get('button.vs-action-group__item');
    expect(actionButton.find('svg.spectrum-Icon').exists()).toBe(true);
    expect(actionButton.find('.spectrum-ActionButton-label').text()).toBe('Edit');
  });

  it('maps breadcrumbs hovered/focus-ring/disabled states', async () => {
    let wrapper = mount(Breadcrumbs, {
      props: {
        items: ['Home', 'Library', 'Current'],
        current: 'Current'
      }
    });

    let links = wrapper.findAll('button.vs-breadcrumbs__link');
    expect(links).toHaveLength(2);
    await links[0].trigger('mouseenter');
    expect(links[0].classes()).toContain('is-hovered');
    await links[0].trigger('focus');
    expect(links[0].classes()).toContain('focus-ring');
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumbs');

    let disabled = mount(Breadcrumbs, {
      props: {
        items: ['One', 'Two'],
        disabled: true
      }
    });
    expect(disabled.find('.spectrum-Breadcrumbs').classes()).toContain('is-disabled');

    let withLinks = mount(Breadcrumbs, {
      props: {
        isMultiline: true,
        items: [
          {key: 'home', label: 'Home', href: 'https://example.com/home'},
          {key: 'current', label: 'Current'}
        ],
        showRoot: true,
        size: 'S'
      }
    });

    let breadcrumbRoot = withLinks.find('.spectrum-Breadcrumbs');
    expect(breadcrumbRoot.classes()).toContain('spectrum-Breadcrumbs--small');
    expect(breadcrumbRoot.classes()).toContain('spectrum-Breadcrumbs--multiline');
    expect(breadcrumbRoot.classes()).toContain('spectrum-Breadcrumbs--showRoot');

    let anchor = withLinks.get('a.vs-breadcrumbs__link');
    expect(anchor.attributes('href')).toBe('https://example.com/home');
    await anchor.trigger('click');
    expect(withLinks.emitted('action')?.[0]).toEqual(['home']);
  });

  it('maps link hovered and focus-ring classes', async () => {
    let wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        variant: 'secondary'
      },
      slots: {
        default: 'Open docs'
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Link--secondary');
    expect(wrapper.attributes('tabindex')).toBe('0');
    expect(wrapper.attributes('data-react-aria-pressable')).toBe('true');
    expect(wrapper.attributes('role')).toBeUndefined();
    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('is-hovered');

    let noHref = mount(Link, {
      slots: {
        default: 'Standalone link'
      }
    });
    expect(noHref.element.tagName).toBe('SPAN');
    expect(noHref.attributes('role')).toBe('link');
    expect(noHref.attributes('tabindex')).toBe('0');
    expect(noHref.attributes('data-react-aria-pressable')).toBe('true');

    let childAnchor = mount(Link, {
      slots: {
        default: () => h('a', {
          href: '//example.com',
          onClick: (event: MouseEvent) => {
            event.preventDefault();
          },
          target: '_self'
        }, 'This is a React Spectrum Link')
      }
    });

    expect(childAnchor.element.tagName).toBe('A');
    expect(childAnchor.classes()).toContain('spectrum-Link');
    expect(childAnchor.attributes('href')).toBe('//example.com');
    expect(childAnchor.attributes('target')).toBe('_self');
    expect(childAnchor.attributes('tabindex')).toBe('0');
    expect(childAnchor.attributes('data-react-aria-pressable')).toBe('true');
    expect(childAnchor.attributes('role')).toBeUndefined();

    await childAnchor.trigger('click');
    let clickEvent = childAnchor.emitted('click')?.[0]?.[0] as MouseEvent;
    expect(clickEvent?.defaultPrevented).toBe(true);
  });

  it('maps meter variant state classes', () => {
    let warning = mount(Meter, {
      props: {
        label: 'Meter',
        value: 60,
        variant: 'warning'
      }
    });
    expect(warning.classes()).toContain('spectrum-BarLoader');
    expect(warning.classes()).toContain('is-warning');
    expect(warning.attributes('role')).toBe('meter progressbar');
    expect(warning.classes()).not.toContain('vs-meter');
    expect(warning.attributes('data-vac')).toBeUndefined();

    let positive = mount(Meter, {
      props: {
        label: 'Meter',
        value: 90,
        variant: 'positive'
      }
    });
    expect(positive.classes()).toContain('is-positive');

    let formatted = mount(Meter, {
      props: {
        formatOptions: {currency: 'JPY', style: 'currency'},
        label: 'Meter',
        showValueLabel: true,
        value: 25
      }
    });
    expect(formatted.find('.spectrum-BarLoader-percentage').text()).not.toContain('%');

    let explicitValueLabel = mount(Meter, {
      props: {
        label: 'Meter',
        showValueLabel: true,
        value: 25,
        valueLabel: '1 of 4'
      }
    });
    expect(explicitValueLabel.find('.spectrum-BarLoader-percentage').text()).toBe('1 of 4');

    let rawValues = mount(Meter, {
      props: {
        label: 'Meter',
        maxValue: 2147483648,
        value: 715827883
      }
    });
    expect(rawValues.attributes('aria-valuemax')).toBe('2147483648');
    expect(rawValues.find('.spectrum-BarLoader-fill').attributes('style')).toContain('width: 33%');

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mount(Meter, {
      props: {
        label: null,
        value: 10
      }
    });
    expect(warn).toHaveBeenCalledWith('If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility');
    warn.mockRestore();
  });

  it('maps meter aria composition, percent formatting, and DOM prop passthrough to react parity', () => {
    let externalLabelId = 'meter-external-label';
    let wrapper = mount(Meter, {
      props: {
        formatOptions: {style: 'percent'},
        label: 'Meter',
        value: 25
      },
      attrs: {
        'aria-label': 'Storage meter',
        'aria-labelledby': externalLabelId,
        'aria-describedby': 'meter-help',
        'data-testid': 'meter-test'
      }
    });

    let labelledByIds = wrapper.attributes('aria-labelledby')?.split(/\s+/) ?? [];
    expect(wrapper.attributes('data-testid')).toBe('meter-test');
    expect(wrapper.attributes('aria-describedby')).toBe('meter-help');
    expect(wrapper.attributes('aria-label')).toBe('Storage meter');
    expect(labelledByIds).toContain(externalLabelId);
    expect(labelledByIds).toContain(wrapper.get('.spectrum-BarLoader-label').attributes('id'));
    expect(labelledByIds).toContain(wrapper.attributes('id'));
    expect(wrapper.find('.spectrum-BarLoader-percentage').text()).toContain('25');
    expect(wrapper.find('.spectrum-BarLoader-percentage').text()).not.toContain('2500');

    let noVisibleLabel = mount(Meter, {
      props: {
        label: null,
        value: 20
      },
      attrs: {
        'aria-label': 'Storage meter',
        'aria-labelledby': externalLabelId
      }
    });
    let noVisibleLabelledByIds = noVisibleLabel.attributes('aria-labelledby')?.split(/\s+/) ?? [];
    expect(noVisibleLabelledByIds).toContain(externalLabelId);
    expect(noVisibleLabelledByIds).toContain(noVisibleLabel.attributes('id'));
  });

  it('maps statuslight variant and disabled classes', () => {
    let wrapper = mount(StatusLight, {
      props: {
        variant: 'positive',
        isDisabled: true
      },
      slots: {
        default: 'Ready'
      }
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('spectrum-StatusLight');
    expect(wrapper.classes()).toContain('spectrum-StatusLight--positive');
    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.classes()).not.toContain('vs-status-light');
    expect(wrapper.attributes('data-vac')).toBeUndefined();
    expect(wrapper.attributes('role')).toBeUndefined();
  });

  it('warns when statuslight labelling contract is invalid', () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mount(StatusLight, {
      props: {
        variant: 'positive'
      }
    });
    expect(warn).toHaveBeenCalledWith('If no children are provided, an aria-label must be specified');

    mount(StatusLight, {
      props: {
        variant: 'positive'
      },
      attrs: {
        'aria-label': 'Connection'
      },
      slots: {
        default: 'Connected'
      }
    });
    expect(warn).toHaveBeenCalledWith('A labelled StatusLight must have a role.');
    warn.mockRestore();
  });

  it('maps progress bar DOM contract, value label contract, and warnings to react parity', () => {
    let bar = mount(ProgressBar, {
      props: {
        label: 'Loading assets',
        value: 35,
        minValue: 0,
        maxValue: 100
      }
    });

    expect(bar.element.tagName).toBe('DIV');
    expect(bar.classes()).toContain('spectrum-BarLoader');
    expect(bar.classes()).not.toContain('vs-progress-bar');
    expect(bar.attributes('data-vac')).toBeUndefined();
    expect(bar.attributes('role')).toBe('progressbar');
    expect(bar.attributes('aria-valuenow')).toBe('35');
    expect((bar.element as HTMLElement).style.minWidth).toBe('-moz-fit-content');
    expect(bar.get('.spectrum-BarLoader-label').text()).toBe('Loading assets');

    let formattedBar = mount(ProgressBar, {
      props: {
        label: 'Loading assets',
        showValueLabel: true,
        formatOptions: {
          style: 'currency',
          currency: 'JPY'
        },
        value: 25
      }
    });
    expect(formattedBar.find('.spectrum-BarLoader-percentage').text()).not.toContain('%');

    let explicitValueLabel = mount(ProgressBar, {
      props: {
        label: 'Loading assets',
        showValueLabel: true,
        value: 25,
        valueLabel: '1 of 4'
      }
    });
    expect(explicitValueLabel.find('.spectrum-BarLoader-percentage').text()).toBe('1 of 4');
    expect(explicitValueLabel.attributes('aria-valuetext')).toBe('1 of 4');

    let overBackground = mount(ProgressBar, {
      props: {
        label: 'Loading assets',
        variant: 'overBackground',
        staticColor: 'white',
        width: '300px'
      }
    });
    expect(overBackground.classes()).toContain('spectrum-BarLoader--overBackground');
    expect(overBackground.classes()).toContain('spectrum-BarLoader--staticWhite');
    expect((overBackground.element as HTMLElement).style.width).toBe('300px');

    let noLabelWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mount(ProgressBar, {
      props: {
        value: 5
      }
    });
    expect(noLabelWarn).toHaveBeenCalledWith('If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility');
    noLabelWarn.mockRestore();
  });

  it('maps progress aria-labelledby composition and custom DOM prop passthrough to react parity', () => {
    let externalLabelId = 'progress-external-label';
    let withAriaLabelAndLabelledBy = mount(ProgressBar, {
      props: {
        label: 'Loading assets',
        value: 35
      },
      attrs: {
        'aria-label': 'Fallback progress label',
        'aria-labelledby': externalLabelId,
        'data-testid': 'progress-bar-test'
      }
    });
    let labelledBy = withAriaLabelAndLabelledBy.attributes('aria-labelledby');
    let labelledByIds = labelledBy?.split(/\s+/) ?? [];
    expect(withAriaLabelAndLabelledBy.attributes('data-testid')).toBe('progress-bar-test');
    expect(withAriaLabelAndLabelledBy.attributes('aria-label')).toBe('Fallback progress label');
    expect(labelledByIds).toContain(externalLabelId);
    expect(labelledByIds).toContain(withAriaLabelAndLabelledBy.get('.spectrum-BarLoader-label').attributes('id'));
    expect(labelledByIds).toContain(withAriaLabelAndLabelledBy.attributes('id'));

    let withExternalLabelledBy = mount(ProgressBar, {
      props: {
        label: 'Loading assets',
        value: 35
      },
      attrs: {
        'aria-labelledby': externalLabelId
      }
    });
    let withExternalLabelledByIds = withExternalLabelledBy.attributes('aria-labelledby')?.split(/\s+/) ?? [];
    expect(withExternalLabelledByIds).toContain(externalLabelId);
    expect(withExternalLabelledByIds).toContain(withExternalLabelledBy.get('.spectrum-BarLoader-label').attributes('id'));
    expect(withExternalLabelledByIds).not.toContain(withExternalLabelledBy.attributes('id'));

    let circle = mount(ProgressCircle, {
      props: {
        value: 45
      },
      attrs: {
        'aria-label': 'Upload progress',
        'aria-describedby': 'progress-help',
        'data-testid': 'progress-circle-test'
      }
    });
    expect(circle.attributes('data-testid')).toBe('progress-circle-test');
    expect(circle.attributes('aria-describedby')).toBe('progress-help');
  });

  it('maps progress circle DOM contract, transforms, and warnings to react parity', () => {
    let circle = mount(ProgressCircle, {
      props: {
        value: 60
      },
      attrs: {
        'aria-label': 'Upload progress'
      }
    });
    expect(circle.element.tagName).toBe('DIV');
    expect(circle.classes()).toContain('spectrum-CircleLoader');
    expect(circle.classes()).not.toContain('vs-progress-circle');
    expect(circle.attributes('data-vac')).toBeUndefined();
    expect(circle.attributes('aria-label')).toBe('Upload progress');
    expect(circle.attributes('role')).toBe('progressbar');
    expect(circle.get('[data-testid=\"fillSubMask1\"]').attributes('style')).toContain('rotate(0deg)');
    expect(circle.get('[data-testid=\"fillSubMask2\"]').attributes('style')).toContain('rotate(-144deg)');
    expect(circle.get('[data-testid=\"fillSubMask1\"]').exists()).toBe(true);
    expect(circle.get('[data-testid=\"fillSubMask2\"]').exists()).toBe(true);

    let circleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mount(ProgressCircle, {
      props: {
        value: 60
      }
    });
    expect(circleWarn).toHaveBeenCalledWith('ProgressCircle requires an aria-label or aria-labelledby attribute for accessibility');
    circleWarn.mockRestore();
  });

  it('updates model value from textfield input', async () => {
    let wrapper = mount(TextField, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.get('input').setValue('Ada');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ada']);
  });

  it('maps spectrum textfield hover, focus-ring, and invalid states', async () => {
    let wrapper = mount(TextField, {
      props: {
        modelValue: '',
        isInvalid: true
      }
    });

    expect(wrapper.find('.spectrum-Textfield--invalid').exists()).toBe(true);
    await wrapper.get('input').trigger('mouseenter');
    expect(wrapper.find('.spectrum-Textfield-input').classes()).toContain('is-hovered');
    await wrapper.get('input').trigger('focus');
    expect(wrapper.find('.spectrum-Textfield').classes()).not.toContain('focus-ring');

    let textfieldElement = wrapper.get('input').element as HTMLInputElement;
    let originalMatches = textfieldElement.matches.bind(textfieldElement);
    let matchesSpy = vi.spyOn(textfieldElement, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return originalMatches(selector);
    });

    await wrapper.get('input').trigger('focus');
    expect(wrapper.find('.spectrum-Textfield').classes()).toContain('focus-ring');
    matchesSpy.mockRestore();
  });

  it('supports textfield controlled aliases and validation display props', async () => {
    let uncontrolled = mount(TextField, {
      props: {
        defaultValue: 'Test'
      }
    });
    expect((uncontrolled.get('input').element as HTMLInputElement).value).toBe('Test');

    let controlled = mount(TextField, {
      props: {
        value: 'Controlled',
        modelValue: 'Ignored'
      }
    });
    expect((controlled.get('input').element as HTMLInputElement).value).toBe('Controlled');

    let typed = mount(TextField, {
      props: {
        type: 'email',
        pattern: '[0-9]+'
      }
    });
    expect(typed.get('input').attributes('type')).toBe('email');
    expect(typed.get('input').attributes('pattern')).toBe('[0-9]+');

    let invalid = mount(TextField, {
      props: {
        modelValue: 'abc',
        validationState: 'invalid',
        errorMessage: 'Please enter a valid street address.'
      }
    });
    expect(invalid.find('.spectrum-HelpText-text').text()).toContain('valid street address');
    expect(invalid.attributes('aria-describedby')).toBeUndefined();
    expect(invalid.get('input').attributes('aria-describedby')).toContain('error');

    let valid = mount(TextField, {
      props: {
        value: 'user@example.com',
        validationState: 'valid',
        width: '300px',
        icon: 'i',
        label: 'Street address',
        contextualHelp: 'Segment help text'
      }
    });
    expect(valid.find('.spectrum-Textfield').classes()).toContain('spectrum-Textfield--valid');
    expect(valid.find('.spectrum-Textfield-icon').exists()).toBe(true);
    expect(valid.find('.spectrum-Field-contextualHelp').text()).toContain('Segment help');
    expect((valid.element as HTMLElement).style.width).toBe('300px');
  });

  it('maps textfield aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(TextField, {
      attrs: {
        'aria-labelledby': 'external-textfield-label'
      },
      props: {
        label: 'Street address',
        modelValue: ''
      }
    });

    let visibleLabel = labelledByWrapper.get('label.spectrum-FieldLabel');
    let labelledByInput = labelledByWrapper.get('input.spectrum-Textfield-input');
    expect(labelledByInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(labelledByInput.attributes('aria-labelledby')).toContain('external-textfield-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let ariaLabelWrapper = mount(TextField, {
      attrs: {
        'aria-label': 'Street address'
      },
      props: {
        label: '',
        modelValue: ''
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.spectrum-Textfield-input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Street address');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('updates model value from textarea input', async () => {
    let wrapper = mount(TextArea, {
      props: {
        modelValue: ''
      }
    });

    expect(wrapper.get('textarea').attributes('rows')).toBe('1');
    await wrapper.get('textarea').setValue('Ada Lovelace');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ada Lovelace']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['Ada Lovelace']);
  });

  it('maps multiline textarea classes and row props', async () => {
    let wrapper = mount(TextArea, {
      props: {
        defaultValue: 'Test',
        rows: 5,
        isQuiet: true
      }
    });

    expect(wrapper.find('.spectrum-Textfield').classes()).toContain('spectrum-Textfield--multiline');
    expect(wrapper.find('.spectrum-Textfield').classes()).toContain('spectrum-Textfield--quiet');
    expect(wrapper.find('textarea.spectrum-Textfield-input').exists()).toBe(true);
    expect(wrapper.find('.vs-text-field__input--multiline').exists()).toBe(false);
    expect(wrapper.get('textarea').attributes('rows')).toBe('5');

    await wrapper.get('textarea').trigger('mouseenter');
    expect(wrapper.find('textarea').classes()).toContain('is-hovered');
  });

  it('maps searchfield field contract, aria wiring, icon variants, and clear behavior', async () => {
    let wrapper = mount(SearchField, {
      props: {
        modelValue: 'Ada',
        isQuiet: true,
        label: 'Search people'
      }
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('spectrum-Field');
    expect(wrapper.classes()).toContain('spectrum-Search');
    expect(wrapper.classes()).toContain('spectrum-Textfield');
    expect(wrapper.classes()).toContain('spectrum-Textfield-wrapper');
    expect(wrapper.classes()).toContain('is-quiet');

    let label = wrapper.get('label.spectrum-FieldLabel');
    let input = wrapper.get('input[type="search"]');
    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('aria-labelledby')).toBe(label.attributes('id'));
    expect(input.attributes('tabindex')).toBe('0');
    expect(wrapper.get('.spectrum-Textfield.spectrum-Field-field').exists()).toBe(true);
    expect(input.classes()).toContain('spectrum-Textfield-input');
    expect(input.classes()).toContain('i18nFontFamily');
    expect(input.classes()).toContain('spectrum-Textfield-inputIcon');
    expect(input.classes()).toContain('spectrum-Search-input');

    let searchIcon = wrapper.get('[data-testid="searchicon"]');
    expect(searchIcon.element.tagName).toBe('svg');
    expect(searchIcon.classes()).toContain('spectrum-Textfield-icon');
    expect(searchIcon.classes()).toContain('spectrum-UIIcon-Magnifier');

    let clearButton = wrapper.get('div.spectrum-ClearButton[role="button"]');
    expect(clearButton.attributes('data-react-aria-pressable')).toBe('true');

    await clearButton.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.get('input[type="search"]').attributes('aria-labelledby')).toBe(label.attributes('id'));

    await input.trigger('keydown', {key: 'Enter'});
    expect(wrapper.emitted('submit')?.[0]).toEqual(['Ada']);

    let disabled = mount(SearchField, {
      props: {
        modelValue: 'Ada',
        isDisabled: true
      }
    });
    expect(disabled.classes()).toContain('is-disabled');
    expect(disabled.get('div.spectrum-ClearButton').classes()).toContain('is-disabled');
    await disabled.get('div.spectrum-ClearButton').trigger('click');
    expect(disabled.emitted('clear')).toBeUndefined();

    let noVisibleLabel = mount(SearchField, {
      props: {
        label: ''
      },
      attrs: {
        'aria-label': 'Street address'
      }
    });
    expect(noVisibleLabel.find('label.spectrum-FieldLabel').exists()).toBe(false);
    expect(noVisibleLabel.attributes('aria-label')).toBeUndefined();
    expect(noVisibleLabel.get('input[type="search"]').attributes('aria-label')).toBe('Street address');

    let invalid = mount(SearchField, {
      props: {
        label: 'Search',
        validationState: 'invalid',
        errorMessage: 'Remove special characters.'
      }
    });
    expect(invalid.classes()).toContain('spectrum-Search--invalid');
    expect(invalid.get('.spectrum-Textfield.spectrum-Field-field').classes()).toContain('spectrum-Textfield--invalid');
    expect(invalid.get('.spectrum-HelpText').classes()).toContain('spectrum-HelpText--negative');
    expect(invalid.get('.spectrum-HelpText-text').text()).toContain('Remove special characters');
    expect(invalid.get('input[type="search"]').attributes('aria-describedby')).toContain('-error');

    let iconNull = mount(SearchField, {
      props: {
        label: 'Search',
        modelValue: 'React',
        icon: null
      }
    });
    expect(iconNull.find('[data-testid="searchicon"]').exists()).toBe(false);
    expect(iconNull.get('input[type="search"]').classes()).not.toContain('spectrum-Textfield-inputIcon');

    let refreshIcon = mount(SearchField, {
      props: {
        label: 'Search',
        modelValue: 'React',
        icon: 'refresh'
      }
    });
    let refreshSvg = refreshIcon.get('.spectrum-Textfield-icon');
    expect(refreshSvg.attributes('viewBox')).toBe('0 0 36 36');
    expect(refreshSvg.classes()).toContain('spectrum-Icon--sizeS');
  });

  it('maps searchfield aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(SearchField, {
      attrs: {
        'aria-labelledby': 'external-searchfield-label'
      },
      props: {
        label: 'Search',
        modelValue: ''
      }
    });

    let visibleLabel = labelledByWrapper.get('label.spectrum-FieldLabel');
    let labelledByInput = labelledByWrapper.get('input[type="search"]');
    expect(labelledByInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(labelledByInput.attributes('aria-labelledby')).toContain('external-searchfield-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let ariaLabelWrapper = mount(SearchField, {
      attrs: {
        'aria-label': 'Search'
      },
      props: {
        label: '',
        modelValue: ''
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input[type="search"]');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Search');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('keeps searchfield style wiring bound to Spectrum field/textfield/button styles', () => {
    let source = readFileSync(
      resolve(process.cwd(), '../../packages/@vue-spectrum/searchfield/src/index.ts'),
      'utf8'
    );

    expect(source).toContain("@adobe/spectrum-css-temp/components/fieldlabel/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/helptext/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/textfield/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/button/vars.css");
    expect(source).toContain("./stateClassOverrides.css");
    expect(source).toContain("'spectrum-Field'");
    expect(source).toContain("'spectrum-Textfield-wrapper'");
    expect(source).toContain("'spectrum-Field-field'");
    expect(source).toContain("'spectrum-Textfield-inputIcon'");
    expect(source).toContain("'spectrum-ClearButton'");

    let overrides = readFileSync(
      resolve(process.cwd(), '../../packages/@vue-spectrum/searchfield/src/stateClassOverrides.css'),
      'utf8'
    );
    expect(overrides).toContain('.spectrum-Search .spectrum-Textfield-icon');
    expect(overrides).toContain('pointer-events: none');
    expect(overrides).toContain('.spectrum-Search .spectrum-Textfield-input:focus-visible:not(:active)');
    expect(overrides).toContain('box-shadow: none');
  });

  it('maps search autocomplete icon variants and clear behavior', async () => {
    let wrapper = mount(SearchAutocomplete, {
      props: {
        icon: 'filter',
        label: 'Search with Autocomplete',
        modelValue: 'Aerospace',
        options: ['Aerospace', 'Mechanical']
      }
    });

    expect(wrapper.get('[data-testid="searchicon"]').text()).toBe('🔎');
    expect(wrapper.get('input[type="search"]').attributes('list')).toContain('-list');
    await wrapper.get('input[type="search"]').trigger('focus');
    expect(wrapper.find('.spectrum-InputGroup').classes()).not.toContain('focus-ring');
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);

    let autocompleteInput = wrapper.get('input[type="search"]').element as HTMLInputElement;
    let originalMatches = autocompleteInput.matches.bind(autocompleteInput);
    let matchesSpy = vi.spyOn(autocompleteInput, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return originalMatches(selector);
    });

    await wrapper.get('input[type="search"]').trigger('focus');
    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('focus-ring');
    matchesSpy.mockRestore();
    await wrapper.get('input[type="search"]').trigger('blur');
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);

    await wrapper.get('input[type="search"]').setValue('Mechanical');
    expect(wrapper.emitted('inputChange')?.some((call) => call[0] === 'Mechanical')).toBe(true);
    expect(wrapper.emitted('selectionChange')?.at(-1)).toEqual(['Mechanical']);

    await wrapper.setProps({modelValue: 'Mechanical'});
    await wrapper.get('input[type="search"]').trigger('keydown', {key: 'Enter'});
    expect(wrapper.emitted('submit')?.at(-1)).toEqual(['Mechanical', 'Mechanical']);

    await wrapper.get('button.vs-combobox__clear').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    expect(wrapper.emitted('inputChange')?.at(-1)).toEqual(['']);
    expect(wrapper.emitted('selectionChange')?.at(-1)).toEqual([null]);
    expect(wrapper.emitted('clear')).toHaveLength(1);

    let noIcon = mount(SearchAutocomplete, {
      props: {
        icon: null,
        label: 'Search with Autocomplete',
        modelValue: '',
        options: ['Aerospace']
      }
    });

    expect(noIcon.find('[data-testid="searchicon"]').exists()).toBe(false);
  });

  it('maps search autocomplete aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(SearchAutocomplete, {
      attrs: {
        'aria-labelledby': 'external-search-autocomplete-label'
      },
      props: {
        label: '',
        modelValue: '',
        options: ['Aerospace']
      }
    });

    let labelledByInput = labelledByWrapper.get('input[type="search"]');
    expect(labelledByInput.attributes('aria-labelledby')).toBe('external-search-autocomplete-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(SearchAutocomplete, {
      attrs: {
        'aria-labelledby': 'external-search-autocomplete-label'
      },
      props: {
        label: 'Search with Autocomplete',
        modelValue: '',
        options: ['Aerospace']
      }
    });

    let visibleLabel = visibleLabelWrapper.get('.vs-combobox__label');
    let visibleLabelInput = visibleLabelWrapper.get('input[type="search"]');
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain('external-search-autocomplete-label');
    expect(visibleLabelInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(SearchAutocomplete, {
      attrs: {
        'aria-label': 'Search Autocomplete'
      },
      props: {
        label: '',
        modelValue: '',
        options: ['Aerospace']
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input[type="search"]');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Search Autocomplete');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('maps combobox interaction states, aria wiring, and hidden key input', async () => {
    let wrapper = mount(ComboBox, {
      props: {
        label: 'Framework',
        modelValue: '',
        options: ['Vue', 'React'],
        isQuiet: true
      }
    });

    let input = wrapper.get('input.spectrum-Textfield-input.spectrum-InputGroup-input');
    expect(input.attributes('aria-haspopup')).toBeUndefined();
    expect(input.attributes('aria-labelledby')).toBeTruthy();
    expect(input.attributes('autocomplete')).toBe('off');
    expect(input.attributes('autocorrect')).toBe('off');
    expect(input.attributes('spellcheck')).toBe('false');
    expect(input.attributes('tabindex')).toBe('0');

    await wrapper.get('.spectrum-InputGroup').trigger('mouseenter');
    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('is-hovered');
    await input.trigger('focus');
    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('is-focused');
    expect(wrapper.find('.spectrum-InputGroup').classes()).not.toContain('focus-ring');

    let comboInput = input.element as HTMLInputElement;
    let comboOriginalMatches = comboInput.matches.bind(comboInput);
    let comboMatchesSpy = vi.spyOn(comboInput, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return comboOriginalMatches(selector);
    });

    await input.trigger('focus');
    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('focus-ring');
    comboMatchesSpy.mockRestore();

    let trigger = wrapper.get('button.spectrum-FieldButton');
    expect(trigger.attributes('tabindex')).toBe('-1');
    expect(trigger.attributes('aria-label')).toBe('Show suggestions');
    expect(trigger.attributes('data-react-aria-pressable')).toBe('true');

    await trigger.trigger('mousedown');
    await trigger.trigger('click');
    expect(wrapper.find('button.spectrum-FieldButton').classes()).toContain('is-active');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);
    expect(wrapper.find('[role="listbox"]').classes()).toContain('spectrum-Menu');
    expect(wrapper.find('.spectrum-InputGroup-popover').exists()).toBe(true);

    await input.setValue('Vue');
    expect(wrapper.emitted('inputChange')?.at(-1)).toEqual(['Vue']);
    await input.trigger('blur');
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);

    let disabledInvalidWrapper = mount(ComboBox, {
      props: {
        modelValue: 'React',
        isDisabled: true,
        isInvalid: true
      }
    });
    expect(disabledInvalidWrapper.find('.spectrum-InputGroup').classes()).toContain('is-disabled');
    expect(disabledInvalidWrapper.find('.spectrum-InputGroup').classes()).not.toContain('spectrum-InputGroup--invalid');

    let keyWrapper = mount(ComboBox, {
      props: {
        modelValue: 'Vue',
        name: 'framework',
        formValue: 'key',
        selectedKey: 'vue',
        options: ['Vue']
      }
    });
    let hiddenInput = keyWrapper.find('input[type="hidden"][name="framework"]');
    expect(hiddenInput.exists()).toBe(true);
    expect(hiddenInput.attributes('hidden')).toBeDefined();
    expect(hiddenInput.element.getAttribute('value')).toBe('vue');
  });

  it('maps combobox aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(ComboBox, {
      attrs: {
        'aria-labelledby': 'external-combobox-label'
      },
      props: {
        label: '',
        modelValue: '',
        options: ['Vue', 'React']
      }
    });

    let labelledByInput = labelledByWrapper.get('input.spectrum-Textfield-input.spectrum-InputGroup-input');
    expect(labelledByInput.attributes('aria-labelledby')).toBe('external-combobox-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(ComboBox, {
      attrs: {
        'aria-labelledby': 'external-combobox-label'
      },
      props: {
        label: 'Framework',
        modelValue: '',
        options: ['Vue', 'React']
      }
    });

    let visibleLabel = visibleLabelWrapper.get('label.spectrum-FieldLabel');
    let visibleLabelInput = visibleLabelWrapper.get('input.spectrum-Textfield-input.spectrum-InputGroup-input');
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain('external-combobox-label');
    expect(visibleLabelInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(ComboBox, {
      attrs: {
        'aria-label': 'Framework'
      },
      props: {
        label: '',
        modelValue: '',
        options: ['Vue', 'React']
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.spectrum-Textfield-input.spectrum-InputGroup-input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Framework');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('warns on deprecated placeholder usage for text entry components', () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount(TextField, {
      props: {
        label: 'Name',
        placeholder: 'Type your name'
      }
    });
    mount(TextArea, {
      props: {
        label: 'Summary',
        placeholder: 'Type a summary'
      }
    });
    mount(SearchField, {
      props: {
        label: 'Search',
        placeholder: 'Search projects'
      }
    });
    mount(ComboBox, {
      props: {
        label: 'Framework',
        modelValue: '',
        options: ['Vue', 'React'],
        placeholder: 'Choose framework'
      }
    });
    mount(SearchAutocomplete, {
      props: {
        label: 'Search with Autocomplete',
        modelValue: '',
        options: ['Aerospace'],
        placeholder: 'Search options'
      }
    });
    mount(ColorField, {
      props: {
        label: 'Color',
        modelValue: '#3366ff',
        placeholder: '#ffffff'
      }
    });

    expect(warn).toHaveBeenCalledWith('Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/TextField.html#help-text');
    expect(warn).toHaveBeenCalledWith('Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/TextArea.html#help-text');
    expect(warn).toHaveBeenCalledWith('Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/SearchField.html#help-text');
    expect(warn).toHaveBeenCalledWith('Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/ComboBox.html#help-text');
    expect(warn).toHaveBeenCalledWith('Placeholders are deprecated due to accessibility issues. Please use help text instead.');
    expect(warn).toHaveBeenCalledWith('Placeholders are deprecated due to accessibility issues. Please use help text instead. See the docs for details: https://react-spectrum.adobe.com/react-spectrum/ColorField.html#help-text');
    warn.mockRestore();
  });

  it('maps combobox disabledKeys to disabled option state and blocked selection', async () => {
    let wrapper = mount(ComboBox, {
      props: {
        label: 'Animals',
        modelValue: '',
        options: [
          {id: 'Aardvark', textValue: 'Aardvark'},
          {id: 'Kangaroo', textValue: 'Kangaroo'},
          {id: 'Snake', textValue: 'Snake'}
        ],
        disabledKeys: new Set(['Aardvark', 'Snake'])
      }
    });

    let trigger = wrapper.get('button.spectrum-FieldButton');
    await trigger.trigger('mousedown');
    await trigger.trigger('click');

    let options = wrapper.findAll('[role="option"].spectrum-Menu-item');
    let aardvark = options.find((option) => option.attributes('data-key') === 'Aardvark');
    let kangaroo = options.find((option) => option.attributes('data-key') === 'Kangaroo');
    let snake = options.find((option) => option.attributes('data-key') === 'Snake');

    expect(aardvark).toBeDefined();
    expect(kangaroo).toBeDefined();
    expect(snake).toBeDefined();
    expect(aardvark!.classes()).toContain('is-disabled');
    expect(aardvark!.attributes('aria-disabled')).toBe('true');
    expect(snake!.classes()).toContain('is-disabled');
    expect(snake!.attributes('aria-disabled')).toBe('true');
    expect(kangaroo!.classes()).toContain('is-focused');

    await snake!.trigger('mouseenter');
    expect(snake!.classes()).not.toContain('is-focused');
    await snake!.trigger('mousedown');
    expect(wrapper.emitted('update:selectedKey')).toBeUndefined();
    expect(wrapper.emitted('selectionChange')).toBeUndefined();

    await kangaroo!.trigger('mousedown');
    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['Kangaroo']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['Kangaroo']);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Kangaroo']);
  });

  it('closes combobox popover on Escape and outside pointer interactions', async () => {
    let wrapper = mount(ComboBox, {
      attachTo: document.body,
      props: {
        label: 'Framework',
        modelValue: '',
        options: ['Vue', 'React']
      }
    });

    let trigger = wrapper.get('button.spectrum-FieldButton');
    await trigger.trigger('mousedown');
    await trigger.trigger('click');
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);

    let input = wrapper.get('input.spectrum-Textfield-input.spectrum-InputGroup-input');
    await input.trigger('keydown', {key: 'Escape'});
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);

    await trigger.trigger('mousedown');
    await trigger.trigger('click');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    document.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    await nextTick();
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('emits contextual help openChange lifecycle events', async () => {
    let wrapper = mount(ContextualHelp, {
      props: {
        title: 'Help'
      },
      slots: {
        default: () => 'Details'
      }
    });

    expect(wrapper.find('.vs-contextual-help__dialog').exists()).toBe(false);
    let trigger = wrapper.get('button.vs-contextual-help__trigger');
    expect(trigger.find('svg').exists()).toBe(true);
    expect(trigger.text()).not.toContain('?');
    let focusSpy = vi.spyOn(trigger.element as HTMLButtonElement, 'focus');

    await trigger.trigger('click');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);
    expect(wrapper.find('.vs-contextual-help__dialog').exists()).toBe(true);

    await wrapper.get('.vs-contextual-help__dialog').trigger('keydown', {key: 'Escape'});
    await nextTick();
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.find('.vs-contextual-help__dialog').exists()).toBe(false);
    expect(focusSpy).toHaveBeenCalled();

    await trigger.trigger('click');
    await wrapper.get('button.vs-contextual-help__backdrop').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(2);
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.find('.vs-contextual-help__dialog').exists()).toBe(false);
  });

  it('maps contextual help trigger aria labeling and class forwarding to react parity', () => {
    let defaultWrapper = mount(ContextualHelp, {
      slots: {
        default: () => 'Details'
      }
    });
    expect(defaultWrapper.get('button.vs-contextual-help__trigger').attributes('aria-label')).toBe('Help');

    let infoWrapper = mount(ContextualHelp, {
      props: {
        variant: 'info'
      },
      slots: {
        default: () => 'Details'
      }
    });
    expect(infoWrapper.get('button.vs-contextual-help__trigger').attributes('aria-label')).toBe('Information');

    let customLabelWrapper = mount(ContextualHelp, {
      attrs: {
        'aria-label': 'Read more details'
      },
      slots: {
        default: () => 'Details'
      }
    });
    expect(customLabelWrapper.get('button.vs-contextual-help__trigger').attributes('aria-label')).toBe('Read more details');

    let labelledByWrapper = mount(ContextualHelp, {
      attrs: {
        'aria-labelledby': 'contextual-help-label',
        class: 'foo'
      },
      slots: {
        default: () => 'Details'
      }
    });
    let trigger = labelledByWrapper.get('button.vs-contextual-help__trigger');
    expect(trigger.attributes('aria-labelledby')).toBe('contextual-help-label');
    expect(trigger.attributes('aria-label')).toBeUndefined();
    expect(trigger.classes()).toContain('foo');
    expect(labelledByWrapper.classes()).not.toContain('foo');

    let explicitAndLabelledByWrapper = mount(ContextualHelp, {
      attrs: {
        id: 'contextual-help-trigger',
        'aria-label': 'Read more details',
        'aria-labelledby': 'contextual-help-label'
      },
      slots: {
        default: () => 'Details'
      }
    });
    let explicitAndLabelledByTrigger = explicitAndLabelledByWrapper.get('button.vs-contextual-help__trigger');
    let explicitAndLabelledByIds = explicitAndLabelledByTrigger.attributes('aria-labelledby')?.split(/\s+/) ?? [];
    expect(explicitAndLabelledByTrigger.attributes('aria-label')).toBe('Read more details');
    expect(explicitAndLabelledByIds).toContain('contextual-help-label');
    expect(explicitAndLabelledByIds).toContain('contextual-help-trigger');
  });

  it('accepts combobox selectedKeys as a Set iterable in multiple selection mode', async () => {
    let wrapper = mount(ComboBox, {
      props: {
        label: 'Animals',
        selectionMode: 'multiple',
        selectedKeys: new Set(['Aardvark']),
        options: [
          {id: 'Aardvark', textValue: 'Aardvark'},
          {id: 'Kangaroo', textValue: 'Kangaroo'},
          {id: 'Snake', textValue: 'Snake'}
        ],
        modelValue: ''
      }
    });

    let trigger = wrapper.get('button.spectrum-FieldButton');
    await trigger.trigger('mousedown');
    await trigger.trigger('click');

    let aardvark = wrapper.get('[role="option"][data-key="Aardvark"]');
    let kangaroo = wrapper.get('[role="option"][data-key="Kangaroo"]');
    expect(aardvark.attributes('aria-selected')).toBe('true');
    expect(aardvark.classes()).toContain('is-selected');

    await kangaroo.trigger('mousedown');
    let emittedSelectedKeys = wrapper.emitted('update:selectedKeys')?.[0]?.[0] as unknown;
    expect(emittedSelectedKeys).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectedKeys as Set<string>)).toEqual(['Aardvark', 'Kangaroo']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['Aardvark', 'Kangaroo']);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
  });

  it('keeps combobox style wiring bound to Spectrum field/inputgroup/menu/popover styles', () => {
    let source = readFileSync(
      resolve(process.cwd(), '../../packages/@vue-spectrum/combobox/src/index.ts'),
      'utf8'
    );

    expect(source).toContain("@adobe/spectrum-css-temp/components/fieldlabel/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/inputgroup/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/menu/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/popover/vars.css");
    expect(source).toContain("@adobe/spectrum-css-temp/components/textfield/vars.css");
    expect(source).toContain("./stateClassOverrides.css");
    expect(source).toContain("'spectrum-InputGroup'");
    expect(source).toContain("'spectrum-Textfield-wrapper'");
    expect(source).toContain("'spectrum-Menu'");
    expect(source).toContain("'spectrum-InputGroup-popover'");

    let overrides = readFileSync(
      resolve(process.cwd(), '../../packages/@vue-spectrum/combobox/src/stateClassOverrides.css'),
      'utf8'
    );
    expect(overrides).toContain('.spectrum-InputGroup .spectrum-Textfield-input:focus-visible:not(:active)');
    expect(overrides).toContain('box-shadow: none');
  });

  it('updates model value from checkbox change', async () => {
    let wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    });

    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.classes()).toContain('spectrum-Checkbox');
    expect(wrapper.classes()).not.toContain('vs-checkbox');
    expect(wrapper.attributes('data-vac')).toBeUndefined();

    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('change')?.[0]).toEqual([true]);
    expect(wrapper.get('input').attributes('data-react-aria-pressable')).toBe('true');
    expect(wrapper.get('input').attributes('tabindex')).toBe('0');

    let noLabel = mount(Checkbox, {
      attrs: {
        'aria-label': 'checkbox with no visible label'
      }
    });
    expect(noLabel.attributes('aria-label')).toBeUndefined();
    expect(noLabel.get('input').attributes('aria-label')).toBe('checkbox with no visible label');
    expect(noLabel.find('.spectrum-Checkbox-label').exists()).toBe(false);
  });

  it('maps checkbox aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(Checkbox, {
      attrs: {
        'aria-labelledby': 'external-checkbox-label'
      },
      slots: {
        default: 'Agree'
      }
    });

    let labelledByInput = labelledByWrapper.get('input.spectrum-Checkbox-input');
    let visibleLabel = labelledByWrapper.get('.spectrum-Checkbox-label');
    expect(labelledByInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(labelledByInput.attributes('aria-labelledby')).toContain('external-checkbox-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let ariaLabelWrapper = mount(Checkbox, {
      attrs: {
        'aria-label': 'Agree'
      },
      props: {
        label: ''
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.spectrum-Checkbox-input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Agree');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('maps checkbox group aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(CheckboxGroup, {
      attrs: {
        'aria-labelledby': 'external-checkbox-group-label'
      },
      props: {
        label: 'Framework'
      }
    });

    let visibleLabel = labelledByWrapper.get('.spectrum-FieldLabel');
    let group = labelledByWrapper.get('[role="group"]');
    expect(group.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(group.attributes('aria-labelledby')).toContain('external-checkbox-group-label');
    expect(group.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(CheckboxGroup, {
      attrs: {
        'aria-label': 'Framework'
      },
      props: {
        label: ''
      }
    });

    let ariaLabelGroup = ariaLabelWrapper.get('[role="group"]');
    expect(ariaLabelGroup.attributes('aria-label')).toBe('Framework');
    expect(ariaLabelGroup.attributes('aria-labelledby')).toBeUndefined();
  });

  it('maps checkbox checked, indeterminate, hovered, focus-ring, and invalid states', async () => {
    let wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
        isIndeterminate: true,
        isInvalid: true
      }
    });

    expect(wrapper.classes()).toContain('is-checked');
    expect(wrapper.classes()).toContain('is-indeterminate');
    expect(wrapper.classes()).toContain('is-invalid');

    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('is-hovered');
    let input = wrapper.get('input.spectrum-Checkbox-input');
    let inputElement = input.element as HTMLInputElement;
    let originalMatches = inputElement.matches.bind(inputElement);
    let matchesSpy = vi.spyOn(inputElement, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }

      return originalMatches(selector);
    });
    await input.trigger('focus');
    matchesSpy.mockRestore();
    expect(wrapper.classes()).toContain('focus-ring');
    expect(wrapper.find('.spectrum-Checkbox-box svg.spectrum-UIIcon-DashSmall').exists()).toBe(true);

    let disabledInvalid = mount(Checkbox, {
      props: {
        modelValue: false,
        isDisabled: true,
        isInvalid: true
      }
    });
    expect(disabledInvalid.classes()).toContain('is-disabled');
    expect(disabledInvalid.classes()).not.toContain('is-invalid');
  });

  it('wires checkbox group model updates from child checkbox values', async () => {
    let wrapper = mount({
      components: {Checkbox, CheckboxGroup},
      data() {
        return {
          selected: ['vue']
        };
      },
      template: `
        <CheckboxGroup v-model="selected">
          <Checkbox value="vue">Vue</Checkbox>
          <Checkbox value="react">React</Checkbox>
        </CheckboxGroup>
      `
    });

    let groupRoot = wrapper.get('.spectrum-Field.spectrum-FieldGroup');
    expect(groupRoot.element.tagName).toBe('DIV');
    let groupControl = wrapper.get('[role="group"]');
    expect(groupControl.classes()).toContain('spectrum-FieldGroup-group');
    expect(groupControl.classes()).toContain('spectrum-Field-field');
    expect(wrapper.find('fieldset').exists()).toBe(false);
    expect(wrapper.find('.vs-checkbox-group').exists()).toBe(false);
    expect(wrapper.get('input[value="react"]').attributes('name')).toBeUndefined();

    await wrapper.get('input[value="react"]').setValue(true);
    expect((wrapper.vm as unknown as {selected: string[]}).selected).toEqual(['vue', 'react']);
  });

  it('updates model value from switch change', async () => {
    let wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    });

    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.classes()).toContain('spectrum-ToggleSwitch');
    expect(wrapper.classes()).not.toContain('vs-switch');
    expect(wrapper.attributes('data-vac')).toBeUndefined();

    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('change')?.[0]).toEqual([true]);
    expect(wrapper.get('input').attributes('data-react-aria-pressable')).toBe('true');
    expect(wrapper.get('input').attributes('tabindex')).toBe('0');

    let uncontrolled = mount(Switch, {
      props: {
        defaultSelected: true
      }
    });
    expect((uncontrolled.get('input').element as HTMLInputElement).checked).toBe(true);

    let readOnly = mount(Switch, {
      props: {
        isReadOnly: true,
        isSelected: true
      }
    });
    await readOnly.get('input').setValue(false);
    expect(readOnly.emitted('update:modelValue')).toBeUndefined();
    expect((readOnly.get('input').element as HTMLInputElement).checked).toBe(true);

    let noLabel = mount(Switch, {
      attrs: {
        'aria-label': 'This switch has no visible label'
      }
    });
    expect(noLabel.attributes('aria-label')).toBeUndefined();
    expect(noLabel.get('input').attributes('aria-label')).toBe('This switch has no visible label');
  });

  it('maps switch aria label and labelledby precedence to react parity', () => {
    let externalLabelId = 'switch-external-label';
    let withVisibleLabel = mount(Switch, {
      attrs: {
        'aria-label': 'fallback label',
        'aria-labelledby': externalLabelId
      },
      slots: {
        default: 'Switch label'
      }
    });
    let withVisibleLabelInput = withVisibleLabel.get('input');
    let withVisibleLabelBy = withVisibleLabelInput.attributes('aria-labelledby');
    let withVisibleLabelSpan = withVisibleLabel.get('.spectrum-ToggleSwitch-label');
    expect(withVisibleLabelBy).toBeTruthy();
    expect(withVisibleLabelBy?.split(/\s+/)).toContain(externalLabelId);
    expect(withVisibleLabelBy?.split(/\s+/)).toContain(withVisibleLabelSpan.attributes('id'));
    expect(withVisibleLabelInput.attributes('aria-label')).toBeUndefined();

    let noVisibleLabelWithLabelledBy = mount(Switch, {
      attrs: {
        'aria-label': 'fallback label',
        'aria-labelledby': externalLabelId
      }
    });
    expect(noVisibleLabelWithLabelledBy.get('input').attributes('aria-labelledby')).toBe(externalLabelId);
    expect(noVisibleLabelWithLabelledBy.get('input').attributes('aria-label')).toBeUndefined();

    let noVisibleLabelWithAriaLabel = mount(Switch, {
      attrs: {
        'aria-label': 'No visible switch label'
      }
    });
    expect(noVisibleLabelWithAriaLabel.get('input').attributes('aria-labelledby')).toBeUndefined();
    expect(noVisibleLabelWithAriaLabel.get('input').attributes('aria-label')).toBe('No visible switch label');
  });

  it('maps switch hovered, focus-ring, and disabled states', async () => {
    let wrapper = mount(Switch, {
      props: {
        modelValue: false
      }
    });

    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('is-hovered');
    let input = wrapper.get('input.spectrum-ToggleSwitch-input');
    let inputElement = input.element as HTMLInputElement;
    let originalMatches = inputElement.matches.bind(inputElement);
    let matchesSpy = vi.spyOn(inputElement, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }

      return originalMatches(selector);
    });
    await input.trigger('focus');
    matchesSpy.mockRestore();
    expect(wrapper.classes()).toContain('focus-ring');

    let disabled = mount(Switch, {
      props: {
        modelValue: false,
        isDisabled: true
      }
    });
    expect(disabled.classes()).toContain('is-disabled');
  });

  it('emits selection updates and applies aria semantics for step list interactions', async () => {
    let wrapper = mount(StepList, {
      props: {
        ariaLabel: 'Checkout steps',
        defaultLastCompletedStep: 'shipping',
        defaultSelectedKey: 'payment',
        items: [
          {key: 'shipping', label: 'Shipping'},
          {key: 'payment', label: 'Payment'},
          {key: 'review', label: 'Review', disabled: true}
        ]
      }
    });

    let links = wrapper.findAll('a.vs-steplist__link');
    expect(wrapper.attributes('role')).toBe('list');
    expect(wrapper.attributes('aria-label')).toBe('Checkout steps');
    expect(links).toHaveLength(3);
    expect(links[0].attributes('aria-current')).toBeUndefined();
    expect(links[0].classes()).toContain('is-completed');
    expect(links[1].attributes('aria-current')).toBe('step');
    expect(links[2].attributes('aria-disabled')).toBe('true');

    await links[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['shipping']);
    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['shipping']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['shipping']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['shipping']);
  });

  it('respects disabled/readonly gating and emits completion changes for controlled updates', async () => {
    let readOnly = mount(StepList, {
      props: {
        ariaLabel: 'Read only steps',
        defaultLastCompletedStep: 'payment',
        defaultSelectedKey: 'review',
        isReadOnly: true,
        items: [
          {key: 'shipping', label: 'Shipping'},
          {key: 'payment', label: 'Payment'},
          {key: 'review', label: 'Review'}
        ]
      }
    });

    let readOnlyLinks = readOnly.findAll('a.vs-steplist__link');
    expect(readOnlyLinks).toHaveLength(3);
    expect(readOnlyLinks[0].attributes('aria-disabled')).toBe('true');
    expect(readOnlyLinks[1].attributes('aria-disabled')).toBe('true');
    expect(readOnlyLinks[2].attributes('aria-disabled')).toBe('true');

    await readOnlyLinks[0].trigger('click');
    expect(readOnly.emitted('update:modelValue')).toBeUndefined();

    let disabled = mount(StepList, {
      props: {
        ariaLabel: 'Disabled steps',
        defaultLastCompletedStep: 'payment',
        defaultSelectedKey: 'review',
        isDisabled: true,
        items: [
          {key: 'shipping', label: 'Shipping'},
          {key: 'payment', label: 'Payment'},
          {key: 'review', label: 'Review'}
        ]
      }
    });

    let disabledLinks = disabled.findAll('a.vs-steplist__link');
    expect(disabledLinks).toHaveLength(3);
    expect(disabledLinks[0].attributes('aria-disabled')).toBe('true');
    expect(disabledLinks[1].attributes('aria-disabled')).toBe('true');
    expect(disabledLinks[2].attributes('aria-disabled')).toBe('true');

    await disabledLinks[1].trigger('click');
    expect(disabled.emitted('update:modelValue')).toBeUndefined();

    let controlled = mount(StepList, {
      props: {
        ariaLabel: 'Controlled steps',
        selectedKey: 'shipping',
        items: [
          {key: 'shipping', label: 'Shipping'},
          {key: 'payment', label: 'Payment'},
          {key: 'review', label: 'Review'}
        ]
      }
    });

    await controlled.setProps({selectedKey: 'review'});
    expect(controlled.emitted('update:lastCompletedStep')?.[0]).toEqual(['payment']);
    expect(controlled.emitted('lastCompletedStepChange')?.[0]).toEqual(['payment']);
  });

  it('accepts step list disabledKeys as a Set iterable', async () => {
    let wrapper = mount(StepList, {
      props: {
        ariaLabel: 'Checkout steps',
        defaultLastCompletedStep: 'shipping',
        defaultSelectedKey: 'shipping',
        disabledKeys: new Set(['payment']),
        items: [
          {key: 'shipping', label: 'Shipping'},
          {key: 'payment', label: 'Payment'},
          {key: 'review', label: 'Review'}
        ]
      }
    });

    let links = wrapper.findAll('a.vs-steplist__link');
    expect(links).toHaveLength(3);
    expect(links[1].attributes('aria-disabled')).toBe('true');

    await links[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('selectionChange')).toBeUndefined();
  });

  it('updates tab selection and panel content from tab interactions', async () => {
    let wrapper = mount(Tabs, {
      props: {
        modelValue: 'overview',
        items: [
          {key: 'overview', label: 'Overview', content: 'Overview panel'},
          {key: 'details', label: 'Details', content: 'Details panel'},
          {key: 'history', label: 'History', content: 'History panel', disabled: true}
        ]
      }
    });

    let tabButtons = wrapper.findAll('button.vs-tabs__tab');
    expect(wrapper.find('[role=\"tablist\"]').exists()).toBe(true);
    expect(wrapper.get('[role=\"tabpanel\"]').text()).toContain('Overview panel');
    expect(tabButtons[2].attributes('aria-disabled')).toBe('true');

    await tabButtons[1].trigger('click');
    expect(wrapper.get('[role=\"tabpanel\"]').text()).toContain('Details panel');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['details']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['details']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['details']);
  });

  it('selects and removes tags within tag group interactions', async () => {
    let wrapper = mount(TagGroup, {
      props: {
        label: 'Framework tags',
        selectionMode: 'single',
        modelValue: ['react'],
        items: [
          {key: 'react', label: 'React'},
          {key: 'vue', label: 'Vue'},
          {key: 'svelte', label: 'Svelte', disabled: true}
        ]
      }
    });

    let tags = wrapper.findAll('.vs-tag-group__tag');
    expect(wrapper.text()).toContain('Framework tags');
    expect(tags).toHaveLength(3);
    expect(tags[0].classes()).toContain('is-selected');
    expect(tags[2].classes()).toContain('is-disabled');

    await tags[1].trigger('click');
    expect(wrapper.findAll('button.vs-tag-group__remove')).toHaveLength(3);

    await wrapper.findAll('button.vs-tag-group__remove')[0].trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual([]);
    let emittedChange = wrapper.emitted('change')?.[0]?.[0] as unknown;
    expect(emittedChange).toBeInstanceOf(Set);
    expect(Array.from(emittedChange as Set<string>)).toEqual([]);
    expect(wrapper.emitted('remove')?.[0]).toEqual([['react']]);
  });

  it('accepts tag group modelValue as a Set iterable in multiple selection mode', async () => {
    let wrapper = mount(TagGroup, {
      props: {
        label: 'Framework tags',
        selectionMode: 'multiple',
        modelValue: new Set(['react']),
        items: [
          {key: 'react', label: 'React'},
          {key: 'vue', label: 'Vue'},
          {key: 'svelte', label: 'Svelte'}
        ]
      }
    });

    let tags = wrapper.findAll('.vs-tag-group__tag');
    expect(tags).toHaveLength(3);
    expect(tags[0].classes()).toContain('is-selected');
    expect(tags[1].classes()).not.toContain('is-selected');

    await wrapper.setProps({modelValue: new Set(['vue'])});
    tags = wrapper.findAll('.vs-tag-group__tag');
    expect(tags[0].classes()).not.toContain('is-selected');
    expect(tags[1].classes()).toContain('is-selected');
  });

  it('renders queued toasts and supports action + dismiss interactions', async () => {
    let queue = createToastQueue();
    let actions: string[] = [];

    queue.positive('Saved changes', {
      actionLabel: 'Undo',
      onAction: () => {
        actions.push('undo');
      },
      shouldCloseOnAction: true
    });
    queue.info('Build complete');

    let wrapper = mount(ToastContainer, {
      props: {
        ariaLabel: 'Notifications',
        placement: 'top end',
        queue
      }
    });

    expect(wrapper.attributes('aria-label')).toBe('Notifications');
    expect(wrapper.classes()).toContain('vs-toast-region--top-end');
    expect(wrapper.findAll('.vs-toast')).toHaveLength(2);

    await wrapper.get('.vs-toast__action').trigger('click');
    await nextTick();
    expect(actions).toEqual(['undo']);
    expect(queue.visibleToasts.value).toHaveLength(1);

    await wrapper.get('.vs-toast__close').trigger('click');
    await nextTick();
    expect(queue.visibleToasts.value).toHaveLength(0);
    expect(wrapper.find('.vs-toast-region').exists()).toBe(false);
  });

  it('renders tooltip content with variant, placement, and icon styling', () => {
    let wrapper = mount(Tooltip, {
      props: {
        isOpen: true,
        placement: 'right',
        showIcon: true,
        variant: 'info'
      },
      slots: {
        default: 'Migration tip'
      }
    });

    expect(wrapper.classes()).toContain('vs-tooltip--info');
    expect(wrapper.classes()).toContain('vs-tooltip--right');
    expect(wrapper.text()).toContain('Migration tip');
    expect(wrapper.find('.vs-tooltip__icon').exists()).toBe(true);
  });

  it('emits close updates from tooltip trigger keyboard interactions', async () => {
    let wrapper = mount(TooltipTrigger, {
      props: {
        content: 'Tooltip details',
        modelValue: true
      },
      slots: {
        default: '<button type=\"button\">Trigger</button>'
      }
    });

    expect(wrapper.find('.vs-tooltip').exists()).toBe(true);

    await wrapper.get('.vs-tooltip-trigger__target').trigger('keydown', {key: 'Escape'});
    await nextTick();

    let modelUpdates = wrapper.emitted('update:modelValue') ?? [];
    let openUpdates = wrapper.emitted('update:isOpen') ?? [];
    let changeEvents = wrapper.emitted('change') ?? [];
    let openChangeEvents = wrapper.emitted('openChange') ?? [];
    expect(modelUpdates[modelUpdates.length - 1]).toEqual([false]);
    expect(openUpdates[openUpdates.length - 1]).toEqual([false]);
    expect(changeEvents[changeEvents.length - 1]).toEqual([false]);
    expect(openChangeEvents[openChangeEvents.length - 1]).toEqual([false]);
  });

  it('supports defaultOpen and isOpen control aliases on tooltip trigger', async () => {
    let wrapper = mount(TooltipTrigger, {
      props: {
        content: 'Tooltip details',
        defaultOpen: true
      },
      slots: {
        default: '<button type=\"button\">Trigger</button>'
      }
    });

    expect(wrapper.find('.vs-tooltip').exists()).toBe(true);
    await wrapper.setProps({isOpen: false});
    await nextTick();
    expect(wrapper.find('.vs-tooltip').exists()).toBe(false);
  });

  it('honors tooltip trigger delay and closeDelay timing on hover', async () => {
    vi.useFakeTimers();

    try {
      let wrapper = mount(TooltipTrigger, {
        props: {
          closeDelay: 80,
          content: 'Tooltip details',
          delay: 120
        },
        slots: {
          default: '<button type="button">Trigger</button>'
        }
      });

      setInteractionModality('pointer');
      let trigger = wrapper.get('.vs-tooltip-trigger__target');
      await trigger.trigger('pointerenter', {pointerType: 'mouse'});
      await nextTick();
      expect(wrapper.find('.vs-tooltip').exists()).toBe(false);

      vi.advanceTimersByTime(119);
      await nextTick();
      expect(wrapper.find('.vs-tooltip').exists()).toBe(false);

      vi.advanceTimersByTime(1);
      await nextTick();
      expect(wrapper.find('.vs-tooltip').exists()).toBe(true);

      await trigger.trigger('pointerleave', {pointerType: 'mouse'});
      await nextTick();
      expect(wrapper.find('.vs-tooltip').exists()).toBe(true);

      vi.advanceTimersByTime(79);
      await nextTick();
      expect(wrapper.find('.vs-tooltip').exists()).toBe(true);

      vi.advanceTimersByTime(1);
      await nextTick();
      expect(wrapper.find('.vs-tooltip').exists()).toBe(false);
    } finally {
      setInteractionModality('keyboard');
      vi.useRealTimers();
    }
  });

  it('closes tooltip trigger when disabled after opening', async () => {
    let wrapper = mount(TooltipTrigger, {
      props: {
        content: 'Tooltip details',
        modelValue: true
      },
      slots: {
        default: '<button type="button">Trigger</button>'
      }
    });

    expect(wrapper.find('.vs-tooltip').exists()).toBe(true);
    await wrapper.setProps({isDisabled: true});
    await wrapper.get('.vs-tooltip-trigger__target').trigger('keydown', {key: 'Escape'});
    await nextTick();

    let modelUpdates = wrapper.emitted('update:modelValue') ?? [];
    expect(modelUpdates[modelUpdates.length - 1]).toEqual([false]);
    expect(wrapper.find('.vs-tooltip').exists()).toBe(false);
  });

  it('emits press events from standalone cards', async () => {
    let wrapper = mount(Card, {
      props: {
        title: 'Snapshot'
      }
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('press')).toHaveLength(1);
  });

  it('warns when card content contains focusable elements', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Card, {
      props: {
        title: 'Snapshot'
      },
      slots: {
        default: () => h('button', {type: 'button'}, 'Focusable action')
      }
    });

    await nextTick();
    expect(warn).toHaveBeenCalledWith('Card does not support focusable elements, please contact the team regarding your use case.');
    warn.mockRestore();
  });

  it('maps card hovered/focused/selected classes and aria labels', async () => {
    let wrapper = mount(Card, {
      props: {
        title: 'Snapshot',
        description: 'Build summary',
        selected: true
      }
    });

    expect(wrapper.classes()).toContain('is-selected');
    expect(wrapper.attributes('aria-labelledby')).toBeTruthy();
    expect(wrapper.attributes('aria-describedby')).toBeTruthy();
    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('is-hovered');
    await wrapper.trigger('focus');
    expect(wrapper.classes()).toContain('is-focused');
    expect(wrapper.classes()).not.toContain('focus-ring');

    let cardElement = wrapper.element as HTMLElement;
    let originalMatches = cardElement.matches.bind(cardElement);
    let matchesSpy = vi.spyOn(cardElement, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return originalMatches(selector);
    });

    await wrapper.trigger('focus');
    expect(wrapper.classes()).toContain('focus-ring');
    matchesSpy.mockRestore();
  });

  it('maps card layout and no-preview classes', () => {
    let withPreview = mount(Card, {
      props: {
        layout: 'grid',
        title: 'Snapshot',
        detail: 'PNG',
        description: 'Build summary'
      },
      slots: {
        preview: () => h('img', {src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: ''})
      }
    });

    expect(withPreview.classes()).toContain('spectrum-Card--grid');
    expect(withPreview.classes()).not.toContain('spectrum-Card--noPreview');
    expect(withPreview.find('.spectrum-Card-image').exists()).toBe(true);
    expect(withPreview.find('.spectrum-Card-detail').exists()).toBe(true);
    expect(withPreview.find('.spectrum-Card-content').exists()).toBe(true);

    let withoutPreview = mount(Card, {
      props: {
        layout: 'waterfall',
        title: 'Snapshot',
        detail: 'PNG',
        description: 'Build summary'
      }
    });

    expect(withoutPreview.classes()).toContain('spectrum-Card--waterfall');
    expect(withoutPreview.classes()).toContain('spectrum-Card--noPreview');
  });

  it('maps horizontal card orientation classes', () => {
    let wrapper = mount(Card, {
      props: {
        layout: 'grid',
        orientation: 'horizontal',
        title: 'Snapshot',
        detail: 'PNG',
        description: 'Build summary'
      },
      slots: {
        preview: () => h('img', {src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: ''})
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Card--horizontal');
    expect(wrapper.classes()).toContain('spectrum-Card--grid');
    expect(wrapper.classes()).not.toContain('spectrum-Card--default');
  });

  it('maps quiet card layout classes', () => {
    let wrapper = mount(Card, {
      props: {
        isQuiet: true,
        layout: 'gallery',
        title: 'Snapshot',
        detail: 'PNG',
        description: 'Build summary'
      },
      slots: {
        preview: () => h('img', {src: 'https://i.imgur.com/Z7AzH2c.jpg', alt: ''})
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Card--isQuiet');
    expect(wrapper.classes()).toContain('spectrum-Card--gallery');
    expect(wrapper.classes()).not.toContain('spectrum-Card--default');
  });

  it('emits selection and action from card view items', async () => {
    let wrapper = mount(CardView, {
      props: {
        modelValue: 'overview',
        items: [
          {id: 'overview', title: 'Overview'},
          {id: 'quality', title: 'Quality'}
        ]
      }
    });

    await wrapper.findAll('.vs-card-view__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['quality']);
    expect(wrapper.emitted('action')?.[0]).toEqual([{id: 'quality', title: 'Quality'}]);
    expect(wrapper.findAll('[role=\"row\"]')[1].attributes('aria-rowindex')).toBe('2');
  });

  it('supports card view disabledKeys iterable and multiple selection mode', async () => {
    let wrapper = mount(CardView, {
      props: {
        disabledKeys: new Set(['quality']),
        items: [
          {id: 'overview', title: 'Overview'},
          {id: 'quality', title: 'Quality'}
        ],
        selectionMode: 'multiple'
      }
    });

    let cards = wrapper.findAll('.vs-card-view__item');
    expect(cards).toHaveLength(2);
    expect(cards[1].attributes('aria-disabled')).toBe('true');

    await cards[1].trigger('click');
    expect(wrapper.emitted('action')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();

    await cards[0].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual([{id: 'overview', title: 'Overview'}]);
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['overview']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['overview']);
  });

  it('accepts card view modelValue as a Set iterable in multiple selection mode', async () => {
    let wrapper = mount(CardView, {
      props: {
        modelValue: new Set(['overview']),
        items: [
          {id: 'overview', title: 'Overview'},
          {id: 'quality', title: 'Quality'}
        ],
        selectionMode: 'multiple'
      }
    });

    let cards = wrapper.findAll('.vs-card-view__item');
    expect(cards).toHaveLength(2);
    expect(cards[0].classes()).toContain('is-selected');
    expect(cards[1].classes()).not.toContain('is-selected');

    await cards[1].trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['overview', 'quality']);
    let emittedChange = wrapper.emitted('change')?.[0]?.[0] as unknown;
    expect(emittedChange).toBeInstanceOf(Set);
    expect(Array.from(emittedChange as Set<string>)).toEqual(['overview', 'quality']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['overview', 'quality']);
  });

  it('accepts card view numeric modelValue for numeric item ids', async () => {
    let wrapper = mount(CardView, {
      props: {
        modelValue: 0,
        items: [
          {id: 0, title: 'Bob 1'},
          {id: 1, title: 'Joe 1'}
        ],
        selectionMode: 'single'
      }
    });

    let cards = wrapper.findAll('.vs-card-view__item');
    expect(cards).toHaveLength(2);
    expect(cards[0].classes()).toContain('is-selected');
    expect(cards[1].classes()).not.toContain('is-selected');

    await cards[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
    expect(wrapper.emitted('change')?.[0]).toEqual([1]);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual([[1]]);
  });

  it('emits numeric keys for card view multiple-selection updates with numeric ids', async () => {
    let wrapper = mount(CardView, {
      props: {
        modelValue: new Set([0]),
        items: [
          {id: 0, title: 'Bob 1'},
          {id: 1, title: 'Joe 1'}
        ],
        selectionMode: 'multiple'
      }
    });

    let cards = wrapper.findAll('.vs-card-view__item');
    expect(cards).toHaveLength(2);
    expect(cards[0].classes()).toContain('is-selected');
    expect(cards[1].classes()).not.toContain('is-selected');

    await cards[1].trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<number>)).toEqual([0, 1]);
    let emittedChange = wrapper.emitted('change')?.[0]?.[0] as unknown;
    expect(emittedChange).toBeInstanceOf(Set);
    expect(Array.from(emittedChange as Set<number>)).toEqual([0, 1]);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<number>)).toEqual([0, 1]);
  });

  it('resolves card view layout constructors to gallery and waterfall classes', () => {
    let gallery = mount(CardView, {
      props: {
        items: [{id: 'overview', title: 'Overview'}],
        layout: GalleryLayout
      }
    });

    expect(gallery.get('.vs-card-view__item').classes()).toContain('spectrum-Card--gallery');

    let waterfall = mount(CardView, {
      props: {
        items: [{id: 'quality', title: 'Quality'}],
        layout: WaterfallLayout
      }
    });

    expect(waterfall.get('.vs-card-view__item').classes()).toContain('spectrum-Card--waterfall');
  });

  it('renders loading and empty rows for card view states', () => {
    let loading = mount(CardView, {
      props: {
        items: [],
        loadingState: 'loading'
      }
    });
    expect(loading.text()).toContain('Loading...');

    let empty = mount(CardView, {
      props: {
        items: [],
        renderEmptyState: () => h('div', 'No results')
      }
    });
    expect(empty.text()).toContain('No results');
  });

  it('emits input and change events from color field edits', async () => {
    let wrapper = mount(ColorField, {
      props: {
        modelValue: '#3366ff',
        label: 'Theme color'
      }
    });

    let input = wrapper.get('input.vs-color-field__input');
    await input.setValue('#10b981');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#10b981']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['#10b981']);
  });

  it('maps color field aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(ColorField, {
      attrs: {
        'aria-labelledby': 'external-color-label'
      },
      props: {
        label: '',
        modelValue: '#3366ff'
      }
    });

    let labelledByInput = labelledByWrapper.get('input.vs-color-field__input');
    expect(labelledByInput.attributes('aria-labelledby')).toBe('external-color-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(ColorField, {
      attrs: {
        'aria-labelledby': 'external-color-label'
      },
      props: {
        label: 'Primary Color',
        modelValue: '#3366ff'
      }
    });

    let visibleLabel = visibleLabelWrapper.get('.vs-color-field__label');
    let visibleLabelInput = visibleLabelWrapper.get('input.vs-color-field__input');
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain('external-color-label');
    expect(visibleLabelInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(ColorField, {
      attrs: {
        'aria-label': 'Primary Color'
      },
      props: {
        label: '',
        modelValue: '#3366ff'
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.vs-color-field__input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Primary Color');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('maps color slider aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(ColorSlider, {
      attrs: {
        'aria-labelledby': 'external-color-slider-label'
      },
      props: {
        channel: 'hue',
        label: '',
        modelValue: 220
      }
    });

    let labelledByInput = labelledByWrapper.get('input.vs-color-slider__input');
    expect(labelledByInput.attributes('aria-labelledby')).toBe('external-color-slider-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(ColorSlider, {
      attrs: {
        'aria-labelledby': 'external-color-slider-label'
      },
      props: {
        channel: 'hue',
        label: 'Hue',
        modelValue: 220
      }
    });

    let visibleLabel = visibleLabelWrapper.get('.vs-color-slider__label');
    let visibleLabelInput = visibleLabelWrapper.get('input.vs-color-slider__input');
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain('external-color-slider-label');
    expect(visibleLabelInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(ColorSlider, {
      attrs: {
        'aria-label': 'Hue'
      },
      props: {
        channel: 'hue',
        label: '',
        modelValue: 220
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.vs-color-slider__input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Hue');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('emits swatch selection changes and returns selected swatch item', async () => {
    let wrapper = mount(ColorSwatchPicker, {
      props: {
        modelValue: 'azure',
        items: [
          {id: 'azure', label: 'Azure', color: '#0ea5e9'},
          {id: 'emerald', label: 'Emerald', color: '#10b981'}
        ]
      }
    });

    await wrapper.findAll('button.vs-color-swatch-picker__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['emerald']);
    expect(wrapper.emitted('change')?.[0]).toEqual([{id: 'emerald', label: 'Emerald', color: '#10b981'}]);
  });

  it('emits color updates from color picker field edits', async () => {
    let wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#3366ff',
        label: 'Picker'
      }
    });

    await wrapper.get('input.vs-color-field__input').setValue('#f59e0b');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#f59e0b']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['#f59e0b']);
  });

  it('emits update and change events from date picker inputs', async () => {
    let wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-02-19',
        label: 'Date picker'
      }
    });

    await wrapper.get('input.vs-date-picker__input').setValue('2026-02-20');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-02-20']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-02-20']);
  });

  it('maps datepicker aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-02-19',
        label: ''
      },
      attrs: {
        'aria-labelledby': 'external-date-label'
      }
    });
    let labelledByInput = labelledByWrapper.get('input.vs-date-picker__input');
    expect(labelledByInput.attributes('aria-labelledby')).toBe('external-date-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-02-19',
        label: 'Date picker'
      }
    });
    let visibleLabel = visibleLabelWrapper.get('span.vs-date-picker__label');
    let visibleLabelInput = visibleLabelWrapper.get('input.vs-date-picker__input');
    expect(visibleLabelInput.attributes('aria-labelledby')).toBe(visibleLabel.attributes('id'));
    expect(visibleLabelInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-02-19',
        label: ''
      },
      attrs: {
        'aria-label': 'Birth date'
      }
    });
    let ariaLabelInput = ariaLabelWrapper.get('input.vs-date-picker__input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Birth date');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
  });

  it('maps datepicker spectrum interaction and visibility state classes', async () => {
    let wrapper = mount(DatePicker, {
      props: {
        modelValue: '',
        label: 'Schedule date',
        placeholder: 'MM/DD/YYYY',
        isInvalid: true
      }
    });

    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('spectrum-InputGroup--invalid');
    expect(wrapper.get('input.vs-date-picker__input').classes()).toContain('is-placeholder');
    await wrapper.get('.vs-date-picker__control').trigger('mouseenter');
    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('is-hovered');
    await wrapper.get('input.vs-date-picker__input').trigger('focus');
    expect(wrapper.find('.spectrum-InputGroup').classes()).not.toContain('focus-ring');

    let datePickerInput = wrapper.get('input.vs-date-picker__input').element as HTMLInputElement;
    let datePickerOriginalMatches = datePickerInput.matches.bind(datePickerInput);
    let datePickerMatchesSpy = vi.spyOn(datePickerInput, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return datePickerOriginalMatches(selector);
    });

    await wrapper.get('input.vs-date-picker__input').trigger('focus');
    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('focus-ring');
    datePickerMatchesSpy.mockRestore();

    let dialog = wrapper.get('.react-spectrum-Datepicker-dialog');
    expect(dialog.attributes('hidden')).toBeDefined();
    expect(dialog.attributes('aria-hidden')).toBe('true');
    await wrapper.get('button.spectrum-FieldButton').trigger('click');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('false');
    await wrapper.get('input.vs-date-picker__input').trigger('blur');
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
  });

  it('closes datepicker popover on Escape and outside pointer interactions', async () => {
    let wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        modelValue: '2026-02-19',
        label: 'Date picker'
      }
    });

    let trigger = wrapper.get('button.spectrum-FieldButton');
    await trigger.trigger('click');
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('false');

    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
    await nextTick();
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(trigger.element);

    await trigger.trigger('click');
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('false');
    document.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    await nextTick();
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('true');
  });

  it('emits structured range updates from date range picker inputs', async () => {
    let wrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: '2026-02-20',
          end: '2026-02-24'
        },
        label: 'Date range picker'
      }
    });

    await wrapper.findAll('input.vs-date-range-picker__input')[1].setValue('2026-02-25');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{
      start: '2026-02-20',
      end: '2026-02-25'
    }]);
    expect(wrapper.emitted('change')?.[0]).toEqual([{
      start: '2026-02-20',
      end: '2026-02-25'
    }]);
  });

  it('maps date range picker aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: '2026-02-20',
          end: '2026-02-24'
        },
        label: ''
      },
      attrs: {
        'aria-labelledby': 'external-date-range-label'
      }
    });

    let labelledByStart = labelledByWrapper.get('input[data-testid="start-date"]');
    let labelledByEnd = labelledByWrapper.get('input[data-testid="end-date"]');
    expect(labelledByWrapper.attributes('aria-labelledby')).toBe('external-date-range-label');
    expect(labelledByWrapper.attributes('aria-label')).toBeUndefined();
    expect(labelledByStart.attributes('aria-labelledby')).toBe('external-date-range-label');
    expect(labelledByEnd.attributes('aria-labelledby')).toBe('external-date-range-label');
    expect(labelledByStart.attributes('aria-label')).toBe('Start date');
    expect(labelledByEnd.attributes('aria-label')).toBe('End date');

    let visibleLabelWrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: '2026-02-20',
          end: '2026-02-24'
        },
        label: 'Date range picker'
      }
    });

    let legend = visibleLabelWrapper.get('legend.vs-date-range-picker__label');
    let visibleLabelStart = visibleLabelWrapper.get('input[data-testid="start-date"]');
    expect(visibleLabelWrapper.attributes('aria-labelledby')).toContain(legend.attributes('id'));
    expect(visibleLabelStart.attributes('aria-labelledby')).toContain(legend.attributes('id'));

    let ariaLabelWrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: '2026-02-20',
          end: '2026-02-24'
        },
        label: ''
      },
      attrs: {
        'aria-label': 'Booking window'
      }
    });

    let ariaLabelStart = ariaLabelWrapper.get('input[data-testid="start-date"]');
    expect(ariaLabelWrapper.attributes('aria-label')).toBe('Booking window');
    expect(ariaLabelWrapper.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelStart.attributes('aria-labelledby')).toBe(ariaLabelWrapper.attributes('id'));
  });

  it('maps daterange read-only and dash aria-hidden states', async () => {
    let wrapper = mount(DateRangePicker, {
      props: {
        modelValue: {
          start: '',
          end: ''
        },
        isReadOnly: true
      }
    });

    let inputs = wrapper.findAll('input.vs-date-range-picker__input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].classes()).toContain('is-read-only');
    expect(inputs[1].classes()).toContain('is-read-only');
    expect(wrapper.get('[data-testid=\"date-range-dash\"]').attributes('aria-hidden')).toBe('true');
  });

  it('closes date range popover on Escape and outside pointer interactions', async () => {
    let wrapper = mount(DateRangePicker, {
      attachTo: document.body,
      props: {
        modelValue: {
          start: '2026-02-20',
          end: '2026-02-24'
        },
        label: 'Date range picker'
      }
    });

    let trigger = wrapper.get('button.spectrum-FieldButton');
    await trigger.trigger('click');
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('false');

    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
    await nextTick();
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(trigger.element);

    await trigger.trigger('click');
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('false');
    document.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    await nextTick();
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(wrapper.get('.react-spectrum-Datepicker-dialog').attributes('aria-hidden')).toBe('true');
  });

  it('emits update and change events from time field inputs', async () => {
    let wrapper = mount(TimeField, {
      props: {
        modelValue: '09:30',
        label: 'Target time'
      }
    });

    await wrapper.get('input.vs-time-field__input').setValue('10:45');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:45']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['10:45']);
  });

  it('maps timefield disabled precedence over invalid state classes', () => {
    let wrapper = mount(TimeField, {
      props: {
        modelValue: '',
        isDisabled: true,
        isInvalid: true
      }
    });

    expect(wrapper.find('.spectrum-InputGroup').classes()).toContain('is-disabled');
    expect(wrapper.find('.spectrum-InputGroup').classes()).not.toContain('spectrum-InputGroup--invalid');
  });

  it('maps slider aria label and labelledby ownership to react parity', () => {
    let labelledByWrapper = mount(Slider, {
      attrs: {
        'aria-labelledby': 'external-slider-label'
      },
      props: {
        label: 'Progress',
        modelValue: 40
      }
    });

    let labelledByInput = labelledByWrapper.get('input.vs-slider__input');
    let visibleLabel = labelledByWrapper.get('label.vs-slider__label');
    expect(labelledByWrapper.attributes('role')).toBe('group');
    expect(labelledByWrapper.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(labelledByWrapper.attributes('aria-labelledby')).toContain('external-slider-label');
    expect(labelledByWrapper.attributes('aria-label')).toBeUndefined();
    expect(labelledByInput.attributes('aria-labelledby')).toBe(visibleLabel.attributes('id'));
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(Slider, {
      attrs: {
        'aria-label': 'Progress'
      },
      props: {
        label: '',
        modelValue: 40
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.vs-slider__input');
    expect(ariaLabelWrapper.attributes('role')).toBe('group');
    expect(ariaLabelWrapper.attributes('aria-label')).toBe('Progress');
    expect(ariaLabelWrapper.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelInput.attributes('aria-labelledby')).toBe(ariaLabelWrapper.attributes('id'));
    expect(ariaLabelInput.attributes('aria-label')).toBeUndefined();
  });

  it('maps range slider aria label and labelledby ownership to react parity', () => {
    let labelledByWrapper = mount(RangeSlider, {
      attrs: {
        'aria-labelledby': 'external-range-slider-label'
      },
      props: {
        label: 'Window',
        modelValue: {
          start: 20,
          end: 80
        }
      }
    });

    let visibleLabel = labelledByWrapper.get('label.vs-slider__label');
    let labelledByInputs = labelledByWrapper.findAll('input.vs-slider__input');
    expect(labelledByInputs).toHaveLength(2);
    expect(labelledByWrapper.attributes('role')).toBe('group');
    expect(labelledByWrapper.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(labelledByWrapper.attributes('aria-labelledby')).toContain('external-range-slider-label');
    expect(labelledByInputs[0].attributes('aria-label')).toBe('Minimum');
    expect(labelledByInputs[1].attributes('aria-label')).toBe('Maximum');
    expect(labelledByInputs[0].attributes('aria-labelledby')).toBe(`${labelledByInputs[0].attributes('id')} ${visibleLabel.attributes('id')}`);
    expect(labelledByInputs[1].attributes('aria-labelledby')).toBe(`${labelledByInputs[1].attributes('id')} ${visibleLabel.attributes('id')}`);

    let ariaLabelWrapper = mount(RangeSlider, {
      attrs: {
        'aria-label': 'Window'
      },
      props: {
        label: undefined,
        modelValue: {
          start: 20,
          end: 80
        }
      }
    });

    let ariaLabelInputs = ariaLabelWrapper.findAll('input.vs-slider__input');
    expect(ariaLabelInputs).toHaveLength(2);
    expect(ariaLabelWrapper.attributes('role')).toBe('group');
    expect(ariaLabelWrapper.attributes('aria-label')).toBe('Window');
    expect(ariaLabelWrapper.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelInputs[0].attributes('aria-labelledby')).toBe(`${ariaLabelInputs[0].attributes('id')} ${ariaLabelWrapper.attributes('id')}`);
    expect(ariaLabelInputs[1].attributes('aria-labelledby')).toBe(`${ariaLabelInputs[1].attributes('id')} ${ariaLabelWrapper.attributes('id')}`);
  });

  it('maps slider thumb interaction states and disabled class', async () => {
    let wrapper = mount(Slider, {
      props: {
        modelValue: 40,
        label: 'Progress'
      }
    });

    let handle = wrapper.get('.vs-slider__handle');
    await handle.trigger('mouseenter');
    expect(handle.classes()).toContain('is-hovered');
    await wrapper.get('input.vs-slider__input').trigger('focus');
    expect(handle.classes()).toContain('is-focused');
    expect(handle.classes()).toContain('is-tophandle');
    await handle.trigger('mousedown');
    expect(handle.classes()).toContain('is-dragged');
    await wrapper.get('input.vs-slider__input').setValue('48');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([48]);

    let disabled = mount(Slider, {
      props: {
        modelValue: 10,
        isDisabled: true
      }
    });
    expect(disabled.classes()).toContain('is-disabled');
  });

  it('maps range slider handle state classes and hidden markers', async () => {
    let wrapper = mount(RangeSlider, {
      props: {
        modelValue: {
          start: 20,
          end: 80
        },
        label: 'Window'
      }
    });

    let inputs = wrapper.findAll('input.vs-slider__input');
    expect(inputs).toHaveLength(2);
    await inputs[1].trigger('focus');
    expect(wrapper.findAll('.vs-slider__handle')[1].classes()).toContain('is-tophandle');
    await inputs[0].setValue('30');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{
      start: 30,
      end: 80
    }]);
    expect(wrapper.findAll('input[type="hidden"]').length).toBeGreaterThanOrEqual(2);
  });

  it('maps slider value-label formatting, side labels, fill track, gradient, and contextual help contract', () => {
    let wrapper = mount(Slider, {
      props: {
        label: 'Exposure',
        labelPosition: 'side',
        minValue: -7,
        maxValue: 5,
        modelValue: 0,
        formatOptions: {style: 'unit', unit: 'centimeter'},
        isFilled: true,
        fillOffset: 0,
        trackGradient: ['blue', 'red']
      },
      slots: {
        'contextual-help': () => h('button', {type: 'button', 'aria-label': 'Help'}, '?')
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Slider--positionSide');
    expect(wrapper.find('.spectrum-Slider-valueLabelContainer .vs-slider__value').text()).toContain('cm');
    expect(wrapper.find('.spectrum-Slider-contextualHelp button[aria-label="Help"]').exists()).toBe(true);
    expect(wrapper.find('.spectrum-Slider-fill').exists()).toBe(true);
    expect(wrapper.attributes('style')).toContain('--spectrum-slider-track-gradient');
  });

  it('renders unlabeled slider and range slider top value labels for default story parity', () => {
    let slider = mount(Slider, {
      props: {
        label: '',
        modelValue: 40
      },
      attrs: {
        'aria-label': 'Label'
      }
    });

    expect(slider.find('.spectrum-Slider-labelContainer').exists()).toBe(true);
    expect(slider.find('output.vs-slider__value').exists()).toBe(true);

    let rangeSlider = mount(RangeSlider, {
      props: {
        label: undefined,
        modelValue: {
          start: 20,
          end: 80
        }
      },
      attrs: {
        'aria-label': 'Label'
      }
    });

    expect(rangeSlider.find('.spectrum-Slider-labelContainer').exists()).toBe(true);
    expect(rangeSlider.find('output.vs-slider__value').exists()).toBe(true);
  });

  it('maps numberfield stepper interaction classes and hidden key input', async () => {
    let wrapper = mount(NumberField, {
      props: {
        modelValue: 3,
        label: 'Estimate',
        name: 'estimate'
      }
    });

    await wrapper.get('.spectrum-Stepper').trigger('mouseenter');
    expect(wrapper.find('.spectrum-Stepper').classes()).toContain('is-hovered');

    let numberInput = wrapper.get('input.spectrum-Stepper-input');
    expect(numberInput.classes()).toContain('spectrum-Textfield-input');
    expect(numberInput.classes()).toContain('i18nFontFamily');
    expect(numberInput.classes()).not.toContain('vs-number-field__input');
    expect(numberInput.attributes('tabindex')).toBe('0');

    await numberInput.trigger('focus');
    expect(wrapper.find('.spectrum-Stepper').classes()).toContain('is-focused');

    let stepUp = wrapper.get('div.spectrum-Stepper-button--stepUp');
    expect(stepUp.attributes('role')).toBe('button');
    expect(stepUp.attributes('tabindex')).toBe('-1');
    expect(stepUp.attributes('data-react-aria-pressable')).toBe('true');
    expect(stepUp.attributes('aria-label')).toBe('Increase Estimate');
    expect(stepUp.attributes('aria-controls')).toBe(numberInput.attributes('id'));
    await stepUp.trigger('mousedown');
    expect(stepUp.classes()).toContain('is-active');
    await stepUp.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4]);

    let hiddenInput = wrapper.find('input[type="hidden"][name="estimate"]');
    expect(hiddenInput.exists()).toBe(true);
    expect(hiddenInput.attributes('hidden')).toBeDefined();

    let disabledInvalid = mount(NumberField, {
      props: {
        modelValue: 2,
        isDisabled: true,
        isInvalid: true
      }
    });
    expect(disabledInvalid.find('.spectrum-Stepper').classes()).toContain('is-disabled');
    expect(disabledInvalid.find('.spectrum-Stepper').classes()).not.toContain('is-invalid');
  });

  it('maps numberfield aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(NumberField, {
      attrs: {
        'aria-labelledby': 'external-numberfield-label'
      },
      props: {
        label: '',
        modelValue: 10
      }
    });

    let labelledByInput = labelledByWrapper.get('input.spectrum-Stepper-input');
    expect(labelledByInput.attributes('aria-labelledby')).toBe('external-numberfield-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(NumberField, {
      attrs: {
        'aria-labelledby': 'external-numberfield-label'
      },
      props: {
        label: 'Width',
        modelValue: 10
      }
    });

    let visibleLabel = visibleLabelWrapper.get('label.spectrum-FieldLabel');
    let visibleLabelInput = visibleLabelWrapper.get('input.spectrum-Stepper-input');
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(visibleLabelInput.attributes('aria-labelledby')).toContain('external-numberfield-label');
    expect(visibleLabelInput.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(NumberField, {
      attrs: {
        'aria-label': 'Width'
      },
      props: {
        label: '',
        modelValue: 10
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.spectrum-Stepper-input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Width');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();
  });

  it('maps modal underlay and dialog surface contract to react parity', async () => {
    let wrapper = mount({
      components: {Button, Dialog, Divider, Modal},
      template: `
        <Modal :is-open="true">
          <Dialog>
            <template #heading>Title</template>
            <template #divider><Divider /></template>
            <span role="none">I am a dialog</span>
            <template #buttonGroup>
              <Button variant="cta">Close</Button>
            </template>
          </Dialog>
        </Modal>
      `
    });

    await nextTick();

    let underlay = document.body.querySelector('[data-testid=\"underlay\"]');
    expect(underlay).not.toBeNull();
    expect(underlay?.classList.contains('spectrum-Underlay')).toBe(true);
    expect(underlay?.classList.contains('spectrum-overlay')).toBe(true);
    expect(underlay?.classList.contains('is-open')).toBe(true);
    expect(underlay?.classList.contains('spectrum-overlay--open')).toBe(true);

    let modal = document.body.querySelector('[data-testid=\"modal\"]');
    expect(modal).not.toBeNull();
    expect(modal?.classList.contains('spectrum-Modal')).toBe(true);
    expect(modal?.classList.contains('spectrum-overlay')).toBe(true);
    expect(modal?.classList.contains('is-open')).toBe(true);
    expect(modal?.classList.contains('spectrum-overlay--open')).toBe(true);

    let dialog = document.body.querySelector('[role=\"dialog\"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.classList.contains('spectrum-Dialog')).toBe(true);
    expect(dialog?.hasAttribute('aria-modal')).toBe(false);
    expect(document.body.querySelector('.vs-dialog-layer')).toBeNull();
    expect(document.body.querySelector('.vs-dialog-layer__backdrop')).toBeNull();

    wrapper.unmount();
  });

  it('closes dismissable overlays on Escape and keeps non-dismissable modal open', async () => {
    let modal = mount(Modal, {
      props: {
        isDismissable: true,
        isOpen: true
      },
      slots: {
        default: () => h('div', 'Modal content')
      }
    });

    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
    await nextTick();
    expect(modal.emitted('close')).toHaveLength(1);
    modal.unmount();

    let nonDismissableModal = mount(Modal, {
      props: {
        isDismissable: false,
        isOpen: true
      },
      slots: {
        default: () => h('div', 'Modal content')
      }
    });

    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
    await nextTick();
    expect(nonDismissableModal.emitted('close')).toBeUndefined();
    nonDismissableModal.unmount();

    let tray = mount(Tray, {
      props: {
        isOpen: true
      },
      slots: {
        default: () => h('div', 'Tray content')
      }
    });

    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
    await nextTick();
    expect(tray.emitted('close')).toHaveLength(1);
    tray.unmount();

    let popover = mount(Popover, {
      props: {
        isDismissable: true,
        isNonModal: true,
        isOpen: true
      },
      slots: {
        default: () => h('button', {class: 'inside-popover', type: 'button'}, 'Inside')
      }
    });

    let insidePopoverButton = document.body.querySelector('button.inside-popover') as HTMLButtonElement | null;
    expect(insidePopoverButton).not.toBeNull();
    insidePopoverButton?.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    await nextTick();
    expect(popover.emitted('close')).toBeUndefined();

    document.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    await nextTick();
    expect(popover.emitted('close')).toHaveLength(1);
    popover.unmount();
  });

  it('restores trigger focus when dialog trigger closes from Escape', async () => {
    let wrapper = mount({
      components: {DialogTrigger},
      template: `
        <DialogTrigger type="modal" :isDismissable="true" title="Parity dialog">
          <template #trigger="{open}">
            <button class="vs-dialog-trigger-test" type="button" @click="open">Open dialog</button>
          </template>
          <button class="vs-dialog-inside-test" type="button">Focusable inside</button>
        </DialogTrigger>
      `
    }, {
      attachTo: document.body
    });

    let triggerButton = wrapper.get('button.vs-dialog-trigger-test');
    triggerButton.element.focus();
    expect(document.activeElement).toBe(triggerButton.element);

    await triggerButton.trigger('click');
    await nextTick();
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();

    let insideButton = document.body.querySelector('button.vs-dialog-inside-test') as HTMLButtonElement | null;
    expect(insideButton).not.toBeNull();
    insideButton?.focus();
    expect(document.activeElement).toBe(insideButton);

    document.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}));
    await nextTick();
    await nextTick();

    let dialogTrigger = wrapper.getComponent(DialogTrigger);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(dialogTrigger.emitted('openChange')?.[0]).toEqual([true]);
    expect(dialogTrigger.emitted('openChange')?.at(-1)).toEqual([false]);
    expect(document.activeElement).toBe(triggerButton.element);

    wrapper.unmount();
  });

  it('warns when dialog trigger unmounts while open for modal-like types', () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let wrapper = mount(DialogTrigger, {
      props: {
        defaultOpen: true,
        type: 'modal'
      },
      slots: {
        trigger: ({open}: {open: () => void}) => h('button', {onClick: open, type: 'button'}, 'Open dialog'),
        default: () => h('div', 'Dialog body')
      }
    });

    wrapper.unmount();
    expect(warn).toHaveBeenCalledWith('A DialogTrigger unmounted while open. This is likely due to being placed within a trigger that unmounts or inside a conditional. Consider using a DialogContainer instead.');
    warn.mockRestore();
  });

  it('emits model updates and change events from picker selections', async () => {
    let wrapper = mount(Picker, {
      props: {
        modelValue: 'Q2',
        label: 'Roadmap milestone',
        items: ['Q1', 'Q2', 'Q3']
      }
    });

    await wrapper.get('select.vs-picker__select').trigger('focus');
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([true]);

    await wrapper.get('select.vs-picker__select').setValue('Q3');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Q3']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['Q3']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['Q3']);

    await wrapper.get('select.vs-picker__select').trigger('blur');
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false]);
  });

  it('maps picker aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(Picker, {
      props: {
        items: ['option-1'],
        label: '',
        modelValue: 'option-1'
      },
      attrs: {
        'aria-labelledby': 'external-picker-label'
      }
    });

    let labelledBySelect = labelledByWrapper.get('select.vs-picker__select');
    expect(labelledBySelect.attributes('aria-labelledby')).toBe('external-picker-label');
    expect(labelledBySelect.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let visibleLabelWrapper = mount(Picker, {
      props: {
        items: ['option-1'],
        label: 'Roadmap milestone',
        modelValue: 'option-1'
      }
    });

    let visibleLabel = visibleLabelWrapper.get('span.vs-picker__label');
    let visibleLabelSelect = visibleLabelWrapper.get('select.vs-picker__select');
    expect(visibleLabelSelect.attributes('aria-labelledby')).toBe(visibleLabel.attributes('id'));
    expect(visibleLabelSelect.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(Picker, {
      props: {
        items: ['option-1'],
        label: '',
        modelValue: 'option-1'
      },
      attrs: {
        'aria-label': 'Roadmap milestone'
      }
    });

    let ariaLabelSelect = ariaLabelWrapper.get('select.vs-picker__select');
    expect(ariaLabelSelect.attributes('aria-label')).toBe('Roadmap milestone');
    expect(ariaLabelSelect.attributes('aria-labelledby')).toBeUndefined();
  });

  it('maps picker disabled, invalid, hovered, and placeholder classes', async () => {
    let disabledInvalidWrapper = mount(Picker, {
      props: {
        modelValue: '',
        isDisabled: true,
        isInvalid: true,
        items: ['One']
      }
    });

    let disabledDropdown = disabledInvalidWrapper.get('.spectrum-Dropdown');
    expect(disabledDropdown.classes()).toContain('is-disabled');
    expect(disabledDropdown.classes()).not.toContain('is-invalid');
    expect(disabledInvalidWrapper.get('select.vs-picker__select').classes()).toContain('is-placeholder');

    let interactiveWrapper = mount(Picker, {
      props: {
        modelValue: '',
        isInvalid: true,
        items: ['One']
      }
    });

    expect(interactiveWrapper.get('.spectrum-Dropdown').classes()).toContain('is-invalid');
    await interactiveWrapper.get('.vs-picker__dropdown').trigger('mouseenter');
    expect(interactiveWrapper.get('select.vs-picker__select').classes()).toContain('is-hovered');
  });

  it('maps picker disabledKeys to disabled option contracts', async () => {
    let wrapper = mount(Picker, {
      props: {
        items: [
          {id: 'option-1', label: 'Option 1'},
          {id: 'option-2', label: 'Option 2'},
          {id: 'option-3', label: 'Option 3'}
        ],
        disabledKeys: new Set(['option-2']),
        modelValue: 'option-1'
      }
    });

    let options = wrapper.findAll('select.vs-picker__select option');
    let disabledOption = options.find((option) => option.attributes('value') === 'option-2');
    expect(disabledOption?.attributes('disabled')).toBeDefined();

    await wrapper.get('select.vs-picker__select').setValue('option-3');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['option-3']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['option-3']);
  });

  it('maps listbox option interaction and selectable/selected classes', async () => {
    let wrapper = mount(ListBox, {
      props: {
        items: ['Vue', 'React'],
        modelValue: 'Vue',
        selectionMode: 'single',
        ariaLabel: 'Frameworks'
      }
    });

    let items = wrapper.findAll('button.vs-listbox__item');
    expect(items).toHaveLength(2);
    expect(items[0].classes()).toContain('is-selected');
    expect(items[0].classes()).toContain('is-selectable');
    expect(items[0].attributes('aria-label')).toBe('Vue');
    expect(items[0].attributes('data-key')).toBe('Vue');

    await items[1].trigger('mouseenter');
    expect(items[1].classes()).toContain('is-hovered');
    await items[1].trigger('focus');
    expect(items[1].classes()).toContain('is-focused');
    expect(items[1].classes()).toContain('focus-ring');
    await items[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['React']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['React']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['React']);
  });

  it('maps listbox disabled key iterable to disabled option classes and blocked selection', async () => {
    let wrapper = mount(ListBox, {
      props: {
        items: ['Aardvark', 'Kangaroo', 'Snake'],
        disabledKeys: new Set(['Kangaroo']),
        modelValue: 'Aardvark',
        selectionMode: 'single'
      }
    });

    let items = wrapper.findAll('button.vs-listbox__item');
    expect(items).toHaveLength(3);
    expect(items[1].classes()).toContain('is-disabled');
    expect(items[1].attributes('disabled')).toBeDefined();
    expect(items[1].attributes('aria-disabled')).toBe('true');

    await items[1].trigger('mouseenter');
    expect(items[1].classes()).not.toContain('is-hovered');
    await items[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('select')).toBeUndefined();
    expect(wrapper.emitted('selectionChange')).toBeUndefined();
  });

  it('accepts listbox modelValue as a Set iterable in multiple selection mode', async () => {
    let wrapper = mount(ListBox, {
      props: {
        items: ['Aardvark', 'Kangaroo', 'Snake'],
        modelValue: new Set(['Aardvark']),
        selectionMode: 'multiple'
      }
    });

    let items = wrapper.findAll('button.vs-listbox__item');
    expect(items[0].classes()).toContain('is-selected');
    expect(items[1].classes()).not.toContain('is-selected');

    await items[1].trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['Aardvark', 'Kangaroo']);
    let emittedSelection = wrapper.emitted('select')?.[0]?.[0] as unknown;
    expect(emittedSelection).toBeInstanceOf(Set);
    expect(Array.from(emittedSelection as Set<string>)).toEqual(['Aardvark', 'Kangaroo']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<string>)).toEqual(['Aardvark', 'Kangaroo']);
  });

  it('renders listbox link-backed items as anchors and keeps disabled-link contracts', async () => {
    let wrapper = mount(ListBox, {
      props: {
        items: [
          {id: 'adobe', textValue: 'Adobe', href: 'https://adobe.com/'},
          {id: 'google', textValue: 'Google', href: 'https://google.com/'},
          {id: 'disabled-link', textValue: 'Disabled link', href: 'https://example.com/'},
          {id: 'non-link', textValue: 'Non link'}
        ],
        disabledKeys: new Set(['disabled-link']),
        selectionMode: 'none'
      }
    });

    let links = wrapper.findAll('a.vs-listbox__item');
    expect(links).toHaveLength(3);
    expect(links[0].attributes('href')).toBe('https://adobe.com/');
    expect(links[1].attributes('href')).toBe('https://google.com/');
    expect(links[2].attributes('aria-disabled')).toBe('true');

    await links[2].trigger('click');
    expect(wrapper.emitted('select')).toBeUndefined();

    let buttons = wrapper.findAll('button.vs-listbox__item');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].text()).toBe('Non link');
  });

  it('renders listbox section items with group headings and multiple selection updates', async () => {
    let wrapper = mount(ListBox, {
      props: {
        ariaLabel: 'List organisms',
        items: [
          {
            id: 'people',
            title: 'People',
            items: [
              {id: 'David', textValue: 'David'},
              {id: 'Sam', textValue: 'Sam'}
            ]
          },
          {
            id: 'animals',
            title: 'Animals',
            items: [
              {id: 'Kangaroo', textValue: 'Kangaroo'},
              {id: 'Snake', textValue: 'Snake'}
            ]
          }
        ],
        selectionMode: 'multiple',
        modelValue: new Set(['Sam'])
      }
    });

    expect(wrapper.findAll('.vs-listbox__section')).toHaveLength(2);
    expect(wrapper.findAll('.vs-listbox__section-heading').map((heading) => heading.text())).toEqual(['People', 'Animals']);
    expect(wrapper.findAll('button.vs-listbox__item.is-selected').map((item) => item.text())).toEqual(['Sam']);

    let kangarooOption = wrapper.findAll('button.vs-listbox__item').find((item) => item.text() === 'Kangaroo');
    expect(kangarooOption).toBeDefined();
    await kangarooOption?.trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['Sam', 'Kangaroo']);
    let emittedSelection = wrapper.emitted('select')?.[0]?.[0] as unknown;
    expect(emittedSelection).toBeInstanceOf(Set);
    expect(Array.from(emittedSelection as Set<string>)).toEqual(['Sam', 'Kangaroo']);
  });

  it('uses section item ids for keyed listbox selection and disabled contracts', async () => {
    let wrapper = mount(ListBox, {
      props: {
        items: [
          {
            id: 'section-1',
            title: 'Section 1',
            items: [
              {id: '2', textValue: 'Two'},
              {id: '3', textValue: 'Three'}
            ]
          },
          {
            id: 'section-2',
            title: 'Section 2',
            items: [
              {id: '5', textValue: 'Five'}
            ]
          }
        ],
        selectionMode: 'multiple',
        modelValue: new Set(['2']),
        disabledKeys: new Set(['3'])
      }
    });

    expect(wrapper.findAll('.vs-listbox__section').map((section) => section.attributes('data-key'))).toEqual(['section-1', 'section-2']);

    let selectedTwo = wrapper.get('button.vs-listbox__item[data-key="2"]');
    let disabledThree = wrapper.get('button.vs-listbox__item[data-key="3"]');
    let selectableFive = wrapper.get('button.vs-listbox__item[data-key="5"]');

    expect(selectedTwo.classes()).toContain('is-selected');
    expect(disabledThree.classes()).toContain('is-disabled');
    expect(disabledThree.attributes('disabled')).toBeDefined();
    expect(disabledThree.attributes('aria-disabled')).toBe('true');

    await selectableFive.trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['2', '5']);
    let emittedSelection = wrapper.emitted('select')?.[0]?.[0] as unknown;
    expect(emittedSelection).toBeInstanceOf(Set);
    expect(Array.from(emittedSelection as Set<string>)).toEqual(['2', '5']);

    await disabledThree.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('select')).toHaveLength(1);
  });

  it('renders listbox sections without headings when only aria labels are provided', () => {
    let wrapper = mount(ListBox, {
      props: {
        items: [
          {
            id: 'animals',
            ariaLabel: 'Animals',
            items: [
              {id: 'Aardvark', textValue: 'Aardvark'},
              {id: 'Kangaroo', textValue: 'Kangaroo'}
            ]
          },
          {
            id: 'people',
            ariaLabel: 'People',
            items: [
              {id: 'Danni', textValue: 'Danni'},
              {id: 'Devon', textValue: 'Devon'}
            ]
          }
        ]
      }
    });

    expect(wrapper.findAll('.vs-listbox__section')).toHaveLength(2);
    expect(wrapper.findAll('.vs-listbox__section-heading')).toHaveLength(0);
    expect(wrapper.findAll('.vs-listbox__section').map((section) => section.attributes('aria-label'))).toEqual(['Animals', 'People']);
  });

  it('maps list view item state classes and hidden insertion indicators', async () => {
    let wrapper = mount(ListView, {
      props: {
        label: 'Frameworks',
        items: ['React', 'Vue', 'Svelte'],
        modelValue: 'React',
        selectionMode: 'single'
      }
    });

    let items = wrapper.findAll('button.vs-listbox__item');
    expect(items).toHaveLength(3);
    expect(items[0].classes()).toContain('is-selected');

    await items[2].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Svelte']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['Svelte']);
    expect(wrapper.find('[aria-hidden=\"true\"][hidden]').exists()).toBe(true);
  });

  it('supports list view selection aliases and disabled behaviors', async () => {
    let onAction = vi.fn();
    let onSelectionChange = vi.fn();
    let wrapper = mount(ListView, {
      props: {
        items: [
          {key: 'a', name: 'Adobe Photoshop'},
          {key: 'b', name: 'Documents'}
        ],
        selectionMode: 'multiple',
        selectedKeys: ['a'],
        disabledKeys: new Set(['b']),
        disabledBehavior: 'selection',
        overflowMode: 'wrap',
        onAction,
        onSelectionChange
      }
    });

    let items = wrapper.findAll('button.vs-listbox__item');
    expect(items[1].classes()).toContain('is-disabled');
    expect(wrapper.classes()).toContain('react-spectrum-ListView--wrap');

    await items[1].trigger('click');
    expect(onAction).toHaveBeenCalledWith('b');
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined();

    await items[0].trigger('click');
    let emittedSelectedKeys = wrapper.emitted('update:selectedKeys')?.[0]?.[0] as unknown;
    expect(emittedSelectedKeys).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectedKeys as Set<string>)).toEqual([]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    let onSelectionChangeValue = onSelectionChange.mock.calls[0]?.[0] as unknown;
    expect(onSelectionChangeValue).toBeInstanceOf(Set);
    expect(Array.from(onSelectionChangeValue as Set<string>)).toEqual([]);

    let allDisabled = mount(ListView, {
      props: {
        items: [
          {key: 'a', name: 'Adobe Photoshop'},
          {key: 'b', name: 'Documents'}
        ],
        disabledKeys: new Set(['b']),
        disabledBehavior: 'all',
        onAction
      }
    });

    await allDisabled.findAll('button.vs-listbox__item')[1].trigger('click');
    expect(onAction).toHaveBeenCalledTimes(2);
  });

  it('warns when list view drag/drop hooks toggle across renders', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let wrapper = mount(ListView, {
      props: {
        items: ['React'],
        dragAndDropHooks: {
          useDraggableCollectionState: () => {},
          useDroppableCollectionState: () => {}
        }
      }
    });

    await wrapper.setProps({
      dragAndDropHooks: {
        useDraggableCollectionState: () => {}
      }
    });
    expect(warn).toHaveBeenCalledWith('Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');

    warn.mockClear();

    await wrapper.setProps({
      dragAndDropHooks: undefined
    });
    expect(warn).toHaveBeenCalledWith('Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    warn.mockRestore();
  });

  it('accepts list view iterable modelValue and selectedKeys sets', async () => {
    let modelValueWrapper = mount(ListView, {
      props: {
        items: [
          {key: 'a', name: 'Adobe Photoshop'},
          {key: 'b', name: 'Documents'}
        ],
        selectionMode: 'multiple',
        modelValue: new Set(['a'])
      }
    });

    let modelItems = modelValueWrapper.findAll('button.vs-listbox__item');
    expect(modelItems[0].classes()).toContain('is-selected');
    expect(modelItems[1].classes()).not.toContain('is-selected');

    await modelItems[1].trigger('click');
    let emittedModelValue = modelValueWrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['a', 'b']);
    let emittedSelectedKeys = modelValueWrapper.emitted('update:selectedKeys')?.[0]?.[0] as unknown;
    expect(emittedSelectedKeys).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectedKeys as Set<string>)).toEqual(['a', 'b']);

    let selectedKeysWrapper = mount(ListView, {
      props: {
        items: [
          {key: 'a', name: 'Adobe Photoshop'},
          {key: 'b', name: 'Documents'}
        ],
        selectionMode: 'multiple',
        selectedKeys: new Set(['b'])
      }
    });

    let selectedItems = selectedKeysWrapper.findAll('button.vs-listbox__item');
    expect(selectedItems[0].classes()).not.toContain('is-selected');
    expect(selectedItems[1].classes()).toContain('is-selected');
  });

  it('maps menu selectable/open/expanded states and aria visibility signals', async () => {
    let wrapper = mount(Menu, {
      props: {
        label: 'Actions',
        isExpanded: true,
        selectionMode: 'single',
        openKeys: new Set(['share']),
        modelValue: 'edit',
        items: [
          {key: 'edit', label: 'Edit'},
          {key: 'share', label: 'Share', children: [{key: 'copy', label: 'Copy link'}]}
        ]
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Menu-wrapper');
    expect(wrapper.classes()).toContain('is-expanded');
    expect(wrapper.attributes('data-testid')).toBe('menu-wrapper');

    let menuItems = wrapper.findAll('.vs-spectrum-menu__item');
    expect(menuItems[0].classes()).toContain('is-selected');
    expect(menuItems[0].classes()).toContain('is-selectable');
    expect(menuItems[1].classes()).toContain('is-open');
    expect(wrapper.find('.vs-spectrum-menu__submenu').attributes('aria-hidden')).toBe('false');

    await menuItems[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['edit']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['edit']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['edit']);
  });

  it('accepts menu iterable defaultSelectedKeys and openKeys sets', async () => {
    let wrapper = mount(Menu, {
      props: {
        label: 'Actions',
        selectionMode: 'multiple',
        defaultSelectedKeys: new Set(['edit']),
        openKeys: new Set(['share']),
        items: [
          {key: 'edit', label: 'Edit'},
          {key: 'share', label: 'Share', children: [{key: 'copy', label: 'Copy link'}]}
        ]
      }
    });

    let editButton = wrapper.get('.vs-spectrum-menu__item[aria-label="Edit"]');
    let shareButton = wrapper.get('.vs-spectrum-menu__item[aria-label="Share"]');
    expect(editButton.classes()).toContain('is-selected');
    expect(shareButton.classes()).toContain('is-open');
    expect(wrapper.get('.vs-spectrum-menu__submenu').attributes('aria-hidden')).toBe('false');

    await editButton.trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<number | string>)).toEqual([]);
    let emittedSelect = wrapper.emitted('select')?.[0]?.[0] as unknown;
    expect(emittedSelect).toBeInstanceOf(Set);
    expect(Array.from(emittedSelect as Set<number | string>)).toEqual([]);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<number | string>)).toEqual([]);
  });

  it('accepts menu iterable modelValue in multiple selection mode', async () => {
    let wrapper = mount(Menu, {
      props: {
        selectionMode: 'multiple',
        modelValue: new Set(['edit']),
        items: [
          {key: 'edit', label: 'Edit'},
          {key: 'delete', label: 'Delete'}
        ]
      }
    });

    let editButton = wrapper.get('.vs-spectrum-menu__item[aria-label="Edit"]');
    let deleteButton = wrapper.get('.vs-spectrum-menu__item[aria-label="Delete"]');
    expect(editButton.classes()).toContain('is-selected');
    expect(editButton.attributes('aria-checked')).toBe('true');

    await deleteButton.trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<number | string>)).toEqual(['edit', 'delete']);
    let emittedSelect = wrapper.emitted('select')?.[0]?.[0] as unknown;
    expect(emittedSelect).toBeInstanceOf(Set);
    expect(Array.from(emittedSelect as Set<number | string>)).toEqual(['edit', 'delete']);
    let emittedSelectionChange = wrapper.emitted('selectionChange')?.[0]?.[0] as unknown;
    expect(emittedSelectionChange).toBeInstanceOf(Set);
    expect(Array.from(emittedSelectionChange as Set<number | string>)).toEqual(['edit', 'delete']);
  });

  it('maps menu trigger parity props, disabled keys, and close-on-select submenu behavior', async () => {
    let wrapper = mount(Menu, {
      props: {
        align: 'end',
        autoFocus: 'first',
        closeOnSelect: true,
        direction: 'left',
        disabledKeys: new Set(['delete']),
        selectionMode: 'single',
        items: [
          {key: 'edit', label: 'Edit'},
          {key: 'delete', label: 'Delete'},
          {key: 'share', label: 'Share', children: [{key: 'copy', label: 'Copy link'}]}
        ],
        shouldFlip: false,
        shouldFocusWrap: false,
        trigger: 'longPress'
      }
    });

    expect(wrapper.attributes('data-align')).toBe('end');
    expect(wrapper.attributes('data-auto-focus')).toBe('first');
    expect(wrapper.attributes('data-direction')).toBe('left');
    expect(wrapper.attributes('data-should-flip')).toBe('false');
    expect(wrapper.attributes('data-should-focus-wrap')).toBe('false');
    expect(wrapper.attributes('data-trigger')).toBe('longPress');
    expect(wrapper.attributes('data-close-on-select')).toBe('true');

    let disabledButton = wrapper.get('.vs-spectrum-menu__item[aria-label="Delete"]');
    expect(disabledButton.attributes('aria-disabled')).toBe('true');
    await disabledButton.trigger('click');
    expect(wrapper.emitted('action')).toBeUndefined();

    let submenuTrigger = wrapper.get('.vs-spectrum-menu__item[aria-label="Share"]');
    await submenuTrigger.trigger('click');
    await nextTick();
    expect(wrapper.get('.vs-spectrum-menu__submenu').attributes('aria-hidden')).toBe('false');
    let emittedOpen = wrapper.emitted('openChange')?.[0]?.[0] as unknown;
    expect(emittedOpen).toBeInstanceOf(Set);
    expect(Array.from(emittedOpen as Set<number | string>)).toEqual(['share']);

    await wrapper.get('.vs-spectrum-menu__submenu .vs-spectrum-menu__item[aria-label="Copy link"]').trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['copy']);
    expect(wrapper.emitted('selectionChange')?.[0]).toEqual(['copy']);
    let emittedClosedOpen = wrapper.emitted('openChange')?.[1]?.[0] as unknown;
    expect(emittedClosedOpen).toBeInstanceOf(Set);
    expect(Array.from(emittedClosedOpen as Set<number | string>)).toEqual([]);
    expect(wrapper.get('.vs-spectrum-menu__submenu').attributes('aria-hidden')).toBe('true');
  });

  it('supports keyboard navigation within menu items', async () => {
    let wrapper = mount(Menu, {
      attachTo: document.body,
      props: {
        shouldFocusWrap: false,
        items: [
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two', disabled: true},
          {key: 'three', label: 'Three'}
        ]
      }
    });

    let one = wrapper.get('.vs-spectrum-menu__item[aria-label="One"]');
    let three = wrapper.get('.vs-spectrum-menu__item[aria-label="Three"]');

    await one.trigger('focus');
    await one.trigger('keydown', {key: 'ArrowDown'});
    expect(document.activeElement).toBe(three.element);

    await three.trigger('keydown', {key: 'ArrowDown'});
    expect(document.activeElement).toBe(three.element);

    await three.trigger('keydown', {key: 'Home'});
    expect(document.activeElement).toBe(one.element);

    await one.trigger('keydown', {key: 'End'});
    expect(document.activeElement).toBe(three.element);

    wrapper.unmount();
  });

  it('supports keyboard open/close for submenu items', async () => {
    let wrapper = mount(Menu, {
      attachTo: document.body,
      props: {
        items: [
          {key: 'share', label: 'Share', children: [{key: 'copy', label: 'Copy link'}]},
          {key: 'delete', label: 'Delete'}
        ]
      }
    });

    let share = wrapper.get('.vs-spectrum-menu__item[aria-label="Share"]');
    await share.trigger('focus');
    await share.trigger('keydown', {key: 'ArrowRight'});
    await nextTick();

    expect(wrapper.get('.vs-spectrum-menu__submenu').attributes('aria-hidden')).toBe('false');
    let copy = wrapper.get('.vs-spectrum-menu__submenu .vs-spectrum-menu__item[aria-label="Copy link"]');
    expect(document.activeElement).toBe(copy.element);

    await copy.trigger('keydown', {key: 'ArrowLeft'});
    await nextTick();
    expect(wrapper.get('.vs-spectrum-menu__submenu').attributes('aria-hidden')).toBe('true');
    expect(document.activeElement).toBe(share.element);

    wrapper.unmount();
  });

  it('emits dismiss on Escape from top-level menu items', async () => {
    let wrapper = mount(Menu, {
      attachTo: document.body,
      props: {
        openKeys: new Set(['share']),
        items: [
          {key: 'share', label: 'Share', children: [{key: 'copy', label: 'Copy link'}]},
          {key: 'delete', label: 'Delete'}
        ]
      }
    });

    let deleteItem = wrapper.get('.vs-spectrum-menu__item[aria-label="Delete"]');
    await deleteItem.trigger('focus');
    await deleteItem.trigger('keydown', {key: 'Escape'});
    await nextTick();

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    let emittedOpenKeys = wrapper.emitted('openChange')?.[0]?.[0] as unknown;
    expect(emittedOpenKeys).toBeInstanceOf(Set);
    expect(Array.from(emittedOpenKeys as Set<number | string>)).toEqual([]);

    wrapper.unmount();
  });

  it('emits dismiss on outside click when menu is expanded', async () => {
    let wrapper = mount(Menu, {
      attachTo: document.body,
      props: {
        isExpanded: true,
        items: [
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'}
        ]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    document.body.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    await nextTick();

    expect(wrapper.emitted('dismiss')).toHaveLength(1);
    let emittedOpenKeys = wrapper.emitted('openChange')?.[0]?.[0] as unknown;
    expect(emittedOpenKeys).toBeInstanceOf(Set);
    expect(Array.from(emittedOpenKeys as Set<number | string>)).toEqual([]);

    wrapper.unmount();
  });

  it('opens and dismisses menu trigger from Escape and outside clicks', async () => {
    let wrapper = mount(MenuTrigger, {
      attachTo: document.body,
      props: {
        items: [
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'}
        ]
      },
      slots: {
        trigger: () => h(ActionButton, null, {default: () => 'Menu Button'})
      }
    });

    let triggerButton = wrapper.find('button');
    await triggerButton.trigger('click');
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(true);
    expect(wrapper.findAll('.vs-spectrum-menu__item.is-selected')).toHaveLength(0);
    expect((document.activeElement as HTMLElement | null)?.getAttribute('aria-label')).not.toBe('One');

    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(false);
    expect(document.activeElement).toBe(triggerButton.element);

    await triggerButton.trigger('click');
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));
    document.body.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(false);

    wrapper.unmount();
  });

  it('opens menu trigger from arrow keys with first and last focus strategies', async () => {
    let wrapper = mount(MenuTrigger, {
      attachTo: document.body,
      props: {
        items: [
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'}
        ]
      },
      slots: {
        trigger: () => h(ActionButton, null, {default: () => 'Menu Button'})
      }
    });

    let triggerButton = wrapper.find('button');
    await triggerButton.trigger('focus');
    await triggerButton.trigger('keydown', {key: 'ArrowDown'});
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(true);
    expect((document.activeElement as HTMLElement | null)?.getAttribute('aria-label')).toBe('One');

    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
    await nextTick();
    await triggerButton.trigger('focus');
    await triggerButton.trigger('keydown', {key: 'ArrowUp'});
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(true);
    expect((document.activeElement as HTMLElement | null)?.getAttribute('aria-label')).toBe('Three');

    wrapper.unmount();
  });

  it('closes menu trigger when clicking trigger while open', async () => {
    let wrapper = mount(MenuTrigger, {
      attachTo: document.body,
      props: {
        items: [
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'}
        ]
      },
      slots: {
        trigger: () => h(ActionButton, null, {default: () => 'Menu Button'})
      }
    });

    let triggerButton = wrapper.find('button');
    await triggerButton.trigger('click');
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(true);

    await triggerButton.trigger('click');
    await nextTick();
    expect(wrapper.find('.vs-spectrum-menu').exists()).toBe(false);

    wrapper.unmount();
  });

  it('renders menu link items as anchors and applies disabled link contracts', async () => {
    let wrapper = mount(Menu, {
      props: {
        selectionMode: 'none',
        disabledKeys: new Set(['apple']),
        items: [
          {key: 'adobe', label: 'Adobe', href: 'https://adobe.com'},
          {key: 'apple', label: 'Apple', href: 'https://apple.com'}
        ]
      }
    });

    let links = wrapper.findAll('a.vs-spectrum-menu__item');
    expect(links).toHaveLength(2);
    expect(wrapper.findAll('div.vs-spectrum-menu__item')).toHaveLength(0);
    expect(links[0].attributes('href')).toBe('https://adobe.com');
    expect(links[1].attributes('href')).toBe('https://apple.com');
    expect(links[0].attributes('aria-disabled')).toBeUndefined();
    expect(links[1].attributes('aria-disabled')).toBe('true');
    expect(links[1].classes()).toContain('is-disabled');

    await links[1].trigger('click');
    expect(wrapper.emitted('action')).toBeUndefined();
    expect(wrapper.emitted('select')).toBeUndefined();
  });

  it('maps table state classes, aria metadata, and hidden drop indicators', async () => {
    let wrapper = mount(Table, {
      attrs: {
        style: 'width: 420px;'
      },
      props: {
        caption: 'Dependencies',
        modelValue: 1,
        sortDescriptor: {
          column: 'name',
          direction: 'ascending'
        },
        openKeys: new Set([2]),
        columns: [
          {key: 'name', label: 'Name', sortable: true, resizable: true},
          {key: 'license', label: 'License'}
        ],
        rows: [
          {id: 1, name: 'Vue', license: 'MIT'},
          {id: 2, name: 'React', license: 'MIT', children: [{id: 'child'}]}
        ]
      }
    });

    expect(wrapper.classes()).toContain('spectrum-Table');
    expect((wrapper.element as HTMLElement).style.width).toBe('420px');
    expect(wrapper.get('thead.vs-table__head').classes()).toContain('spectrum-Table-headWrapper');
    expect(wrapper.get('tbody.vs-table__body').classes()).toContain('spectrum-Table-body');
    expect(wrapper.get('th.vs-table__head-cell').classes()).toContain('is-sortable');
    expect(wrapper.get('th.vs-table__head-cell').classes()).toContain('is-sorted-asc');
    expect(wrapper.get('button.vs-table__sort-button').classes()).toContain('spectrum-Table-headCellButton');

    let rows = wrapper.findAll('tr.vs-table__row');
    expect(rows[0].classes()).toContain('is-selected');
    expect(rows[0].attributes('aria-rowindex')).toBe('1');
    expect(rows[0].attributes('aria-selected')).toBe('true');
    expect(rows[1].classes()).toContain('is-open');
    expect(rows[1].get('.vs-table__open-toggle').classes()).toContain('is-open');

    await rows[1].trigger('mouseenter');
    expect(rows[1].classes()).toContain('is-hovered');
    await rows[1].trigger('mousedown');
    expect(rows[1].classes()).toContain('is-active');
    await rows[1].get('.vs-table__open-toggle').trigger('click');
    let emittedOpenKeys = wrapper.emitted('openChange')?.[0]?.[0] as unknown;
    expect(emittedOpenKeys).toBeInstanceOf(Set);
    expect(Array.from(emittedOpenKeys as Set<number | string>)).toEqual([]);

    await wrapper.get('button.vs-table__sort-button').trigger('click');
    expect(wrapper.emitted('sortChange')?.[0]).toEqual([{column: 'name', direction: 'descending'}]);
    expect(wrapper.find('.vs-table__insertion-indicator').exists()).toBe(true);
    expect(wrapper.find('[hidden][aria-hidden=\"true\"]').exists()).toBe(true);
  });

  it('warns when resizable table columns include child columns', () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount(Table, {
      props: {
        columns: [
          {
            key: 'group',
            label: 'Group',
            resizable: true,
            children: [{key: 'leaf', label: 'Leaf'}]
          } as unknown as {key: string, label: string}
        ],
        rows: [
          {id: 1, group: 'Value'}
        ]
      }
    });

    expect(warn).toHaveBeenCalledWith('Column key: group. Columns with child columns don\'t allow resizing.');
    warn.mockRestore();
  });

  it('warns when table drag/drop hooks toggle and with expandable rows', async () => {
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let wrapper = mount(Table, {
      props: {
        dragAndDropHooks: {
          useDraggableCollectionState: () => {},
          useDroppableCollectionState: () => {}
        },
        columns: [
          {key: 'name', label: 'Name'}
        ],
        rows: [
          {
            id: 1,
            name: 'Vue',
            children: [{id: '1-child', name: 'Vue child'}]
          }
        ]
      }
    });

    expect(warn).toHaveBeenCalledWith('Drag and drop is not yet fully supported with expandable rows and may produce unexpected results.');

    warn.mockClear();

    await wrapper.setProps({
      dragAndDropHooks: {
        useDraggableCollectionState: () => {}
      }
    });
    expect(warn).toHaveBeenCalledWith('Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    expect(warn).toHaveBeenCalledWith('Drag and drop is not yet fully supported with expandable rows and may produce unexpected results.');

    warn.mockClear();

    await wrapper.setProps({
      dragAndDropHooks: undefined
    });
    expect(warn).toHaveBeenCalledWith('Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.');
    warn.mockRestore();
  });

  it('renders selection checkbox column and select-all behavior in multiple mode', async () => {
    let wrapper = mount(Table, {
      props: {
        selectionMode: 'multiple',
        modelValue: [],
        columns: [
          {key: 'name', label: 'Name'},
          {key: 'license', label: 'License'}
        ],
        rows: [
          {id: 1, name: 'Vue', license: 'MIT'},
          {id: 2, name: 'React', license: 'MIT'}
        ]
      }
    });

    let selectAll = wrapper.get('thead input.vs-table__selection-checkbox');
    let rowSelection = wrapper.findAll('tbody.vs-table__body input.vs-table__selection-checkbox');
    expect(rowSelection).toHaveLength(2);
    expect(wrapper.findAll('th.vs-table__head-cell--selection')).toHaveLength(1);
    expect(selectAll.classes()).toContain('spectrum-Table-checkbox');

    await selectAll.setValue(true);
    let selectAllUpdate = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(selectAllUpdate).toBeInstanceOf(Set);
    expect(Array.from(selectAllUpdate as Set<number | string>)).toEqual([1, 2]);

    await rowSelection[0].setValue(true);
    let rowToggleUpdate = wrapper.emitted('update:modelValue')?.[1]?.[0] as unknown;
    expect(rowToggleUpdate).toBeInstanceOf(Set);
    expect(Array.from(rowToggleUpdate as Set<number | string>)).toEqual([1]);
  });

  it('maps table disabledKeys iterable rows to disabled contracts and blocked selection/action', async () => {
    let wrapper = mount(Table, {
      props: {
        selectionMode: 'multiple',
        modelValue: [],
        disabledKeys: new Set([2]),
        columns: [
          {key: 'name', label: 'Name'},
          {key: 'license', label: 'License'}
        ],
        rows: [
          {id: 1, name: 'Vue', license: 'MIT'},
          {id: 2, name: 'React', license: 'MIT'},
          {id: 3, name: 'Angular', license: 'MIT'}
        ]
      }
    });

    let rows = wrapper.findAll('tbody.vs-table__body tr.vs-table__row');
    expect(rows[1].classes()).toContain('is-disabled');
    expect(rows[1].attributes('tabindex')).toBe('-1');

    let rowSelection = wrapper.findAll('tbody.vs-table__body input.vs-table__selection-checkbox');
    expect(rowSelection[1].attributes('disabled')).toBeDefined();

    let selectAll = wrapper.get('thead input.vs-table__selection-checkbox');
    await selectAll.setValue(true);
    let disabledSelectAllUpdate = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(disabledSelectAllUpdate).toBeInstanceOf(Set);
    expect(Array.from(disabledSelectAllUpdate as Set<number | string>)).toEqual([1, 3]);

    await rows[1].trigger('click');
    expect((wrapper.emitted('update:modelValue') ?? []).length).toBe(1);
    expect(wrapper.emitted('rowAction')).toBeUndefined();
  });

  it('accepts table modelValue as a Set iterable in multiple selection mode', async () => {
    let wrapper = mount(Table, {
      props: {
        selectionMode: 'multiple',
        modelValue: new Set([1, 3]),
        columns: [
          {key: 'name', label: 'Name'},
          {key: 'license', label: 'License'}
        ],
        rows: [
          {id: 1, name: 'Vue', license: 'MIT'},
          {id: 2, name: 'React', license: 'MIT'},
          {id: 3, name: 'Angular', license: 'MIT'}
        ]
      }
    });

    let rows = wrapper.findAll('tbody.vs-table__body tr.vs-table__row');
    expect(rows[0].classes()).toContain('is-selected');
    expect(rows[1].classes()).not.toContain('is-selected');
    expect(rows[2].classes()).toContain('is-selected');

    await rows[1].trigger('click');
    let emittedSelection = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedSelection).toBeInstanceOf(Set);
    expect(Array.from(emittedSelection as Set<number | string>)).toEqual(expect.arrayContaining([1, 2, 3]));
  });

  it('maps table loadingState, divider width columns, and url cell rendering to parity contracts', () => {
    let wrapper = mount(Table, {
      props: {
        loadingState: 'loadingMore',
        columns: [
          {key: 'name', label: 'Name', showDivider: true, width: 240},
          {key: 'link', label: 'Link'},
          {key: 'date', label: 'Date', align: 'end'}
        ],
        rows: [
          {id: 1, name: 'React Spectrum', link: 'https://react-spectrum.adobe.com', date: '2026-02-20'}
        ]
      }
    });

    expect(wrapper.attributes('data-loading-state')).toBe('loadingMore');
    expect(wrapper.findAll('.spectrum-Table-cell--divider').length).toBeGreaterThan(0);
    expect(wrapper.get('th.vs-table__head-cell').attributes('style') ?? '').toContain('width: 240px');

    let link = wrapper.get('a.vs-table__cell-link');
    expect(link.attributes('href')).toBe('https://react-spectrum.adobe.com');
    expect(link.attributes('target')).toBe('_blank');

    expect(wrapper.text()).toContain('Loading more…');
  });

  it('updates model value from calendar date input', async () => {
    let wrapper = mount(Calendar, {
      props: {
        modelValue: ''
      }
    });

    await wrapper.get('input[type="date"]').setValue('2026-03-01');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-03-01']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-03-01']);
  });

  it('supports calendar compatibility aliases for value and bounds', async () => {
    let onChange = vi.fn();
    let wrapper = mount(Calendar, {
      props: {
        defaultValue: {year: 2026, month: 3, day: 15},
        minValue: new Date(2026, 2, 10),
        maxValue: '2026-03-20',
        onChange
      }
    });

    expect(wrapper.find('.spectrum-Calendar-date.is-selected').exists()).toBe(true);
    let input = wrapper.get('input[type="date"]');
    expect(input.attributes('min')).toBe('2026-03-10');
    expect(input.attributes('max')).toBe('2026-03-20');

    await input.setValue('2026-03-18');
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['2026-03-18']);
    expect(onChange).toHaveBeenCalledWith('2026-03-18');
  });

  it('applies spectrum calendar state classes for selected and unavailable dates', () => {
    let wrapper = mount(Calendar, {
      props: {
        max: '2026-03-20',
        min: '2026-03-10',
        modelValue: '2026-03-15'
      }
    });

    expect(wrapper.find('.spectrum-Calendar-date.is-selected').exists()).toBe(true);
    expect(wrapper.find('.spectrum-Calendar-date.is-unavailable').exists()).toBe(true);
    expect(wrapper.attributes('aria-label')).toBe('Calendar');
  });

  it('marks custom unavailable dates from isDateUnavailable in calendar', () => {
    let wrapper = mount(Calendar, {
      props: {
        defaultValue: '2026-03-15',
        isDateUnavailable: (date: Date) => date.getDay() === 0 || date.getDay() === 6
      }
    });

    expect(wrapper.find('.spectrum-Calendar-date.is-unavailable').exists()).toBe(true);
  });

  it('propagates v-model through range calendar inputs', async () => {
    let wrapper = mount({
      components: {RangeCalendar},
      data: () => ({
        range: {
          start: '',
          end: ''
        }
      }),
      template: `
        <RangeCalendar v-model="range" />
      `
    });

    let inputs = wrapper.findAll('input[type="date"]');
    await inputs[0].setValue('2026-03-01');
    await inputs[1].setValue('2026-03-05');
    expect((wrapper.vm as unknown as {range: {start: string, end: string}}).range).toEqual({
      start: '2026-03-01',
      end: '2026-03-05'
    });
  });

  it('supports range calendar compatibility aliases for value and bounds', async () => {
    let onChange = vi.fn();
    let wrapper = mount(RangeCalendar, {
      props: {
        defaultValue: {
          start: {year: 2026, month: 3, day: 10},
          end: {year: 2026, month: 3, day: 14}
        },
        minValue: new Date(2026, 2, 1),
        maxValue: '2026-03-20',
        onChange
      }
    });

    let inputs = wrapper.findAll('input[type="date"]');
    expect(inputs[0].attributes('min')).toBe('2026-03-01');
    expect(inputs[1].attributes('max')).toBe('2026-03-20');

    await inputs[1].setValue('2026-03-16');
    expect(wrapper.emitted('update:value')?.[0]?.[0]).toEqual({
      start: '2026-03-10',
      end: '2026-03-16'
    });
    expect(onChange).toHaveBeenCalledWith({
      start: '2026-03-10',
      end: '2026-03-16'
    });
  });

  it('applies range-selection classes for range calendar values', () => {
    let wrapper = mount(RangeCalendar, {
      props: {
        modelValue: {
          start: '2026-03-10',
          end: '2026-03-14'
        }
      }
    });

    expect(wrapper.find('.spectrum-Calendar-date.is-selection-start').exists()).toBe(true);
    expect(wrapper.find('.spectrum-Calendar-date.is-selection-end').exists()).toBe(true);
    expect(wrapper.find('.spectrum-Calendar-date.is-range-selection').exists()).toBe(true);
  });

  it('emits dropped files and wires aria-labelledby in drop zone', async () => {
    let wrapper = mount(DropZone, {
      props: {
        label: 'Upload files',
        isFilled: true,
        replaceMessage: 'Replace current file'
      }
    });

    let labelledby = wrapper.attributes('aria-labelledby');
    expect(labelledby).toContain('-heading');
    expect(labelledby).toContain('-message');
    expect(wrapper.find('.spectrum-Dropzone-banner').text()).toContain('Replace current file');

    let input = wrapper.get('input[type=\"file\"]');
    let file = new File(['abc'], 'asset.txt', {type: 'text/plain'});
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [file]
    });

    await input.trigger('input');
    expect(wrapper.emitted('filesDrop')?.[0]?.[0]?.[0]?.name).toBe('asset.txt');
  });

  it('does not emit drop events from disabled rac drop zone', async () => {
    let wrapper = mount(RacDropZone, {
      props: {
        isDisabled: true
      }
    });

    let dropZone = wrapper.get('.react-aria-DropZone');
    await dropZone.trigger('drop');
    expect(wrapper.emitted('drop')).toBeUndefined();
  });

  it('emits selected files from file trigger input', async () => {
    let wrapper = mount(FileTrigger, {
      props: {
        allowsMultiple: true
      },
      slots: {
        default: 'Select assets'
      }
    });

    let input = wrapper.get('input[type="file"]');
    let first = new File(['alpha'], 'alpha.txt', {type: 'text/plain'});
    let second = new File(['beta'], 'beta.txt', {type: 'text/plain'});

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [first, second]
    });

    await input.trigger('change');

    let selected = wrapper.emitted('select')?.[0]?.[0] as File[];
    let changed = wrapper.emitted('change')?.[0]?.[0] as File[];
    expect(selected.map((file) => file.name)).toEqual(['alpha.txt', 'beta.txt']);
    expect(changed.map((file) => file.name)).toEqual(['alpha.txt', 'beta.txt']);
  });

  it('maps file trigger DOM contract and forwards child press to hidden input', async () => {
    let wrapper = mount(FileTrigger, {
      slots: {
        default: () => h('button', {type: 'button'}, 'Upload')
      }
    });

    expect(wrapper.find('.vs-file-trigger').exists()).toBe(false);

    let input = wrapper.get('input[type="file"]');
    expect(input.attributes('class')).toBe('');
    expect(input.attributes('data-rac')).toBe('');
    expect(input.attributes('style')).toContain('display: none');

    let clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click').mockImplementation(() => undefined);
    await wrapper.get('button').trigger('click');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('maps file trigger directory contract to react parity', () => {
    let wrapper = mount(FileTrigger, {
      props: {
        acceptDirectory: true
      },
      slots: {
        default: () => h('button', {type: 'button'}, 'Upload directory')
      }
    });

    let input = wrapper.get('input[type="file"]');
    expect(input.attributes('webkitdirectory')).toBe('');
    expect(input.attributes('directory')).toBeUndefined();
  });

  it('maps tree hidden visibility signal and emits item actions', async () => {
    let hidden = mount(Tree, {
      props: {
        hidden: true,
        items: [{id: 'one', label: 'One'}]
      }
    });
    expect(hidden.attributes('hidden')).toBeDefined();
    expect(hidden.attributes('aria-hidden')).toBe('true');
    expect(hidden.find('.vs-tree__hidden-marker').attributes('hidden')).toBeDefined();

    let wrapper = mount(Tree, {
      props: {
        items: [
          {id: 'one', label: 'One'},
          {id: 'two', label: 'Two'}
        ]
      }
    });
    await wrapper.findAll('button.vs-tree__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two']);
    expect(wrapper.emitted('itemAction')?.[0]).toEqual([{id: 'two', label: 'Two'}]);
  });

  it('propagates v-model through radio group', async () => {
    let wrapper = mount({
      components: {Radio, RadioGroup},
      data: () => ({value: 'vue'}),
      template: `
        <RadioGroup v-model="value">
          <Radio value="vue">Vue</Radio>
          <Radio value="react">React</Radio>
        </RadioGroup>
      `
    });

    await wrapper.get('input[value="react"]').setValue(true);
    expect((wrapper.vm as unknown as {value: string}).value).toBe('react');
  });

  it('maps radio group field contract and radio state classes', async () => {
    let wrapper = mount({
      components: {Radio, RadioGroup},
      template: `
        <RadioGroup v-model="value" label="Framework" :is-invalid="true" description="Choose one.">
          <Radio value="vue">Vue</Radio>
        </RadioGroup>
      `,
      data() {
        return {
          value: 'vue'
        };
      }
    });

    let field = wrapper.get('.spectrum-Field.spectrum-FieldGroup');
    expect(field.classes()).not.toContain('vs-radio-group');
    let group = field.get('[role="radiogroup"]');
    expect(group.classes()).toContain('spectrum-FieldGroup-group');
    expect(group.classes()).toContain('spectrum-Field-field');
    expect(group.attributes('aria-invalid')).toBe('true');
    expect(wrapper.find('.spectrum-HelpText-text').text()).toContain('Choose one.');

    let radio = wrapper.get('label.spectrum-Radio');
    await radio.trigger('mouseenter');
    expect(radio.classes()).toContain('is-hovered');
    expect(radio.classes()).toContain('is-invalid');
    expect(radio.classes()).not.toContain('vs-radio');

    await wrapper.get('input.spectrum-Radio-input').trigger('focus');
    expect(radio.classes()).not.toContain('focus-ring');

    let radioInput = wrapper.get('input.spectrum-Radio-input').element as HTMLInputElement;
    let radioOriginalMatches = radioInput.matches.bind(radioInput);
    let radioMatchesSpy = vi.spyOn(radioInput, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }
      return radioOriginalMatches(selector);
    });

    await wrapper.get('input.spectrum-Radio-input').trigger('focus');
    expect(radio.classes()).toContain('focus-ring');
    radioMatchesSpy.mockRestore();
    expect(wrapper.get('input.spectrum-Radio-input').attributes('tabindex')).toBe('0');

    let disabled = mount({
      components: {Radio, RadioGroup},
      template: `
        <RadioGroup v-model="value" :is-disabled="true">
          <Radio value="vue">Vue</Radio>
        </RadioGroup>
      `,
      data() {
        return {
          value: 'vue'
        };
      }
    });
    expect(disabled.get('label.spectrum-Radio').classes()).toContain('is-disabled');
    expect(disabled.get('input.spectrum-Radio-input').attributes('disabled')).toBeDefined();
  });

  it('matches radio roving tabindex behavior with group selection parity', async () => {
    let wrapper = mount({
      components: {Radio, RadioGroup},
      template: `
        <RadioGroup v-model="value">
          <Radio value="vue">Vue</Radio>
          <Radio value="react">React</Radio>
        </RadioGroup>
      `,
      data() {
        return {
          value: ''
        };
      }
    });

    let inputs = wrapper.findAll('input.spectrum-Radio-input');
    expect(inputs[0]?.attributes('tabindex')).toBe('0');
    expect(inputs[1]?.attributes('tabindex')).toBe('-1');

    await inputs[1]?.trigger('focus');
    inputs = wrapper.findAll('input.spectrum-Radio-input');
    expect(inputs[0]?.attributes('tabindex')).toBe('-1');
    expect(inputs[1]?.attributes('tabindex')).toBe('0');

    await inputs[1]?.setValue(true);
    inputs = wrapper.findAll('input.spectrum-Radio-input');
    expect(inputs[0]?.attributes('tabindex')).toBe('-1');
    expect(inputs[1]?.attributes('tabindex')).toBe('0');

    let disabledLeadingOption = mount({
      components: {Radio, RadioGroup},
      template: `
        <RadioGroup v-model="value">
          <Radio :is-disabled="true" value="vue">Vue</Radio>
          <Radio value="react">React</Radio>
        </RadioGroup>
      `,
      data() {
        return {
          value: ''
        };
      }
    });

    let disabledInputs = disabledLeadingOption.findAll('input.spectrum-Radio-input');
    expect(disabledInputs[0]?.attributes('tabindex')).toBeUndefined();
    expect(disabledInputs[1]?.attributes('tabindex')).toBe('0');
  });

  it('maps radio aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(Radio, {
      attrs: {
        'aria-labelledby': 'external-radio-label'
      },
      props: {
        value: 'vue'
      },
      slots: {
        default: 'Vue'
      }
    });

    let labelledByInput = labelledByWrapper.get('input.spectrum-Radio-input');
    let visibleLabel = labelledByWrapper.get('.spectrum-Radio-label');
    expect(labelledByInput.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(labelledByInput.attributes('aria-labelledby')).toContain('external-radio-label');
    expect(labelledByInput.attributes('aria-label')).toBeUndefined();
    expect(labelledByWrapper.attributes('aria-labelledby')).toBeUndefined();

    let ariaLabelWrapper = mount(Radio, {
      attrs: {
        'aria-label': 'Vue'
      },
      props: {
        label: '',
        value: 'vue'
      }
    });

    let ariaLabelInput = ariaLabelWrapper.get('input.spectrum-Radio-input');
    expect(ariaLabelInput.attributes('aria-label')).toBe('Vue');
    expect(ariaLabelInput.attributes('aria-labelledby')).toBeUndefined();
    expect(ariaLabelWrapper.attributes('aria-label')).toBeUndefined();

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Radio, {
      props: {
        label: '',
        value: 'radio-no-label'
      }
    });
    expect(warn).toHaveBeenCalledWith('If you do not provide children, you must specify an aria-label for accessibility');
    warn.mockRestore();
  });

  it('maps radio group aria label and labelledby precedence to react parity', () => {
    let labelledByWrapper = mount(RadioGroup, {
      attrs: {
        'aria-labelledby': 'external-radio-group-label'
      },
      props: {
        label: 'Framework'
      }
    });

    let visibleLabel = labelledByWrapper.get('.spectrum-FieldLabel');
    let group = labelledByWrapper.get('[role="radiogroup"]');
    expect(group.attributes('aria-labelledby')).toContain(visibleLabel.attributes('id'));
    expect(group.attributes('aria-labelledby')).toContain('external-radio-group-label');
    expect(group.attributes('aria-label')).toBeUndefined();

    let ariaLabelWrapper = mount(RadioGroup, {
      attrs: {
        'aria-label': 'Framework'
      },
      props: {
        label: ''
      }
    });

    let ariaLabelGroup = ariaLabelWrapper.get('[role="radiogroup"]');
    expect(ariaLabelGroup.attributes('aria-label')).toBe('Framework');
    expect(ariaLabelGroup.attributes('aria-labelledby')).toBeUndefined();
  });

  it('maps accordion disclosure state classes and hidden/aria-hidden panel signals', async () => {
    let wrapper = mount({
      components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
      data() {
        return {
          expanded: ['one']
        };
      },
      template: `
        <Accordion v-model="expanded">
          <Disclosure id="one">
            <DisclosureTitle>One</DisclosureTitle>
            <DisclosurePanel>Panel one</DisclosurePanel>
          </Disclosure>
          <Disclosure id="two">
            <DisclosureTitle>Two</DisclosureTitle>
            <DisclosurePanel>Panel two</DisclosurePanel>
          </Disclosure>
        </Accordion>
      `
    });

    let items = wrapper.findAll('.spectrum-Accordion-item');
    expect(items[0].classes()).toContain('is-expanded');
    expect(items[1].classes()).not.toContain('is-expanded');

    let secondPanel = wrapper.get('#two-panel');
    expect(secondPanel.attributes('hidden')).toBeDefined();
    expect(secondPanel.attributes('aria-hidden')).toBe('true');
    expect(secondPanel.attributes('role')).toBe('group');
    expect(secondPanel.classes()).toContain('spectrum-Accordion-itemContent');
    expect(secondPanel.attributes('hidden')).not.toBeUndefined();

    let secondTrigger = wrapper.get('#two-trigger');
    let indicator = secondTrigger.find('.spectrum-Accordion-itemIndicator');
    expect(indicator.exists()).toBe(true);
    expect(indicator.element.tagName.toLowerCase()).toBe('svg');
    await secondTrigger.trigger('mouseenter');
    expect(secondTrigger.classes()).toContain('is-hovered');
    await secondTrigger.trigger('mousedown');
    expect(secondTrigger.classes()).toContain('is-pressed');
    await secondTrigger.trigger('focus');
    expect(secondTrigger.classes()).not.toContain('focus-ring');
    await secondTrigger.trigger('mouseup');
    await secondTrigger.trigger('blur');
    await secondTrigger.trigger('focus');
    expect(secondTrigger.classes()).toContain('focus-ring');

    await secondTrigger.trigger('click');
    await nextTick();
    let expandedKeys = (wrapper.vm as unknown as {expanded: Iterable<string>}).expanded;
    expect(Array.from(expandedKeys)).toEqual(['one', 'two']);
    expect(wrapper.get('#two-panel').attributes('aria-hidden')).toBe('false');
  });

  it('supports uncontrolled accordion state via defaultExpandedKeys and accordion-level disabled aliases', async () => {
    let wrapper = mount({
      components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
      template: `
        <Accordion :default-expanded-keys="new Set(['files'])" is-disabled>
          <Disclosure id="files">
            <DisclosureTitle>Files</DisclosureTitle>
            <DisclosurePanel>Files content</DisclosurePanel>
          </Disclosure>
          <Disclosure id="people">
            <DisclosureTitle>People</DisclosureTitle>
            <DisclosurePanel>People content</DisclosurePanel>
          </Disclosure>
        </Accordion>
      `
    });

    let filesItem = wrapper.find('.spectrum-Accordion-item');
    expect(filesItem.classes()).toContain('is-expanded');

    let filesPanel = wrapper.get('#files-panel');
    expect(filesPanel.attributes('aria-hidden')).toBe('false');
    expect(filesPanel.attributes('role')).toBe('group');

    let peopleTrigger = wrapper.get('#people-trigger');
    expect(peopleTrigger.attributes('disabled')).toBeDefined();
    expect(wrapper.get('#people-panel').attributes('aria-hidden')).toBe('true');

    await peopleTrigger.trigger('click');
    await nextTick();
    expect(wrapper.get('#people-panel').attributes('aria-hidden')).toBe('true');
  });

  it('accepts accordion expandedKeys as a Set iterable in controlled mode', async () => {
    let wrapper = mount({
      components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
      data() {
        return {
          expandedSet: new Set(['two'])
        };
      },
      template: `
        <Accordion :expanded-keys="expandedSet">
          <Disclosure id="one">
            <DisclosureTitle>One</DisclosureTitle>
            <DisclosurePanel>Panel one</DisclosurePanel>
          </Disclosure>
          <Disclosure id="two">
            <DisclosureTitle>Two</DisclosureTitle>
            <DisclosurePanel>Panel two</DisclosurePanel>
          </Disclosure>
        </Accordion>
      `
    });

    let items = wrapper.findAll('.spectrum-Accordion-item');
    expect(items[0].classes()).not.toContain('is-expanded');
    expect(items[1].classes()).toContain('is-expanded');
  });
});
