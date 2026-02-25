import {describe, expect, it} from 'vitest';
import {VUE_STORYBOOK_STORY_GLOBS} from '../.storybook/main';

describe('Vue Storybook source scope', () => {
  it('keeps story indexing aligned with Vue Spectrum + Vue RAC sources', () => {
    expect(VUE_STORYBOOK_STORY_GLOBS).toEqual([
      '../../../packages/@vue-spectrum/*/stories/*.stories.{js,jsx,ts,tsx}',
      '../../../packages/vue-aria-components/stories/*.stories.{js,jsx,ts,tsx}'
    ]);

    expect(VUE_STORYBOOK_STORY_GLOBS.some((pattern) => pattern.includes('@vue-spectrum'))).toBe(true);
    expect(VUE_STORYBOOK_STORY_GLOBS.some((pattern) => pattern.includes('vue-aria-components/stories'))).toBe(true);
  });
});
