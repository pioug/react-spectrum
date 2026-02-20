import React from 'react';
import {ContextualHelp} from '@react-spectrum/contextualhelp';
import {Provider} from '@react-spectrum/provider';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {Text} from '@react-spectrum/text';
import {Content, Footer} from '@react-spectrum/view';
import {Heading} from '@react-spectrum/text';

export function ParityContextualHelpFixture() {
  return (
    <Provider theme={defaultTheme} colorScheme="light" scale="medium" UNSAFE_className="fixture-root">
      <section data-parity-id="pkg-contextualhelp" className="fixture-card fixture-card--narrow">
        <ContextualHelp isOpen defaultOpen variant="info" isDismissable={false}>
          <Heading>Contextual help parity</Heading>
          <Content>Contextual help package visual baseline</Content>
          <Footer>
            <Text>Footer slot content</Text>
          </Footer>
        </ContextualHelp>
      </section>
    </Provider>
  );
}
