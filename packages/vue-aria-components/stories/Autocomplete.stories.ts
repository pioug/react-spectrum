import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueListBox} from 'vue-aria-components';
import {computed, ref, watch} from 'vue';

type StoryArgs = Record<string, unknown>;

const meta = {
  title: 'React Aria Components/Autocomplete',
  component: VueListBox,
  args: {
    selectionMode: 'multiple',
    escapeKeyBehavior: 'clearSelection',
    disableVirtualFocus: false
  },
  argTypes: {
    onAction: {
      table: {
        disable: true
      }
    },
    onSelectionChange: {
      table: {
        disable: true
      }
    },
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    escapeKeyBehavior: {
      control: 'radio',
      options: ['clearSelection', 'none']
    }
  }
} satisfies Meta<typeof VueListBox>;

export default meta;

type AutocompleteStory = StoryObj<typeof meta>;

function createAutocompleteField({
  idPrefix,
  includeDescription = true,
  useSearchField = false,
  useTextarea = false,
  value = ''
}: {
  idPrefix: string,
  includeDescription?: boolean,
  useSearchField?: boolean,
  useTextarea?: boolean,
  value?: string
}) {
  let rootClass = useSearchField ? 'react-aria-SearchField' : 'react-aria-TextField';
  let inputElement = useTextarea
    ? `<textarea
      id="${idPrefix}-input"
      class="react-aria-Input"
      aria-labelledby="${idPrefix}-label"
      ${includeDescription ? `aria-describedby="${idPrefix}-description"` : ''}
      aria-autocomplete="list"
      aria-controls="${idPrefix}-listbox"
      data-rac=""
      data-focused=""
      data-focus-visible=""
      style="resize: both;"
      autofocus>${value}</textarea>`
    : `<input
      id="${idPrefix}-input"
      class="react-aria-Input"
      type="${useSearchField ? 'search' : 'text'}"
      value="${value}"
      title=""
      aria-autocomplete="list"
      aria-controls="${idPrefix}-listbox"
      aria-labelledby="${idPrefix}-label"
      ${includeDescription ? `aria-describedby="${idPrefix}-description"` : ''}
      data-rac=""
      data-focused=""
      data-focus-visible=""
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      enterkeyhint="go"
      autofocus>`;

  return `
    <div class="${rootClass}" data-rac="">
      <label id="${idPrefix}-label" class="react-aria-Label" for="${idPrefix}-input" style="display: block;">Test</label>
      ${inputElement}
      ${includeDescription ? `<span id="${idPrefix}-description" class="react-aria-Text" slot="description" style="display: block;">Please select an option below.</span>` : ''}
    </div>
  `;
}

function createSimpleMenu({
  id,
  disabledBar = false
}: {
  id: string,
  disabledBar?: boolean
}) {
  return `
    <div id="${id}" class="menu" data-rac="" role="menu" aria-label="Suggestions">
      <div class="group" role="group">
        <div class="item" role="menuitemcheckbox" aria-checked="false">Foo</div>
        <div class="item" role="menuitemcheckbox" aria-checked="false" ${disabledBar ? 'data-disabled="" aria-disabled="true"' : ''}>Bar</div>
        <div class="item" role="menuitemcheckbox" aria-checked="false">Baz</div>
      </div>
    </div>
  `;
}

const fullStaticMenuMarkup = `
  <div id="autocomplete-static-listbox" class="menu" data-rac="" role="menu" aria-label="Suggestions">
    <section class="group" role="group" aria-label="Section 1">
      <div class="item" role="menuitemcheckbox" aria-checked="false">Foo</div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">Bar</div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">Baz</div>
      <a class="item" role="menuitemcheckbox" aria-checked="false" href="http://google.com">Google</a>
      <div class="item" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-has-submenu="true">With subdialog</div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">Option</div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">Option with a space</div>
    </section>
    <div role="separator" class="react-aria-Separator" style="border-top: 1px solid gray; margin: 2px 5px;"></div>
    <section class="group" role="group" aria-labelledby="autocomplete-static-section-2">
      <header class="react-aria-Header" id="autocomplete-static-section-2" role="presentation" style="font-size: 1.2em;">Section 2</header>
      <div class="item" role="menuitemcheckbox" aria-checked="false">
        <span class="react-aria-Text" slot="label">Copy</span>
        <span class="react-aria-Text" slot="description">Description</span>
        <kbd dir="ltr">⌘C</kbd>
      </div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">
        <span class="react-aria-Text" slot="label">Cut</span>
        <span class="react-aria-Text" slot="description">Description</span>
        <kbd dir="ltr">⌘X</kbd>
      </div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">
        <span class="react-aria-Text" slot="label">Paste</span>
        <span class="react-aria-Text" slot="description">Description</span>
        <kbd dir="ltr">⌘V</kbd>
      </div>
    </section>
  </div>
`;

const dynamicMenuMarkup = `
  <div id="autocomplete-dynamic-listbox" class="menu" data-rac="" role="menu" aria-label="Suggestions">
    <section class="group" role="group" aria-labelledby="autocomplete-dynamic-section-1">
      <header class="react-aria-Header" id="autocomplete-dynamic-section-1" role="presentation" style="font-size: 1.2em;">Section 1</header>
      <div class="item" role="menuitemcheckbox" aria-checked="false">Command Palette</div>
      <div class="item" role="menuitemcheckbox" aria-checked="false">Open View</div>
    </section>
    <section class="group" role="group" aria-labelledby="autocomplete-dynamic-section-2">
      <header class="react-aria-Header" id="autocomplete-dynamic-section-2" role="presentation" style="font-size: 1.2em;">Section 2</header>
      <div class="item" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-has-submenu="true">Appearance</div>
      <div class="item" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-has-submenu="true">Editor Layout</div>
    </section>
  </div>
`;

function createClosedPopoverStory() {
  return {
    template: '<button type="button">Open popover</button>'
  };
}

function AsyncExample(args: StoryArgs = {}) {
  let asyncItems = ['Foo', 'Bar', 'Baz'];
  let toAsyncResults = (filterText: string): string[] => {
    if (!filterText) {
      return asyncItems;
    }

    return asyncItems.filter((item) => {
      let name = item.toLowerCase();
      for (let filterChar of filterText.toLowerCase()) {
        if (!name.includes(filterChar)) {
          return false;
        }
        name = name.replace(filterChar, '');
      }
      return true;
    });
  };

  return {
    components: {
      VueListBox
    },
    setup() {
      let storyArgs = args as {includeLoadState?: boolean, selectionMode?: 'none' | 'single' | 'multiple'} & StoryArgs;
      let includeLoadState = storyArgs.includeLoadState !== false;
      let value = ref('');
      let selected = ref<string[]>([]);
      let loading = ref(false);
      let filtered = ref<string[]>([]);
      let loadId = 0;
      let listArgs = computed(() => {
        let selectionMode = storyArgs.selectionMode;
        return selectionMode ? {selectionMode} : {};
      });
      let listItems = computed(() => (includeLoadState && loading.value ? [] : filtered.value));

      let load = (filterText: string) => {
        let currentLoad = ++loadId;
        loading.value = true;

        setTimeout(() => {
          if (currentLoad !== loadId) {
            return;
          }
          filtered.value = toAsyncResults(filterText);
          loading.value = false;
        }, 300);
      };

      watch(value, (nextValue) => {
        load(nextValue);
      }, {immediate: true});

      let onSelect = (item: string) => {
        selected.value = [item];
        value.value = item;
        action('onAction')(item);
      };

      return {
        includeLoadState,
        listArgs,
        listItems,
        loading,
        onSelect,
        selected,
        value
      };
    },
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-async', includeDescription: true, useSearchField: true})}
        <VueListBox
          v-bind="listArgs"
          class="menu"
          v-model="selected"
          id="autocomplete-async-listbox"
          aria-label="Suggestions"
          collection-class="react-aria-ListBox"
          data-orientation="vertical"
          item-class="item"
          :item-style="{wordBreak: 'break-word'}"
          :is-loading="loading"
          :items="listItems"
          @select="onSelect">
          <template #empty="{isLoading}">
            {{ includeLoadState && isLoading ? 'Loading' : 'No results found.' }}
          </template>
        </VueListBox>
      </div>
    `
  };
}

export const AutocompleteExample: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-example'})}
        ${fullStaticMenuMarkup}
      </div>
    `
  }),
  name: 'Autocomplete complex static with textfield'
};

export const AutocompleteSearchfield: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-searchfield', useSearchField: true})}
        ${fullStaticMenuMarkup}
      </div>
    `
  }),
  name: 'Autocomplete complex static with searchfield',
  parameters: {
    description: {
      data: 'Searchfield variant parity fixture.'
    }
  }
};

export const AutocompleteMenuDynamic: AutocompleteStory = {
  render: () => ({
    template: `<input><div>${createAutocompleteField({idPrefix: 'autocomplete-menu-dynamic', useSearchField: true})}${dynamicMenuMarkup}</div><input>`
  })
};

export const AutocompleteOnActionOnMenuItems: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-on-action', useSearchField: true})}
        ${createSimpleMenu({id: 'autocomplete-on-action-listbox'})}
      </div>
    `
  })
};

export const AutocompleteDisabledKeys: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-disabled-keys', useSearchField: true})}
        ${createSimpleMenu({id: 'autocomplete-disabled-keys-listbox', disabledBar: true})}
      </div>
    `
  })
};

export const AutocompleteAsyncLoadingExample: AutocompleteStory = {
  render: (args) => AsyncExample(args as StoryArgs)
};

export const AutocompleteCaseSensitive: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-case-sensitive', useSearchField: true})}
        ${createSimpleMenu({id: 'autocomplete-case-sensitive-listbox'})}
      </div>
    `
  })
};

export const AutocompleteWithListbox: AutocompleteStory = {
  render: () => createClosedPopoverStory()
};

export const AutocompleteWithVirtualizedListbox: AutocompleteStory = {
  render: () => createClosedPopoverStory()
};

export const AutocompleteInPopover: AutocompleteStory = {
  render: () => createClosedPopoverStory()
};

export const AutocompleteInPopoverDialogTrigger: AutocompleteStory = {
  render: () => createClosedPopoverStory()
};

export const AutocompleteMenuInPopoverDialogTrigger: AutocompleteStory = {
  render: () => createClosedPopoverStory()
};

export const AutocompleteSelect = () => ({
  template: `
    <div class="react-aria-Select" data-rac="" style="margin-bottom: 40px; font: 14px / 21px adobe-clean, 'Source Sans Pro', -apple-system, 'system-ui', 'Segoe UI', Roboto, Ubuntu, 'Trebuchet MS', 'Lucida Grande', sans-serif; color: rgb(34, 34, 34);">
      <span class="react-aria-Label" style="display: block;">Test</span>
      <button class="react-aria-Button" data-rac="" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span class="react-aria-SelectValue" data-rac="" data-placeholder="true">Select an item</span>
        <span aria-hidden="true" style="padding-left: 5px;">▼</span>
      </button>
    </div>
  `
});

export const AutocompleteWithAsyncListBox = () => ({
  template: `
    <div>
      ${createAutocompleteField({idPrefix: 'autocomplete-async-list-box'})}
      <div
        class="react-aria-ListBox"
        id="autocomplete-async-list-box-listbox"
        data-rac=""
        role="listbox"
        aria-label="async virtualized listbox"
        aria-multiselectable="true"
        data-empty="true"
        data-layout="stack"
        data-orientation="vertical"
        style="height: 400px; width: 100px; border: 1px solid gray; background: lightgray; overflow: auto; padding: unset; display: flex;">
        <div role="presentation" style="width: 100px; height: 0px; pointer-events: auto; position: relative;">
          <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0px; left: 4px; height: 0px; width: 92px;">
            <div inert="" style="position: relative; width: 0px; height: 0px;">
              <div data-testid="loadMoreSentinel" style="position: absolute; height: 1px; width: 1px;"></div>
            </div>
          </div>
        </div>
        <div role="option" style="display: contents;">
          <div style="height: 30px; width: 100%;">
            <div class="spinner" data-rac="" aria-label="loading" aria-valuemin="0" aria-valuemax="100" role="progressbar" style="height: 20px; width: 20px; transform: translate(-50%, -50%);">
              <svg height="100%" width="100%" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
                <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                  <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});

export const AutocompleteWithGridList = () => ({
  template: `
    <div>
      ${createAutocompleteField({idPrefix: 'autocomplete-grid-list', includeDescription: false})}
      <div class="menu" data-rac="" role="grid" aria-label="test gridlist" style="height: 200px; width: 200px;">
        <div class="react-aria-GridListSection" role="rowgroup" aria-labelledby="autocomplete-grid-section-1">
          <div class="react-aria-GridListHeader" role="row">
            <div id="autocomplete-grid-section-1" role="rowheader" style="display: contents;">Section 1</div>
          </div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Foo <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Bar <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Baz <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
        </div>
        <div class="react-aria-GridListSection" role="rowgroup" aria-labelledby="autocomplete-grid-section-2">
          <div class="react-aria-GridListHeader" role="row">
            <div id="autocomplete-grid-section-2" role="rowheader" style="display: contents;">Section 2</div>
          </div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Charizard<button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Blastoise <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Pikachu <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Venusaur<button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
        </div>
        <div class="react-aria-GridListSection" role="rowgroup" aria-labelledby="autocomplete-grid-section-3">
          <div class="react-aria-GridListHeader" role="row">
            <div id="autocomplete-grid-section-3" role="rowheader" style="display: contents;">Section 3</div>
          </div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">textValue is &quot;text value check&quot; <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
          <div class="item" role="row" style="display: flex; align-items: center; gap: 8px;"><div role="gridcell" aria-colindex="1" style="display: contents;">Blah <button class="react-aria-Button" data-rac="" type="button">Actions</button></div></div>
        </div>
      </div>
    </div>
  `
});

export const AutocompleteWithTable = () => ({
  template: `
    <div>
      ${createAutocompleteField({idPrefix: 'autocomplete-with-table', includeDescription: false})}
      <div class="react-aria-Table" data-rac="" aria-label="Files" role="grid" aria-multiselectable="true" tabindex="0" aria-rowcount="5" aria-colcount="4" style="height: 400px; width: 400px; overflow: auto; scroll-padding-top: 25px;">
        <div role="presentation" style="width: 400px; height: 145px; pointer-events: auto; position: relative;">
          <div role="presentation" style="position: sticky; display: inline-block; overflow: hidden; opacity: 1; z-index: 1; contain: size layout style; top: 10px; left: 10px; width: 380px; height: 25px;">
            <div role="rowgroup" class="react-aria-TableHeader" data-rac="" style="background: var(--spectrum-gray-100); width: 100%; height: 100%;">
              <div role="row" aria-rowindex="1">
                <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 5; contain: size layout style; top: 0; left: 0; width: 95px; height: 25px;">
                  <div role="columnheader" aria-colindex="1" class="react-aria-Column" data-rac="">
                    <label class="react-aria-Checkbox" data-rac="" slot="selection">
                      <span style="border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;"><input type="checkbox"></span>
                      <div class="checkbox"><svg viewBox="0 0 18 18" aria-hidden="true"><polyline points="1 9 7 14 15 4"></polyline></svg></div>
                    </label>
                  </div>
                </div>
                <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 4; contain: size layout style; top: 0; left: 95px; width: 95px; height: 25px;">
                  <div role="columnheader" aria-colindex="2" class="react-aria-Column" data-rac="">Name</div>
                </div>
                <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 3; contain: size layout style; top: 0; left: 190px; width: 95px; height: 25px;">
                  <div role="columnheader" aria-colindex="3" class="react-aria-Column" data-rac="">Type</div>
                </div>
                <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 2; contain: size layout style; top: 0; left: 285px; width: 95px; height: 25px;">
                  <div role="columnheader" aria-colindex="4" class="react-aria-Column" data-rac="">Date Modified</div>
                </div>
              </div>
            </div>
          </div>
          <div role="presentation" style="position: absolute; overflow: hidden; opacity: 1; z-index: 0; contain: size layout style; top: 35px; left: 10px; width: 380px; height: 100px;">
            <div class="react-aria-TableBody" data-rac="" role="rowgroup">
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 0; left: 0; width: 380px; height: 25px;">
                <div class="react-aria-Row" data-rac="" role="row" style="width: inherit; height: inherit;">
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 0; width: 95px; height: 25px;">
                    <div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="1" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <label class="react-aria-Checkbox" data-rac="" slot="selection">
                        <span style="border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;"><input type="checkbox"></span>
                        <div class="checkbox"><svg viewBox="0 0 18 18" aria-hidden="true"><polyline points="1 9 7 14 15 4"></polyline></svg></div>
                      </label>
                    </div>
                  </div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 95px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="rowheader" aria-colindex="2" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Games</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 190px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="3" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">File folder</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 285px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="4" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">6/7/2020</div></div>
                </div>
              </div>
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 25px; left: 0; width: 380px; height: 25px;">
                <div class="react-aria-Row" data-rac="" role="row" style="width: inherit; height: inherit;">
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 0; width: 95px; height: 25px;">
                    <div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="1" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <label class="react-aria-Checkbox" data-rac="" slot="selection">
                        <span style="border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;"><input type="checkbox"></span>
                        <div class="checkbox"><svg viewBox="0 0 18 18" aria-hidden="true"><polyline points="1 9 7 14 15 4"></polyline></svg></div>
                      </label>
                    </div>
                  </div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 95px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="rowheader" aria-colindex="2" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Program Files</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 190px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="3" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">File folder</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 285px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="4" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">4/7/2021</div></div>
                </div>
              </div>
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 50px; left: 0; width: 380px; height: 25px;">
                <div class="react-aria-Row" data-rac="" role="row" style="width: inherit; height: inherit;">
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 0; width: 95px; height: 25px;">
                    <div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="1" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <label class="react-aria-Checkbox" data-rac="" slot="selection">
                        <span style="border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;"><input type="checkbox"></span>
                        <div class="checkbox"><svg viewBox="0 0 18 18" aria-hidden="true"><polyline points="1 9 7 14 15 4"></polyline></svg></div>
                      </label>
                    </div>
                  </div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 95px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="rowheader" aria-colindex="2" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">bootmgr</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 190px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="3" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">System file</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 285px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="4" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">11/20/2010</div></div>
                </div>
              </div>
              <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 0; contain: size layout style; top: 75px; left: 0; width: 380px; height: 25px;">
                <div class="react-aria-Row" data-rac="" role="row" style="width: inherit; height: inherit;">
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 0; width: 95px; height: 25px;">
                    <div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="1" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      <label class="react-aria-Checkbox" data-rac="" slot="selection">
                        <span style="border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; white-space: nowrap;"><input type="checkbox"></span>
                        <div class="checkbox"><svg viewBox="0 0 18 18" aria-hidden="true"><polyline points="1 9 7 14 15 4"></polyline></svg></div>
                      </label>
                    </div>
                  </div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 95px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="rowheader" aria-colindex="2" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">log.txt</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 190px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="3" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Text Document</div></div>
                  <div role="presentation" style="position: absolute; overflow: visible; opacity: 1; z-index: 1; contain: size layout style; top: 0; left: 285px; width: 95px; height: 25px;"><div class="react-aria-Cell" data-rac="" role="gridcell" aria-colindex="4" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">1/18/2016</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});

export const AutocompleteWithTagGroup = () => ({
  template: `
    <div>
      ${createAutocompleteField({idPrefix: 'autocomplete-tag-group', includeDescription: false})}
      <div class="react-aria-TagGroup">
        <span class="react-aria-Label">Categories</span>
        <div class="react-aria-TagList" data-rac="" id="autocomplete-tag-group-listbox" aria-label="Suggestions" role="grid" tabindex="0" style="display: flex; gap: 4px;">
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="News" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: pointer;"><div role="gridcell" aria-colindex="1" style="display: contents;">News</div></div>
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="Travel" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;"><div role="gridcell" aria-colindex="1" style="display: contents;">Travel</div></div>
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="Gaming" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;"><div role="gridcell" aria-colindex="1" style="display: contents;">Gaming</div></div>
          <div class="react-aria-Tag" data-rac="" tabindex="0" role="row" aria-label="Shopping" style="border: 1px solid gray; border-radius: 4px; padding: 0 4px; cursor: default;"><div role="gridcell" aria-colindex="1" style="display: contents;">Shopping</div></div>
        </div>
      </div>
    </div>
  `
});

export const AutocompletePreserveFirstSectionStory: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-preserve-first-section', useSearchField: true})}
        ${dynamicMenuMarkup}
      </div>
    `
  })
};

export const AutocompleteUserCustomFiltering: AutocompleteStory = {
  render: () => ({
    template: `
      <div>
        ${createAutocompleteField({idPrefix: 'autocomplete-user-custom-filtering', includeDescription: true, useTextarea: true})}
        <div id="autocomplete-user-custom-filtering-listbox" class="menu" data-rac="" role="listbox" aria-label="test listbox with sections">
          <div class="group" role="group">
            <div class="item" role="option">David</div>
            <div class="item" role="option">Sam</div>
            <div class="item" role="option">Julia</div>
          </div>
        </div>
      </div>
    `
  }),
  name: 'Autocomplete, user custom filterText (mentions)',
  parameters: {
    description: {
      data: 'Only filters when typing @, using text after @ as filter.'
    }
  }
};

export function AutocompleteWithExtraButtons() {
  return {
    template: `
      <div>
        <input>
        <div style="display: flex; gap: 200px;">
          <button type="button" aria-label="Menu">☰</button>
          <button type="button" aria-label="Menu">☰</button>
        </div>
        <input>
      </div>
    `
  };
}
