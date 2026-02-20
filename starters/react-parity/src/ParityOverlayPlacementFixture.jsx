import React from 'react';
import {Button} from '@react-spectrum/button';
import {Provider} from '@react-spectrum/provider';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {Text} from '@react-spectrum/text';
import {Tooltip, TooltipTrigger} from '@react-spectrum/tooltip';

export function ParityOverlayPlacementFixture() {
  return (
    <Provider theme={defaultTheme} colorScheme="light" scale="medium" UNSAFE_className="fixture-root">
      <section data-parity-id="overlay-placement-matrix" className="fixture-card fixture-card--overlay">
        <Text>Overlay Placement Matrix</Text>
        <div className="placement-grid">
          <TooltipTrigger isOpen placement="top">
            <Button variant="secondary">Top</Button>
            <Tooltip>Top placement</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger isOpen placement="right">
            <Button variant="secondary">Right</Button>
            <Tooltip>Right placement</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger isOpen placement="bottom">
            <Button variant="secondary">Bottom</Button>
            <Tooltip>Bottom placement</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger isOpen placement="left">
            <Button variant="secondary">Left</Button>
            <Tooltip>Left placement</Tooltip>
          </TooltipTrigger>
        </div>
      </section>
    </Provider>
  );
}
