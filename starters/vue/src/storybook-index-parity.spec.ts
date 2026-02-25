import {describe, expect, it} from 'vitest';
import * as dndStories from '../../../packages/vue-aria-components/stories/dnd.stories';
import * as listBoxStories from '../../../packages/vue-aria-components/stories/ListBox.stories';
import * as sliderHooksStories from '../../../packages/vue-aria-components/stories/SliderHooks.stories';

describe('Vue Storybook index parity story ids', () => {
  it('matches React export key shapes for dnd stories', () => {
    expect(dndStories).toHaveProperty('DraggableStory');
    expect(dndStories).toHaveProperty('DraggableDisabled');
    expect(dndStories).toHaveProperty('DraggableEnabledDisabledControl');
    expect(dndStories).toHaveProperty('DroppableStory');
    expect(dndStories).toHaveProperty('DroppableEnabledDisabledControl');
  });

  it('matches React export key shapes for slider hook stories', () => {
    expect(sliderHooksStories).toHaveProperty('_3Thumbs');
    expect(sliderHooksStories).toHaveProperty('_3ThumbsWithDisabled');
    expect(sliderHooksStories).toHaveProperty('_8ThumbsWithDisabled');
    expect(sliderHooksStories).toHaveProperty('_3ThumbsWithAriaLabel');
  });

  it('includes virtualized listbox parity stories from React', () => {
    expect(listBoxStories).toHaveProperty('VirtualizedListBoxEmpty');
    expect(listBoxStories).toHaveProperty('VirtualizedListBoxDnd');
    expect(listBoxStories).toHaveProperty('VirtualizedListBoxDndOnAction');
  });
});
