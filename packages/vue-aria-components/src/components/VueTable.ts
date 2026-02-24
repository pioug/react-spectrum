import {computed, defineComponent, h} from 'vue';
import {getSpectrumContext} from '../context';

type TableColumn = {
  key: string,
  label: string
};

type TableRow = Record<string, unknown>;

export const VueTable = defineComponent({
  name: 'VueTable',
  props: {
    columns: {
      type: Array as () => TableColumn[],
      default: () => []
    },
    rows: {
      type: Array as () => TableRow[],
      default: () => []
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    caption: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: undefined
    }
  },
  emits: {
    'update:modelValue': (value: string | number) => typeof value === 'string' || typeof value === 'number',
    rowAction: (row: TableRow) => typeof row === 'object' && row !== null
  },
  setup(props, {emit, attrs}) {
    let context = getSpectrumContext();

    let classes = computed(() => ([
      'vs-table',
      context.value.scale === 'large' ? 'vs-table--large' : 'vs-table--medium'
    ]));

    let getRowId = (row: TableRow, index: number) => {
      let value = row[props.rowKey];
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }

      return index;
    };

    return function render() {
      return h('div', {
        class: [classes.value, attrs.class],
        'data-vac': ''
      }, [
        h('table', {class: 'vs-table__table'}, [
          props.caption ? h('caption', {class: 'vs-table__caption'}, props.caption) : null,
          h('thead', [
            h('tr', props.columns.map((column) => h('th', {class: 'vs-table__header', key: column.key}, column.label)))
          ]),
          h('tbody', props.rows.length > 0
            ? props.rows.map((row, index) => {
              let rowId = getRowId(row, index);
              let isSelected = props.modelValue === rowId;
              return h('tr', {
                class: ['vs-table__row', isSelected ? 'is-selected' : null],
                key: String(rowId),
                onClick: () => {
                  emit('update:modelValue', rowId);
                  emit('rowAction', row);
                }
              }, props.columns.map((column) => h('td', {class: 'vs-table__cell', key: `${rowId}-${column.key}`}, String(row[column.key] ?? ''))));
            })
            : [
              h('tr', {class: 'vs-table__row is-empty', key: 'empty'}, [
                h('td', {class: 'vs-table__cell', colspan: Math.max(props.columns.length, 1)}, 'No rows')
              ])
            ])
        ])
      ]);
    };
  }
});
