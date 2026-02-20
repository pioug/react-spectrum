import React from 'react';
import {Button} from '@react-spectrum/button';
import {Dialog, DialogTrigger} from '@react-spectrum/dialog';
import {Provider} from '@react-spectrum/provider';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {Content} from '@react-spectrum/view';

export function ParityPopoverFixture() {
  return (
    <Provider theme={defaultTheme} colorScheme="light" scale="medium" UNSAFE_className="fixture-root">
      <section data-parity-id="pkg-overlays" className="fixture-card fixture-card--narrow">
        <DialogTrigger type="popover" placement="right" isOpen defaultOpen>
          <Button variant="secondary">Open popover</Button>
          <Dialog>
            <Content>Popover package visual baseline</Content>
          </Dialog>
        </DialogTrigger>
      </section>
    </Provider>
  );
}
