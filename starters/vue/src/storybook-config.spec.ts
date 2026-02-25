import {describe, expect, it} from 'vitest';
import {VUE_STORYBOOK_STORY_GLOBS} from '../.storybook/main';

describe('Vue Storybook source scope', () => {
  it('keeps story indexing scoped to vue-aria-components parity stories', () => {
    expect(VUE_STORYBOOK_STORY_GLOBS).toEqual([
      '../../../packages/vue-aria-components/stories/*.stories.{js,jsx,ts,tsx}'
    ]);

    for (let pattern of VUE_STORYBOOK_STORY_GLOBS) {
      expect(pattern).not.toContain('@vue-spectrum');
      expect(pattern).not.toContain('@react-spectrum');
      expect(pattern).not.toContain('@react-aria');
      expect(pattern).not.toContain('@react-stately');
    }
  });
});
