import '@adobe/spectrum-css-temp/components/calendar/vars.css';
import {generatePowerset} from '@vue-spectrum/story-utils';
import {Grid, repeat} from '@vue-spectrum/layout';
import {computed, defineComponent, h} from 'vue';
import {Meta, StoryObj} from '@storybook/vue3-vite';

type CellState = {
  isDisabled?: boolean,
  isFocused?: boolean,
  isHovered?: boolean,
  isPressed?: boolean,
  isRangeEnd?: boolean,
  isRangeSelection?: boolean,
  isRangeStart?: boolean,
  isSelected?: boolean,
  isSelectionEnd?: boolean,
  isSelectionStart?: boolean,
  isToday?: boolean
};

const states: CellState[] = [
  {isToday: true},
  {isSelected: true},
  {isFocused: true},
  {isHovered: true},
  {isPressed: true},
  {isDisabled: true},
  {isRangeSelection: true},
  {isRangeStart: true},
  {isRangeEnd: true},
  {isSelectionStart: true},
  {isSelectionEnd: true}
];

const meta: Meta = {
  title: 'Date and Time/RangeCalendar/cell'
};

export default meta;

type Story = StoryObj<typeof meta>;

const CellPreview = defineComponent({
  name: 'RangeCalendarCellPreview',
  props: {
    state: {
      type: Object as () => CellState,
      required: true
    }
  },
  setup(props) {
    return () => h('span', {
      class: ['spectrum-Calendar-date', {
        'is-disabled': props.state.isDisabled,
        'is-focused': props.state.isFocused,
        'is-hovered': props.state.isHovered,
        'is-pressed': props.state.isPressed,
        'is-range-end': props.state.isRangeEnd,
        'is-range-selection': props.state.isRangeSelection,
        'is-range-start': props.state.isRangeStart,
        'is-selected': props.state.isSelected,
        'is-selection-end': props.state.isSelectionEnd,
        'is-selection-start': props.state.isSelectionStart,
        'is-today': props.state.isToday
      }]
    }, [
      h('span', {class: 'spectrum-Calendar-dateText'}, '12')
    ]);
  }
});

export const Default: Story = {
  render: () => ({
    components: {CellPreview, Grid},
    setup() {
      let combinations = computed(() => generatePowerset(states, (merged: CellState) =>
        Boolean(merged.isDisabled && (merged.isFocused || merged.isHovered || merged.isPressed))
        || Boolean(!merged.isSelected && (merged.isRangeSelection || merged.isSelectionStart || merged.isSelectionEnd || merged.isRangeStart || merged.isRangeEnd))
        || Boolean((merged.isRangeStart || merged.isRangeEnd) && !merged.isRangeSelection)
        || Boolean(merged.isRangeStart && merged.isRangeEnd)
        || Boolean(merged.isSelectionStart && !merged.isRangeStart)
        || Boolean(merged.isSelectionEnd && !merged.isRangeEnd)
      ));

      let describeState = (state: CellState) => Object.keys(state).join(' ');

      return {
        combinations,
        describeState,
        repeat
      };
    },
    template: `
      <Grid :columns="repeat(10, '100px')">
        <div v-for="(state, index) in combinations" :key="index">
          {{ describeState(state) }}
          <div style="position: relative; width: 40px; height: 40px; text-align: center;">
            <CellPreview :state="state" />
          </div>
        </div>
      </Grid>
    `
  })
};
