import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {VueButton, VueCalendar, VueRangeCalendar} from '@vue-spectrum/components';
import {ref} from 'vue';

const meta = {
  title: 'React Aria Components/Calendar',
  component: VueCalendar
} satisfies Meta<typeof VueCalendar>;

export default meta;

type CalendarStory = StoryObj<typeof meta>;

export const CalendarExample: CalendarStory = {
  render: () => ({
    components: {
      VueCalendar
    },
    setup() {
      let value = ref('');
      return {
        value
      };
    },
    template: `
      <VueCalendar v-model="value" />
    `
  })
};

export const CalendarResetValue: CalendarStory = {
  render: () => ({
    components: {
      VueButton,
      VueCalendar
    },
    setup() {
      let value = ref('');
      let reset = () => {
        value.value = '';
      };

      return {
        reset,
        value
      };
    },
    template: `
      <div>
        <VueCalendar v-model="value" />
        <VueButton @click="reset">Reset value</VueButton>
      </div>
    `
  })
};

export const CalendarMultiMonth: CalendarStory = {
  render: (args: {selectionAlignment?: string}) => ({
    components: {
      VueButton,
      VueCalendar
    },
    setup() {
      let value = ref('2021-07-01');
      let reset = () => {
        value.value = '2021-07-01';
      };

      return {
        args,
        reset,
        value
      };
    },
    template: `
      <div>
        <VueButton @click="reset" style="margin-bottom: 20px;">Reset focused date</VueButton>
        <VueCalendar v-model="value" />
      </div>
    `
  }),
  args: {
    selectionAlignment: 'center'
  },
  argTypes: {
    selectionAlignment: {
      control: 'select',
      options: ['start', 'center', 'end']
    }
  }
};

export const CalendarFirstDayOfWeekExample: CalendarStory = {
  render: (args: {locale?: string}) => ({
    components: {
      VueCalendar
    },
    setup() {
      let value = ref('');
      return {
        args,
        value
      };
    },
    template: `
      <VueCalendar v-model="value" />
    `
  }),
  args: {
    locale: 'en-US-u-ca-iso8601-fw-tue'
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en-US-u-ca-iso8601-fw-tue', 'en-US-u-ca-iso8601', 'en-US', 'fr-FR-u-ca-iso8601-fw-tue', 'fr-FR-u-ca-iso8601', 'fr-FR', 'en-US-u-ca-iso8601-fw-tue-nu-thai']
    }
  }
};

export const RangeCalendarExample: CalendarStory = {
  render: () => ({
    components: {
      VueRangeCalendar
    },
    setup() {
      let value = ref({start: '', end: ''});
      return {
        value
      };
    },
    template: `
      <VueRangeCalendar v-model="value" />
    `
  })
};

export const RangeCalendarMultiMonthExample: CalendarStory = {
  render: (args: {selectionAlignment?: string}) => ({
    components: {
      VueRangeCalendar
    },
    setup() {
      let value = ref({start: '2025-08-04', end: '2025-08-10'});
      return {
        args,
        value
      };
    },
    template: `
      <VueRangeCalendar v-model="value" />
    `
  }),
  args: {
    selectionAlignment: 'center'
  },
  argTypes: {
    selectionAlignment: {
      control: 'select',
      options: ['start', 'center', 'end']
    }
  }
};
