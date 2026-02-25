import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,6H28V3a1,1,0,0,0-1-1H25a1,1,0,0,0-1,1V6H10V3A1,1,0,0,0,9,2H7A1,1,0,0,0,6,3V6H1A1,1,0,0,0,0,7V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM32,32H2V8H6V9a1,1,0,0,0,1,1H9a1,1,0,0,0,1-1V8H24V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h4Z"></path><rect fill-rule="evenodd" x="6" y="12" width="4" height="4"></rect><rect fill-rule="evenodd" x="12" y="12" width="4" height="4"></rect><rect fill-rule="evenodd" x="18" y="12" width="4" height="4"></rect><rect fill-rule="evenodd" x="24" y="12" width="4" height="4"></rect><rect fill-rule="evenodd" x="6" y="18" width="4" height="4"></rect><rect fill-rule="evenodd" x="12" y="18" width="4" height="4"></rect><rect fill-rule="evenodd" x="18" y="18" width="4" height="4"></rect><rect fill-rule="evenodd" x="24" y="18" width="4" height="4"></rect><rect fill-rule="evenodd" x="6" y="24" width="4" height="4"></rect><rect fill-rule="evenodd" x="12" y="24" width="4" height="4"></rect><rect fill-rule="evenodd" x="18" y="24" width="4" height="4"></rect><rect fill-rule="evenodd" x="24" y="24" width="4" height="4"></rect>`;

const Calendar = createWorkflowIcon('VueWorkflowCalendar', svgAttributes, svgInnerHTML);

export default Calendar;
