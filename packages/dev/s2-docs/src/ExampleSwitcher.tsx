'use client';

import {Content, ContextualHelp, Heading, Picker, PickerItem, SegmentedControl, SegmentedControlItem} from '@react-spectrum/s2';
import {createContext, useState} from 'react';
import {Key} from 'react-aria-components';
import {style} from '@react-spectrum/s2/style' with {type: 'macro'};
import {useLayoutEffect} from '@react-aria/utils';
import {useLocalStorage} from './useLocalStorage';

const exampleStyle = style({
  backgroundColor: 'layer-1',
  marginY: 20,
  borderRadius: 'xl',
  display: 'grid',
  gridTemplateColumns: {
    default: [12, '1fr', 12],
    lg: [24, '1fr', 'auto', 24]
  },
  gridTemplateAreas: {
    default: [
      '. switcher .',
      '. theme .',
      'example example example'
    ],
    lg: [
      '. switcher theme .',
      'example example example example'
    ]
  },
  paddingTop: {
    default: 12,
    lg: 24
  }
});

const switcher = style({
  gridArea: 'switcher',
  justifySelf: {
    default: 'center',
    lg: 'start'
  },
  overflow: 'auto',
  maxWidth: 'full',
  padding: 4,
  margin: -4
});

const themePicker = style({
  gridArea: 'theme',
  width: 182,
  marginTop: {
    default: 12,
    lg: 0
  },
  justifySelf: {
    default: 'center',
    lg: 'start'
  }
});

export const ExampleSwitcherContext = createContext<Key | null>(null);

const DEFAULT_EXAMPLES = ['Vanilla CSS', 'Tailwind'];
const THEME_TINTS: Record<string, {base: string, hover: string}> = {
  indigo: {base: '#5f5af6', hover: '#4a47d1'},
  blue: {base: '#1473e6', hover: '#0d66d0'},
  cyan: {base: '#0e7490', hover: '#155e75'},
  turquoise: {base: '#0f766e', hover: '#115e59'},
  green: {base: '#2f855a', hover: '#276749'},
  yellow: {base: '#a16207', hover: '#854d0e'},
  orange: {base: '#c05621', hover: '#9c4221'},
  red: {base: '#c53030', hover: '#9b2c2c'},
  pink: {base: '#b83280', hover: '#97266d'},
  purple: {base: '#7e22ce', hover: '#6b21a8'}
};

export function ExampleSwitcher({type = 'style', examples = DEFAULT_EXAMPLES, children}) {
  let [selected, setSelected] = useLocalStorage(type, examples[0]);
  let [theme, setTheme] = useLocalStorage('theme', 'indigo');
  let [value, setValue] = useState(examples[0]);

  if (!examples.includes(selected)) {
    selected = examples[0];
  }

  if (!type) {
    selected = value;
  }

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--tint', `var(--${theme})`);
    let tint = THEME_TINTS[theme] ?? THEME_TINTS.indigo;
    document.documentElement.style.setProperty('--vs-tint', tint.base);
    document.documentElement.style.setProperty('--vs-tint-hover', tint.hover);
  }, [theme]);

  let onSelectionChange = (key: Key) => {
    if (type) {
      setSelected(String(key));
    } else {
      setValue(String(key));
    }
  };

  let onThemeChange = (key: Key | null) => {
    setTheme(String(key));
  };

  let exampleChildren = Array.isArray(children) ? children : [children];

  return (
    <div className={exampleStyle} data-example-switcher>
      <div className={switcher}>
        <SegmentedControl aria-label={type || 'example'} selectedKey={selected} onSelectionChange={onSelectionChange}>
          {examples.map(example => <SegmentedControlItem key={example} id={example}>{example}</SegmentedControlItem>)}
        </SegmentedControl>
      </div>
      {selected === 'Vanilla CSS' &&
        <Picker
          label="Theme"
          labelPosition="side"
          value={theme}
          onChange={onThemeChange}
          styles={themePicker}
          contextualHelp={
            <ContextualHelp>
              <Heading>Vanilla CSS theme</Heading>
              <Content>This sets the <code className={style({font: 'code-sm'})}>--tint</code> CSS variable used by the Vanilla CSS examples.</Content>
            </ContextualHelp>
          }>
          <PickerItem id="indigo">Indigo</PickerItem>
          <PickerItem id="blue">Blue</PickerItem>
          <PickerItem id="cyan">Cyan</PickerItem>
          <PickerItem id="turquoise">Turquoise</PickerItem>
          <PickerItem id="green">Green</PickerItem>
          <PickerItem id="yellow">Yellow</PickerItem>
          <PickerItem id="orange">Orange</PickerItem>
          <PickerItem id="red">Red</PickerItem>
          <PickerItem id="pink">Pink</PickerItem>
          <PickerItem id="purple">Purple</PickerItem>
        </Picker>
      }
      <div style={{gridArea: 'example'}}>
        <ExampleSwitcherContext.Provider value={selected}>
          {exampleChildren[examples.indexOf(selected)]}
        </ExampleSwitcherContext.Provider>
      </div>
    </div>
  );
}
