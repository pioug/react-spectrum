import React from 'react';
import {Button} from '@react-spectrum/button';
import {Provider} from '@react-spectrum/provider';
import {StatusLight} from '@react-spectrum/statuslight';
import {Switch} from '@react-spectrum/switch';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {Text} from '@react-spectrum/text';
import {TextField} from '@react-spectrum/textfield';

export function ParityForcedColorsFixture() {
  return (
    <Provider theme={defaultTheme} colorScheme="light" scale="medium" UNSAFE_className="fixture-root">
      <section data-parity-id="forced-colors-cluster" className="fixture-card fixture-card--narrow">
        <Text>Forced Colors Cluster</Text>
        <Button variant="cta">Primary action</Button>
        <TextField label="Owner" validationState="invalid" errorMessage="Required in forced colors" defaultValue="" />
        <Switch defaultSelected>Alerts</Switch>
        <StatusLight variant="positive">Healthy</StatusLight>
        <div className="native-control">
          <label htmlFor="forced-native-input">Native input</label>
          <input id="forced-native-input" defaultValue="Native surface" />
        </div>
      </section>
    </Provider>
  );
}
