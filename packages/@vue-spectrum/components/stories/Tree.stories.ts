import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueTree} from '@vue-spectrum/components';

type TreeRowKind = 'loader' | 'rich' | 'section' | 'simple';

type TreeRow = {
  actions?: boolean,
  drag?: boolean,
  expanded?: boolean,
  hasChildren?: boolean,
  kind: TreeRowKind,
  label: string,
  level?: number
};

type TreeStoryOptions = {
  beforeTreeButton?: string,
  chevronStyle?: 'glyph' | 'svg',
  includeSecondPane?: boolean,
  loaderTreeMarkup?: boolean,
  overlapRows?: boolean,
  rows: TreeRow[],
  wrapperStyle?: string
};

const baseArgTypes = {
  selectionMode: {
    control: 'radio',
    options: ['none', 'single', 'multiple']
  },
  selectionBehavior: {
    control: 'radio',
    options: ['toggle', 'replace']
  },
  disabledBehavior: {
    control: 'radio',
    options: ['selection', 'all']
  }
};

const baseArgs = {
  selectionMode: 'none',
  selectionBehavior: 'toggle',
  disabledBehavior: 'selection'
};

const STATIC_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Photos', level: 1, actions: true},
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, actions: true},
  {kind: 'simple', label: 'Reports'},
  {kind: 'simple', label: 'false Tests'}
];

const STATIC_SECTION_ROWS: TreeRow[] = [
  {kind: 'simple', label: 'Reports'},
  {kind: 'section', label: 'Photo Header'},
  {kind: 'rich', label: 'Photos', level: 1, actions: true},
  {kind: 'rich', label: 'Edited Photos', level: 1, actions: true},
  {kind: 'section', label: 'Project Header'},
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Project-4', level: 1, actions: true},
  {kind: 'simple', label: 'false Tests'}
];

const STATIC_NO_ACTIONS_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Photos', level: 1},
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true},
  {kind: 'rich', label: 'Reports', level: 1},
  {kind: 'rich', label: 'false Tests', level: 1}
];

const DYNAMIC_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, expanded: true, actions: true},
  {kind: 'rich', label: 'Project 1', level: 2, actions: true},
  {kind: 'rich', label: 'Project 2', level: 2, hasChildren: true, expanded: true, actions: true},
  {kind: 'rich', label: 'Project 2A', level: 3, actions: true},
  {kind: 'rich', label: 'Project 2B', level: 3, actions: true},
  {kind: 'rich', label: 'Project 2C', level: 3, actions: true},
  {kind: 'rich', label: 'Project 3', level: 2, actions: true},
  {kind: 'rich', label: 'Project 4', level: 2, actions: true},
  {kind: 'rich', label: 'Project 5', level: 2, hasChildren: true, expanded: true, actions: true},
  {kind: 'rich', label: 'Project 5A', level: 3, actions: true}
];

const DYNAMIC_SECTION_ROWS: TreeRow[] = [
  {kind: 'section', label: 'Section 1'},
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, expanded: true, actions: true},
  {kind: 'rich', label: 'Project 1', level: 2, actions: true},
  {kind: 'rich', label: 'Project 2', level: 2, hasChildren: true, expanded: true, actions: true},
  {kind: 'rich', label: 'Project 2A', level: 3, actions: true},
  {kind: 'rich', label: 'Project 2B', level: 3, actions: true},
  {kind: 'rich', label: 'Project 2C', level: 3, actions: true},
  {kind: 'rich', label: 'Project 3', level: 2, actions: true},
  {kind: 'rich', label: 'Project 4', level: 2, actions: true},
  {kind: 'rich', label: 'Project 5', level: 2, hasChildren: true, expanded: true, actions: true}
];

const MULTI_LOADER_MOCK_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Photos 1', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 2', level: 1, actions: true},
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Photos 3', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 4', level: 1, actions: true},
  {kind: 'rich', label: 'Documents', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Photos 5', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 6', level: 1, actions: true},
  {kind: 'loader', label: 'Load more spinner'}
];

const MULTI_LOADER_ASYNC_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Photos 1', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 2', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 3', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 4', level: 1, actions: true},
  {kind: 'rich', label: 'Star Wars', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Photos 5', level: 1, actions: true},
  {kind: 'rich', label: 'Photos 6', level: 1, actions: true},
  {kind: 'loader', label: 'Load more spinner'}
];

const DND_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, actions: true, drag: true},
  {kind: 'rich', label: 'Reports', level: 1, hasChildren: true, actions: true, drag: true}
];

const DND_VIRTUALIZED_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Projects', level: 1, hasChildren: true, expanded: true, actions: true, drag: true},
  {kind: 'rich', label: 'Project 1', level: 2, actions: true, drag: true},
  {kind: 'rich', label: 'Project 2', level: 2, hasChildren: true, expanded: true, actions: true, drag: true},
  {kind: 'rich', label: 'Project 2A', level: 3, actions: true, drag: true},
  {kind: 'rich', label: 'Project 2B', level: 3, actions: true, drag: true},
  {kind: 'rich', label: 'Project 2C', level: 3, actions: true, drag: true},
  {kind: 'rich', label: 'Project 3', level: 2, actions: true, drag: true},
  {kind: 'rich', label: 'Project 4', level: 2, actions: true, drag: true},
  {kind: 'rich', label: 'Project 5', level: 2, hasChildren: true, expanded: true, actions: true, drag: true},
  {kind: 'rich', label: 'Project 5A', level: 3, actions: true, drag: true}
];

const HUGE_ROWS: TreeRow[] = [
  {kind: 'rich', label: 'Level 1 Item 1', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Level 1 Item 2', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Level 1 Item 3', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Level 1 Item 4', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Level 1 Item 5', level: 1, hasChildren: true, actions: true},
  {kind: 'rich', label: 'Level 1 Item 6', level: 1, hasChildren: true, actions: true}
];

function createTreeStory(options: TreeStoryOptions) {
  return {
    setup() {
      let getInlineStart = (row: TreeRow) => {
        let level = row.level ?? 1;
        return (row.hasChildren ? 0 : 20) + (level - 1) * 15;
      };
      let treeItemCount = 0;
      let rowIndices = options.rows.map((row) => {
        if (row.kind === 'section' || row.kind === 'loader') {
          return -1;
        }
        let index = treeItemCount;
        treeItemCount += 1;
        return index;
      });
      let getTreeItemStyle = (index: number) => {
        return options.overlapRows && rowIndices[index] > 0 ? {marginTop: '-1px'} : undefined;
      };

      return {
        ...options,
        getInlineStart,
        getTreeItemStyle
      };
    },
    template: `
      <div :style="wrapperStyle || (includeSecondPane ? 'display: flex; gap: 12px; flex-wrap: wrap;' : '')">
        <button v-if="beforeTreeButton" type="button">{{ beforeTreeButton }}</button>
        <div class="tree">
          <template v-for="(row, index) in rows" :key="index">
            <div v-if="row.kind === 'section'">{{ row.label }}</div>
            <div v-else-if="row.kind === 'loader'">
              <div v-if="loaderTreeMarkup" role="row" class="tree-loader" data-rac="" data-level="1">
                <div role="gridcell" aria-colindex="1" style="display: contents;">
                  <span style="margin-inline-start: 0px;">{{ row.label }}</span>
                </div>
              </div>
              <template v-else>{{ row.label }}</template>
            </div>
            <div v-else-if="row.kind === 'simple'" class="tree-item" :style="getTreeItemStyle(index)">{{ row.label }}</div>
            <div v-else class="tree-item" :style="getTreeItemStyle(index)">
              <div class="content-wrapper" :style="{marginInlineStart: getInlineStart(row) + 'px'}">
                <button v-if="row.hasChildren" class="react-aria-Button" slot="chevron" type="button">
                  <template v-if="chevronStyle === 'glyph'">{{ row.expanded ? '⏷' : '⏵' }}</template>
                  <div v-else :style="{transform: 'rotate(' + (row.expanded ? 90 : 0) + 'deg)', width: '16px', height: '16px'}">
                    <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                      <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
                <button v-if="row.drag" slot="drag" type="button">≡</button>
                <span>{{ row.label }}</span>
                <button v-if="row.actions" class="button" aria-label="Info" type="button">ⓘ</button>
                <button v-if="row.actions" aria-label="Menu" type="button">☰</button>
              </div>
            </div>
          </template>
        </div>
        <div v-if="includeSecondPane" class="tree">Drop items here</div>
      </div>
    `
  };
}

function createVirtualizedFlatTreeStory(options: TreeStoryOptions) {
  return {
    setup() {
      let getInlineStart = (row: TreeRow) => {
        let level = row.level ?? 1;
        return (row.hasChildren ? 0 : 20) + (level - 1) * 15;
      };
      let rowHeight = 30;
      let getRowWrapperStyle = (index: number) => ({
        contain: 'size layout style',
        height: `${rowHeight}px`,
        left: '0px',
        opacity: 1,
        overflow: 'visible',
        position: 'absolute',
        top: `${index * rowHeight}px`,
        width: '300px',
        zIndex: 0
      });
      let virtualizedHeight = `${options.rows.length * rowHeight}px`;

      return {
        ...options,
        getInlineStart,
        getRowWrapperStyle,
        rowHeight,
        virtualizedHeight
      };
    },
    template: `
      <div :style="wrapperStyle || ''">
        <button v-if="beforeTreeButton">{{ beforeTreeButton }}</button>
        <div class="tree">
          <div role="presentation" :style="{width: '300px', height: virtualizedHeight, pointerEvents: 'auto', position: 'relative'}">
            <template v-for="(row, index) in rows" :key="index">
              <div role="presentation" :style="getRowWrapperStyle(index)">
                <template v-if="row.kind === 'loader'">
                  <div inert="" style="position: relative; width: 0px; height: 0px;">
                    <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
                  </div>
                  <div role="row" class="tree-loader" data-rac="" data-level="1">
                    <div role="gridcell" aria-colindex="1" style="display: contents;">
                      <span style="margin-inline-start: 0px;">{{ row.label }}</span>
                    </div>
                  </div>
                </template>
                <div v-else-if="row.kind === 'simple'" class="tree-item">{{ row.label }}</div>
                <div v-else class="tree-item">
                  <div class="content-wrapper" :style="{marginInlineStart: getInlineStart(row) + 'px'}">
                    <button v-if="row.hasChildren" class="react-aria-Button" slot="chevron" type="button">
                      <div :style="{transform: 'rotate(' + (row.expanded ? 90 : 0) + 'deg)', width: '16px', height: '16px'}">
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                          <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </button>
                    <button v-if="row.drag" slot="drag" type="button">≡</button>
                    <span>{{ row.label }}</span>
                    <button v-if="row.actions" class="button" aria-label="Info" type="button">ⓘ</button>
                    <button v-if="row.actions" aria-label="Menu" type="button">☰</button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    `
  };
}

function createVirtualizedTreeSectionRenderStory() {
  return {
    template: `
      <div class="tree">
        <div role="presentation" style="width: 300px; height: 210px; pointer-events: auto; position: relative;">
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0px; left: 0px; width: 300px; height: 90px;">
            <section class="react-aria-TreeSection" role="rowgroup">
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0px; left: 0px; width: 300px; height: 30px;">
                <div class="react-aria-TreeHeader" role="row">
                  <div role="rowheader" style="display: contents;">Photo Header</div>
                </div>
              </div>
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 30px; left: 0px; width: 300px; height: 30px;">
                <div class="tree-item">
                  <div class="content-wrapper" style="margin-inline-start: 20px;">
                    <span>Photos</span>
                    <button class="button" aria-label="Info" type="button">ⓘ</button>
                    <button aria-label="Menu" type="button">☰</button>
                  </div>
                </div>
              </div>
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 60px; left: 0px; width: 300px; height: 30px;">
                <div class="tree-item">
                  <div class="content-wrapper" style="margin-inline-start: 20px;">
                    <span>Edited Photos</span>
                    <button class="button" aria-label="Info" type="button">ⓘ</button>
                    <button aria-label="Menu" type="button">☰</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 90px; left: 0px; width: 300px; height: 60px;">
            <section class="react-aria-TreeSection" role="rowgroup">
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0px; left: 0px; width: 300px; height: 30px;">
                <div class="react-aria-TreeHeader" role="row">
                  <div role="rowheader" style="display: contents;">Project Header</div>
                </div>
              </div>
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 30px; left: 0px; width: 300px; height: 30px;">
                <div class="tree-item">
                  <div class="content-wrapper" style="margin-inline-start: 0px;">
                    <button class="react-aria-Button" slot="chevron" type="button">
                      <div style="transform: rotate(0deg); width: 16px; height: 16px;">
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                          <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </button>
                    <span>Projects</span>
                    <button class="button" aria-label="Info" type="button">ⓘ</button>
                    <button aria-label="Menu" type="button">☰</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 150px; left: 0px; width: 300px; height: 30px;">
            <div class="tree-item">Reports</div>
          </div>
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 180px; left: 0px; width: 300px; height: 30px;">
            <div class="tree-item"><span class="react-aria-Text">false Tests</span></div>
          </div>
        </div>
      </div>
    `
  };
}

const meta = {
  title: 'React Aria Components/Tree',
  component: VueTree
} satisfies Meta<typeof VueTree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TreeExampleStatic: Story = {
  render: () => createTreeStory({rows: STATIC_ROWS}),
  args: baseArgs,
  argTypes: baseArgTypes
};

export const TreeExampleSection: Story = {
  render: () => createTreeStory({rows: STATIC_SECTION_ROWS}),
  args: {
    ...baseArgs,
    disallowClearAll: false
  },
  argTypes: baseArgTypes
};

export const TreeExampleStaticNoActions: Story = {
  render: () => createTreeStory({rows: STATIC_NO_ACTIONS_ROWS}),
  args: baseArgs,
  argTypes: baseArgTypes
};

export const TreeExampleDynamic: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS}),
  args: baseArgs,
  argTypes: baseArgTypes
};

export const TreeSectionDynamic: Story = {
  render: () => createTreeStory({rows: DYNAMIC_SECTION_ROWS}),
  args: baseArgs,
  argTypes: baseArgTypes
};

export const WithActions: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS}),
  args: baseArgs,
  name: 'Tree with actions'
};

export const WithLinks: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS}),
  args: baseArgs,
  name: 'Tree with links'
};

export const EmptyTreeStaticStory: Story = {
  render: () => createTreeStory({rows: [{kind: 'loader', label: 'Nothing in tree'}]}),
  name: 'Empty/Loading Tree rendered with TreeLoader collection element',
  args: {
    isLoading: false
  }
};

export const LoadingStoryDepOnCollectionStory: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS}),
  name: 'Loading, static root loader and dynamic rows',
  args: {
    isLoading: false
  }
};

export const LoadingStoryDepOnTopStory: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS}),
  name: 'Loading, dynamic rows, root loader rendered dynamically as well',
  args: {
    isLoading: false
  }
};

export const ButtonLoadingIndicatorStory: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS, chevronStyle: 'glyph'}),
  name: 'Loading, dynamic rows, spinner renders in button',
  args: {
    isLoading: false
  }
};

export const VirtualizedTree: Story = {
  render: () => createTreeStory({rows: DYNAMIC_ROWS, overlapRows: true}),
  args: baseArgs,
  argTypes: baseArgTypes
};

export const VirtualizedTreeMultiLoaderMockAsync: Story = {
  render: () => createVirtualizedFlatTreeStory({
    loaderTreeMarkup: true,
    overlapRows: true,
    rows: MULTI_LOADER_MOCK_ROWS
  }),
  args: {
    delay: 2000
  }
};

export const VirtualizedTreeMultiLoaderUseAsyncList: Story = {
  render: () => createVirtualizedFlatTreeStory({
    loaderTreeMarkup: true,
    overlapRows: true,
    rows: MULTI_LOADER_ASYNC_ROWS
  }),
  args: {
    delay: 2000
  }
};

export const TreeWithDragAndDrop: Story = {
  render: () => createTreeStory({
    includeSecondPane: true,
    rows: DND_ROWS
  }),
  args: {
    dropFunction: 'onMove',
    shouldAcceptItemDrop: 'all',
    shouldAllowInsert: true,
    ...baseArgs
  },
  argTypes: {
    ...baseArgTypes,
    dropFunction: {
      control: 'radio',
      options: ['onMove', 'onReorder']
    },
    shouldAcceptItemDrop: {
      control: 'radio',
      options: ['all', 'folders']
    }
  }
};

export const TreeWithDragAndDropVirtualized: Story = {
  render: () => createTreeStory({
    includeSecondPane: true,
    overlapRows: true,
    rows: DND_VIRTUALIZED_ROWS
  }),
  args: {
    dropFunction: 'onMove',
    shouldAcceptItemDrop: 'all',
    shouldAllowInsert: true,
    ...baseArgs
  },
  name: 'Tree with drag and drop (virtualized)'
};

export const VirtualizedTreeSectionRender: Story = {
  render: () => createVirtualizedTreeSectionRenderStory(),
  args: {
    ...baseArgs,
    disallowClearAll: false
  },
  argTypes: baseArgTypes
};

export const HugeVirtualizedTree: Story = {
  render: () => createVirtualizedFlatTreeStory({
    beforeTreeButton: 'Expand All 55986',
    overlapRows: true,
    rows: HUGE_ROWS,
    wrapperStyle: 'display: flex; align-items: center; gap: 0;'
  }),
  args: {
    ...baseArgs
  },
  argTypes: baseArgTypes
};
