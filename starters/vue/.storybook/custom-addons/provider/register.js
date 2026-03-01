import React, {useEffect, useMemo, useState} from 'react';
import {addons, types} from 'storybook/manager-api';

const THEMES = [
  {label: 'Auto', value: ''},
  {label: 'Light', value: 'light'},
  {label: 'Lightest', value: 'lightest'},
  {label: 'Dark', value: 'dark'},
  {label: 'Darkest', value: 'darkest'}
];

const SCALES = [
  {label: 'Auto', value: ''},
  {label: 'Medium', value: 'medium'},
  {label: 'Large', value: 'large'}
];

// Keep locales aligned with React Storybook provider switcher.
const LOCALES = [
  {label: 'Auto', value: ''},
  {label: 'French (France)', value: 'fr-FR'},
  {label: 'French (Canada)', value: 'fr-CA'},
  {label: 'German (Germany)', value: 'de-DE'},
  {label: 'English (Great Britain)', value: 'en-GB'},
  {label: 'English (United States)', value: 'en-US'},
  {label: 'Japanese (Japan)', value: 'ja-JP'},
  {label: 'Danish (Denmark)', value: 'da-DK'},
  {label: 'Dutch (Netherlands)', value: 'nl-NL'},
  {label: 'Finnish (Finland)', value: 'fi-FI'},
  {label: 'Italian (Italy)', value: 'it-IT'},
  {label: 'Norwegian (Norway)', value: 'nb-NO'},
  {label: 'Spanish (Spain)', value: 'es-ES'},
  {label: 'Swedish (Sweden)', value: 'sv-SE'},
  {label: 'Portuguese (Brazil)', value: 'pt-BR'},
  {label: 'Chinese (Simplified)', value: 'zh-CN'},
  {label: 'Chinese (Traditional)', value: 'zh-TW'},
  {label: 'Korean (Korea)', value: 'ko-KR'},
  {label: 'Bulgarian (Bulgaria)', value: 'bg-BG'},
  {label: 'Croatian (Croatia)', value: 'hr-HR'},
  {label: 'Czech (Czech Republic)', value: 'cs-CZ'},
  {label: 'Estonian (Estonia)', value: 'et-EE'},
  {label: 'Hungarian (Hungary)', value: 'hu-HU'},
  {label: 'Latvian (Latvia)', value: 'lv-LV'},
  {label: 'Lithuanian (Lithuania)', value: 'lt-LT'},
  {label: 'Polish (Poland)', value: 'pl-PL'},
  {label: 'Romanian (Romania)', value: 'ro-RO'},
  {label: 'Russian (Russia)', value: 'ru-RU'},
  {label: 'Serbian (Serbia)', value: 'sr-SP'},
  {label: 'Slovakian (Slovakia)', value: 'sk-SK'},
  {label: 'Slovenian (Slovenia)', value: 'sl-SI'},
  {label: 'Turkish (Turkey)', value: 'tr-TR'},
  {label: 'Ukrainian (Ukraine)', value: 'uk-UA'},
  {label: 'Arabic (United Arab Emirates)', value: 'ar-AE'},
  {label: 'Greek (Greece)', value: 'el-GR'},
  {label: 'Hebrew (Israel)', value: 'he-IL'}
];

function LabeledSelect({id, label, value, onChange, options}) {
  return React.createElement(
    'div',
    {style: {marginRight: '10px'}},
    React.createElement('label', {htmlFor: id, style: {marginRight: '4px'}}, `${label}:`),
    React.createElement(
      'select',
      {
        id,
        name: id,
        value,
        onChange
      },
      options.map((option) => React.createElement(
        'option',
        {key: option.label, value: option.value},
        option.label
      ))
    )
  );
}

function ProviderFieldSetter({api}) {
  let localeParam = api.getQueryParam('providerSwitcher-locale') || '';
  let themeParam = api.getQueryParam('providerSwitcher-theme') || '';
  let scaleParam = api.getQueryParam('providerSwitcher-scale') || '';
  let expressParam = api.getQueryParam('providerSwitcher-express') || 'false';
  let [values, setValues] = useState({
    locale: localeParam,
    theme: themeParam,
    scale: scaleParam,
    express: expressParam === 'true'
  });
  let channel = useMemo(() => addons.getChannel(), []);

  let emitProviderUpdate = (next) => {
    channel.emit('provider/updated', {
      locale: next.locale || undefined,
      theme: next.theme || undefined,
      scale: next.scale || undefined,
      express: next.express
    });
  };

  let update = (patch) => {
    setValues((oldValues) => {
      let nextValues = {...oldValues, ...patch};
      emitProviderUpdate(nextValues);
      return nextValues;
    });
  };

  useEffect(() => {
    let onReady = () => emitProviderUpdate(values);
    channel.on('rsp/ready-for-update', onReady);
    return () => {
      channel.removeListener('rsp/ready-for-update', onReady);
    };
  });

  useEffect(() => {
    api.setQueryParams({
      'providerSwitcher-locale': values.locale || '',
      'providerSwitcher-theme': values.theme || '',
      'providerSwitcher-scale': values.scale || '',
      'providerSwitcher-express': String(values.express)
    });
  });

  return React.createElement(
    'div',
    {style: {display: 'flex', alignItems: 'center', fontSize: '12px'}},
    React.createElement(LabeledSelect, {
      id: 'provider-locale',
      label: 'Locale',
      value: values.locale,
      onChange: (event) => update({locale: event.target.value}),
      options: LOCALES
    }),
    React.createElement(LabeledSelect, {
      id: 'provider-theme',
      label: 'Theme',
      value: values.theme,
      onChange: (event) => update({theme: event.target.value}),
      options: THEMES
    }),
    React.createElement(LabeledSelect, {
      id: 'provider-scale',
      label: 'Scale',
      value: values.scale,
      onChange: (event) => update({scale: event.target.value}),
      options: SCALES
    }),
    React.createElement(
      'div',
      {style: {marginRight: '10px', display: 'flex', alignItems: 'center'}},
      React.createElement('label', {htmlFor: 'provider-express', style: {marginRight: '4px'}}, 'Express:'),
      React.createElement('input', {
        id: 'provider-express',
        name: 'provider-express',
        type: 'checkbox',
        checked: values.express,
        onChange: (event) => update({express: event.target.checked})
      })
    )
  );
}

addons.register('VueProviderSwitcher', (api) => {
  addons.add('VueProviderSwitcher', {
    title: 'provider',
    type: types.TOOL,
    match: ({viewMode}) => viewMode === 'story',
    render: () => React.createElement(ProviderFieldSetter, {api})
  });
});
