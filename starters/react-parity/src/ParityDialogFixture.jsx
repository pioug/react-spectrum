import React from 'react';
import {Button} from '@react-spectrum/button';
import {Dialog, DialogTrigger} from '@react-spectrum/dialog';
import {Provider} from '@react-spectrum/provider';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {Content} from '@react-spectrum/view';
import {Heading} from '@react-spectrum/text';

export function ParityDialogFixture() {
  return (
    <Provider theme={defaultTheme} colorScheme="light" scale="medium" UNSAFE_className="fixture-root">
      <section data-parity-id="pkg-dialog" className="fixture-card fixture-card--narrow">
        <DialogTrigger type="modal" isOpen defaultOpen>
          <Button variant="secondary">Open dialog</Button>
          <Dialog>
            <Heading>Dialog parity fixture</Heading>
            <Content>Dialog package visual baseline</Content>
          </Dialog>
        </DialogTrigger>
      </section>
    </Provider>
  );
}
