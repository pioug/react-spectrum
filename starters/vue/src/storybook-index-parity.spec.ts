import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import * as dndStories from '../../../packages/vue-aria-components/stories/dnd.stories';
import * as listBoxStories from '../../../packages/vue-aria-components/stories/ListBox.stories';
import * as sliderHooksStories from '../../../packages/vue-aria-components/stories/SliderHooks.stories';

describe('Vue Storybook index parity story ids', () => {
  const here = dirname(fileURLToPath(import.meta.url));

  function storySource(relativePath: string) {
    return readFileSync(resolve(here, relativePath), 'utf8');
  }

  function titleFromSource(source: string) {
    return source.match(/title:\s*['"`]([^'"`]+)['"`]/)?.[1];
  }

  function storyExportKeysFromSource(source: string) {
    return [...source.matchAll(/^\s*export\s+const\s+([A-Za-z0-9_]+)\s*[:=]/gm)]
      .map((match) => match[1])
      .sort();
  }

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

  it('keeps @vue-spectrum FileTrigger mapping aligned with React namespaces', () => {
    const vueFileTrigger = storySource('../../../packages/@vue-spectrum/filetrigger/stories/FileTrigger.stories.ts');
    const reactSpectrumDropzoneFileTrigger = storySource('../../../packages/@react-spectrum/dropzone/stories/FileTrigger.stories.tsx');
    const reactAriaFileTrigger = storySource('../../../packages/react-aria-components/stories/FileTrigger.stories.tsx');

    expect(titleFromSource(vueFileTrigger)).toBe(titleFromSource(reactSpectrumDropzoneFileTrigger));
    expect(storyExportKeysFromSource(vueFileTrigger)).toEqual(storyExportKeysFromSource(reactAriaFileTrigger));
  });

  it('keeps Icons/Color story mapping aligned with @spectrum-icons/color', () => {
    const vueIconsColor = storySource('../../../packages/@vue-spectrum/icon/stories/IconsColor.stories.ts');
    const reactIconsColor = storySource('../../../packages/@spectrum-icons/color/stories/IconsColor.stories.tsx');

    expect(titleFromSource(vueIconsColor)).toBe(titleFromSource(reactIconsColor));
    expect(storyExportKeysFromSource(vueIconsColor)).toEqual(storyExportKeysFromSource(reactIconsColor));
  });

  it('keeps Icons/Express story mapping aligned with @spectrum-icons/express', () => {
    const vueIconsExpress = storySource('../../../packages/@vue-spectrum/icon/stories/IconsExpress.stories.ts');
    const reactIconsExpress = storySource('../../../packages/@spectrum-icons/express/stories/IconsExpress.stories.tsx');

    expect(titleFromSource(vueIconsExpress)).toBe(titleFromSource(reactIconsExpress));
    expect(storyExportKeysFromSource(vueIconsExpress)).toEqual(storyExportKeysFromSource(reactIconsExpress));
  });

  it('keeps Icons/Workflow story mapping aligned with @spectrum-icons/workflow', () => {
    const vueIconsWorkflow = storySource('../../../packages/@vue-spectrum/icon/stories/IconsWorkflow.stories.ts');
    const reactIconsWorkflow = storySource('../../../packages/@spectrum-icons/workflow/stories/IconsWorkflow.stories.tsx');

    expect(titleFromSource(vueIconsWorkflow)).toBe(titleFromSource(reactIconsWorkflow));
    expect(storyExportKeysFromSource(vueIconsWorkflow)).toEqual(storyExportKeysFromSource(reactIconsWorkflow));
  });
});
