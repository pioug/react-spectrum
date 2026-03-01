import {action} from 'storybook/actions';
import {Button} from '@vue-spectrum/button';
import {DropZone} from '../src';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import {IllustratedMessage} from '@vue-spectrum/illustratedmessage';
import {h, ref} from 'vue';
import type {Meta, StoryObj} from '@storybook/vue3-vite';
import './styles.css';

type FileFilledSource = {
  id?: number,
  name: string,
  src?: string,
  type: string
};

const TABLE_COLUMNS = [
  {key: 'name', label: 'Name'},
  {key: 'type', label: 'Type'}
];

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

const meta: Meta<typeof DropZone> = {
  title: 'DropZone',
  component: DropZone
};

export default meta;

type Story = StoryObj<typeof meta>;

function renderUploadIllustration() {
  return h('svg', {
    width: '191.2',
    height: '97.9',
    viewBox: '0 0 191.2 97.9',
    'aria-hidden': 'true'
  }, [
    h('path', {d: 'M51.5 33h-48A3.543 3.543 0 000 36.5v35A3.543 3.543 0 003.5 75h48a3.543 3.543 0 003.5-3.5v-35a3.543 3.543 0 00-3.5-3.5zm-48 3h48a.472.472 0 01.5.5v30.6L40.5 55.4a2.94 2.94 0 00-2.2-.9 3.1 3.1 0 00-2.2.9l-4.7 5-11.8-12a2.94 2.94 0 00-2.2-.9 3.1 3.1 0 00-2.2.9L3 60.8V36.5a.472.472 0 01.5-.5zM3 71.5v-7.8l13.7-13.8a1.08 1.08 0 01.7-.3.908.908 0 01.7.3L40.2 72H3.5a.472.472 0 01-.5-.5zm48.5.5h-8.6c0-.1-.1-.1-.1-.2l-9.9-10 4.7-5a.908.908 0 01.7-.3.779.779 0 01.7.3L52 70v1.5a.472.472 0 01-.5.5z', stroke: 'none'}),
    h('path', {d: 'M41.8 51.3a5.664 5.664 0 004.1-1.7 5.835 5.835 0 001.7-4.1 5.957 5.957 0 00-5.8-5.9 5.85 5.85 0 000 11.7zm-2.7-8.5a3.864 3.864 0 012.7-1.1 3.8 3.8 0 013.8 3.8 3.756 3.756 0 01-3.8 3.8 3.8 3.8 0 01-3.8-3.8 3.864 3.864 0 011.1-2.7zM187.3 35h-27.2l-7.5-6.8a4.713 4.713 0 00-3-1.2h-15.3a3.159 3.159 0 00-3.2 3.2v40.1a3.691 3.691 0 003.7 3.7h52.7a3.691 3.691 0 003.7-3.7V38.7a3.933 3.933 0 00-3.9-3.7zm-53.1-5h15.3a1.284 1.284 0 011 .4l5.1 4.6H134v-4.8a.215.215 0 01.2-.2zM188 70.3a.684.684 0 01-.7.7h-52.7a.684.684 0 01-.7-.7V38h53.3a.684.684 0 01.7.7v31.6zM100.4 86L93 93.4V55.7a1.5 1.5 0 00-3 0v37.7L82.6 86a1.449 1.449 0 00-2.1 0 1.541 1.541 0 000 2.1l8.9 8.9a2.878 2.878 0 002.1.9 2.723 2.723 0 002.1-.9l8.9-8.9a1.485 1.485 0 00-2.1-2.1z', stroke: 'none'}),
    h('path', {d: 'M119.5 26a1.538 1.538 0 00-1.5 1.5v43.7a.86.86 0 01-.8.8H97.5a1.5 1.5 0 000 3h19.7a3.8 3.8 0 003.8-3.8V27.5a1.538 1.538 0 00-1.5-1.5zM121 21.4a.749.749 0 00-.1-.5c-.1-.2-.2-.3-.3-.5l-21-20a2.186 2.186 0 00-.5-.3 1.486 1.486 0 00-.6-.1H67.8A3.8 3.8 0 0064 3.8v67.4a3.8 3.8 0 003.8 3.8h17.7a1.5 1.5 0 000-3H67.8a.86.86 0 01-.8-.8V3.8a.86.86 0 01.8-.8H97v16.2a3.8 3.8 0 003.8 3.8h19c.1 0 .2 0 .2-.1h.1c.1 0 .2-.1.3-.1l.1-.1c.1 0 .1-.1.2-.1a2.186 2.186 0 00.3-.5v-.7zm-21-2.2V5l15.7 15h-15a.858.858 0 01-.7-.8z', stroke: 'none'})
  ]);
}

function renderNotFoundIllustration() {
  return h('svg', {
    width: '135.321',
    height: '87',
    viewBox: '0 0 135.321 87',
    'aria-hidden': 'true'
  }, [
    h('g', {
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: '10'
    }, [
      h('path', {
        d: 'M11.821 60.5v23a2.006 2.006 0 002 2h118a2.006 2.006 0 002-2v-80a2.006 2.006 0 00-2-2h-118a2.006 2.006 0 00-2 2v27',
        strokeWidth: '3'
      }),
      h('path', {
        d: 'M133.721 14h-122M29.721 8h-10',
        strokeWidth: '2'
      }),
      h('path', {
        d: 'M2.121 55.1l19.3-19.2M21.421 55.1l-19.3-19.2',
        strokeWidth: '3'
      })
    ])
  ]);
}

function renderFileIllustration() {
  return h('svg', {
    width: '32',
    height: '32',
    viewBox: '0 0 32 32',
    'aria-hidden': 'true'
  }, [
    h('path', {fill: 'var(--spectrum-global-color-gray-50)', d: 'M6 31.503a2.503 2.503 0 01-2.5-2.5v-26A2.503 2.503 0 016 .502h15.38a1.988 1.988 0 011.411.582l5.12 5.103a2.015 2.015 0 01.589 1.416v21.399a2.502 2.502 0 01-2.5 2.5z'}),
    h('path', {fill: 'var(--spectrum-global-color-gray-500)', d: 'M28.26 5.83L23.14.73A2.465 2.465 0 0021.38 0H6a3.009 3.009 0 00-3 3v26a3.002 3.002 0 003 3h20a3.002 3.002 0 003-3V7.6a2.515 2.515 0 00-.74-1.77zM22.5 1.5l5.02 5H23a.501.501 0 01-.5-.5zM28 29a2 2 0 01-2 2H6a2 2 0 01-2-2V3a2.006 2.006 0 012-2h15.38a.486.486 0 01.12.01V6A1.504 1.504 0 0023 7.5h4.99a.34.34 0 01.01.1z'})
  ]);
}

function normalizeFiles(files: File[], allowsMultiple = true): File[] {
  if (allowsMultiple) {
    return files;
  }

  return files.slice(0, 1);
}

function renderEmptyState() {
  return h(IllustratedMessage, null, {
    default: () => [
      renderNotFoundIllustration(),
      h('h3', {class: 'spectrum-IllustratedMessage-heading'}, 'No files'),
      h('div', {class: 'spectrum-IllustratedMessage-description'}, 'No files selected')
    ]
  });
}

function renderDroppedFilesTable(columns: Array<{key: string, label: string}>, rows: Array<FileFilledSource>) {
  return h('div', {
    class: 'vs-dropzone-table',
    style: {
      minHeight: 'var(--spectrum-global-dimension-size-3000)',
      width: 'var(--spectrum-global-dimension-size-3000)'
    }
  }, [
    h('div', {class: 'vs-dropzone-table__head'}, columns.map((column) => h('div', {
      key: column.key,
      class: 'vs-dropzone-table__head-cell'
    }, column.label))),
    rows.length > 0
      ? h('div', {class: 'vs-dropzone-table__body'}, rows.map((row) => h('div', {
        key: row.id ?? row.name,
        class: 'vs-dropzone-table__row'
      }, [
        h('div', {class: 'vs-dropzone-table__cell'}, row.name),
        h('div', {class: 'vs-dropzone-table__cell'}, row.type || '-')
      ])))
      : h('div', {class: 'vs-dropzone-table__empty'}, [renderEmptyState()])
  ]);
}

function renderExample(baseArgs: Record<string, unknown> = {}) {
  return (args: Record<string, unknown>) => ({
    components: {Button, DropZone, FileTrigger, IllustratedMessage},
    setup() {
      let isFilled = ref(false);
      let rows = ref<Array<FileFilledSource>>([]);

      let updateRows = (files: File[]) => {
        rows.value = files.map((file, index) => ({
          id: index,
          name: file.name,
          type: file.type
        }));
        isFilled.value = files.length > 0;
      };

      let onSelectFiles = (files: File[]) => {
        updateRows(normalizeFiles(files, true));
      };

      return {
        args,
        baseArgs,
        columns: TABLE_COLUMNS,
        isFilled,
        onDropEnter: action('onDropEnter'),
        onDropExit: action('onDropExit'),
        onPaste: action('onPaste'),
        onSelectFiles,
        rows,
        updateRows
      };
    },
    render() {
      return h('div', {style: {display: 'grid', gap: '12px', width: 'var(--spectrum-global-dimension-size-3000)'}}, [
        h(DropZone, {
          ...this.args,
          ...this.baseArgs,
          isFilled: this.isFilled,
          onFilesDrop: this.updateRows,
          onDropEnter: this.onDropEnter,
          onDropExit: this.onDropExit,
          onPaste: this.onPaste,
          style: {
            width: 'var(--spectrum-global-dimension-size-3000)',
            height: 'var(--spectrum-global-dimension-size-3000)'
          }
        }, {
          default: () => [
            h(IllustratedMessage, null, {
              default: () => [
                renderUploadIllustration(),
                h('h3', {class: 'spectrum-IllustratedMessage-heading'}, 'Drag a file here'),
                h('div', {class: 'spectrum-IllustratedMessage-description'}, [
                  h(FileTrigger, {
                    allowsMultiple: true,
                    onSelect: this.onSelectFiles
                  }, {
                    default: () => h(Button, {variant: 'primary'}, {default: () => 'Select a file'})
                  })
                ])
              ]
            })
          ]
        }),
        renderDroppedFilesTable(this.columns, this.rows)
      ]);
    }
  });
}

function renderDropZoneWithDraggable(baseArgs: Record<string, unknown> = {}) {
  return (args: Record<string, unknown>) => ({
    components: {DropZone, IllustratedMessage},
    setup() {
      let isFilled = ref(false);
      let filledText = ref<string | null>(null);
      let mergedArgs = {
        ...args,
        ...baseArgs
      };

      let onDragStart = (event: DragEvent) => {
        event.dataTransfer?.setData('text/plain', 'Dragged text sample');
      };

      let onTextDrop = (value: string) => {
        if (!value) {
          return;
        }

        filledText.value = value;
        isFilled.value = true;
      };

      return {
        args,
        baseArgs,
        filledText,
        isFilled,
        mergedArgs,
        onDragStart,
        onDropEnter: action('onDropEnter'),
        onDropExit: action('onDropExit'),
        onPaste: action('onPaste'),
        onTextDrop
      };
    },
    render() {
      return h('div', {style: {display: 'flex', gap: '12px', alignItems: 'center'}}, [
        h('div', {
          draggable: 'true',
          role: 'button',
          tabindex: 0,
          class: 'draggable',
          style: {width: 'fit-content'},
          onDragstart: this.onDragStart
        }, [
          h('svg', {
            width: '12',
            height: '12',
            viewBox: '0 0 18 18',
            'aria-hidden': 'true'
          }, [
            h('path', {
              d: 'M4 4h10M4 9h10M4 14h10',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-linecap': 'round',
              'stroke-width': '1.5'
            })
          ]),
          h('span', 'Drag me')
        ]),
        h(DropZone, {
          ...this.mergedArgs,
          isFilled: this.isFilled,
          onDropEnter: this.onDropEnter,
          onDropExit: this.onDropExit,
          onPaste: this.onPaste,
          onTextDrop: this.onTextDrop
        }, {
          default: () => [
            h(IllustratedMessage, null, {
              default: () => [
                renderUploadIllustration(),
                h('h3', {class: 'spectrum-IllustratedMessage-heading'}, 'Drag and Drop here')
              ]
            }),
            this.filledText ? h('div', this.filledText) : null
          ]
        })
      ]);
    }
  });
}

function renderDropZoneWithButton(args: Record<string, unknown>) {
  return {
    components: {Button, DropZone, FileTrigger, IllustratedMessage},
    setup() {
      let isFilled = ref(false);
      let filledSrc = ref<FileFilledSource | null>(null);

      let updateWithFiles = (files: File[]) => {
        if (files.length === 0) {
          return;
        }

        let first = files[0];
        filledSrc.value = {
          src: URL.createObjectURL(first),
          type: first.type,
          name: first.name
        };
        isFilled.value = true;
      };

      let onSelect = (files: File[]) => {
        updateWithFiles(normalizeFiles(files, false));
      };

      return {
        args,
        filledSrc,
        isFilled,
        onDropEnter: action('onDropEnter'),
        onDropExit: action('onDropExit'),
        onPaste: action('onPaste'),
        onSelect,
        updateWithFiles
      };
    },
    render() {
      return h('div', {style: {display: 'grid', gap: '12px', width: 'var(--spectrum-global-dimension-size-3000)'}}, [
        h(DropZone, {
          ...this.args,
          UNSAFE_className: this.isFilled ? 'is-filled' : undefined,
          isFilled: this.isFilled,
          onDropEnter: this.onDropEnter,
          onDropExit: this.onDropExit,
          onPaste: this.onPaste,
          onFilesDrop: this.updateWithFiles,
          style: {
            width: 'var(--spectrum-global-dimension-size-3000)',
            height: 'var(--spectrum-global-dimension-size-3000)'
          }
        }, {
          default: () => [
            h(IllustratedMessage, null, {
              default: () => [
                renderUploadIllustration(),
                h('h3', {class: 'spectrum-IllustratedMessage-heading'}, 'Drag and Drop here'),
                h('div', {class: 'spectrum-IllustratedMessage-description'}, [
                  h(FileTrigger, {
                    onSelect: this.onSelect
                  }, {
                    default: () => h(Button, {variant: 'primary'}, {default: () => 'Select a file'})
                  })
                ])
              ]
            })
          ]
        }),
        this.isFilled
          ? h('div', {class: 'files'}, [renderFileIllustration(), this.filledSrc?.name])
          : null
      ]);
    }
  };
}

function renderFilledDropZone(args: Record<string, unknown>) {
  return {
    components: {DropZone},
    setup() {
      let isFilled = ref(true);
      let filledSrc = ref('https://i.imgur.com/DhygPot.jpg');

      let onDragStart = (event: DragEvent) => {
        event.dataTransfer?.setData('text/plain', 'https://i.imgur.com/Z7AzH2c.jpg');
      };

      let onFilesDrop = (files: File[]) => {
        let first = files[0];
        if (!first || !IMAGE_MIME_TYPES.has(first.type)) {
          return;
        }

        filledSrc.value = URL.createObjectURL(first);
        isFilled.value = true;
      };

      let onTextDrop = (value: string) => {
        if (!value) {
          return;
        }

        filledSrc.value = value;
        isFilled.value = true;
      };

      let getDropOperation = (types: Set<string>) => {
        if (types.has('image/png') || types.has('image/jpeg')) {
          return 'copy';
        }

        return 'cancel';
      };

      return {
        args,
        filledSrc,
        getDropOperation,
        isFilled,
        onDragStart,
        onDropEnter: action('onDropEnter'),
        onDropExit: action('onDropExit'),
        onFilesDrop,
        onPaste: action('onPaste'),
        onTextDrop
      };
    },
    render() {
      return h('div', {style: {display: 'grid', gap: '12px', width: 'var(--spectrum-global-dimension-size-3000)'}}, [
        h('div', {
          draggable: 'true',
          role: 'button',
          tabindex: 0,
          style: {
            margin: '20px',
            width: 'fit-content'
          },
          onDragstart: this.onDragStart
        }, [
          h('img', {width: '150', height: '100', alt: 'traditional roof', src: 'https://i.imgur.com/Z7AzH2c.jpg'})
        ]),
        h(DropZone, {
          ...this.args,
          UNSAFE_className: this.isFilled ? 'is-filled' : undefined,
          getDropOperation: this.getDropOperation,
          isFilled: this.isFilled,
          onDropEnter: this.onDropEnter,
          onDropExit: this.onDropExit,
          onPaste: this.onPaste,
          onFilesDrop: this.onFilesDrop,
          onTextDrop: this.onTextDrop,
          style: {
            width: 'var(--spectrum-global-dimension-size-3000)',
            height: 'var(--spectrum-global-dimension-size-2400)',
            position: 'relative'
          }
        }, {
          default: () => [
            h('img', {class: 'images', alt: 'a starry sky', src: this.filledSrc})
          ]
        })
      ]);
    }
  };
}

export const withDraggable: Story = {
  render: renderDropZoneWithDraggable()
};

export const customAriaLabel: Story = {
  render: renderDropZoneWithDraggable({'aria-label': 'custom label'})
};

export const withButton: Story = {
  render: (args) => renderDropZoneWithButton(args)
};

export const customBannerMessage: Story = {
  render: renderExample({replaceMessage: 'This is a custom message'})
};

export const acceptsMultiple: Story = {
  render: renderExample({})
};

export const filledDropzone: Story = {
  render: (args) => renderFilledDropZone(args)
};
