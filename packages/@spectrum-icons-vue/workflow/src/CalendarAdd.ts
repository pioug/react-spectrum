import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" width="4" x="6" y="12"></rect><rect fill-rule="evenodd" height="4" width="4" x="12" y="12"></rect><rect fill-rule="evenodd" height="4" width="4" x="18" y="12"></rect><rect fill-rule="evenodd" height="4" width="4" x="6" y="18"></rect><rect fill-rule="evenodd" height="4" width="4" x="12" y="18"></rect><rect fill-rule="evenodd" height="4" width="4" x="6" y="24"></rect><path fill-rule="evenodd" d="M14.7,27a12.274,12.274,0,0,1,.384-3H12v4h2.75C14.724,27.67,14.7,27.338,14.7,27Z"></path><path fill-rule="evenodd" d="M27,14.7c.338,0,.669.024,1,.05V12H24v3.084A12.284,12.284,0,0,1,27,14.7Z"></path><path fill-rule="evenodd" d="M15.769,32H2V8H6V9a1,1,0,0,0,1,1H9a1,1,0,0,0,1-1V8H24V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h4v7.769a12.26,12.26,0,0,1,2,1.124V7a1,1,0,0,0-1-1H28V3a1,1,0,0,0-1-1H25a1,1,0,0,0-1,1V6H10V3A1,1,0,0,0,9,2H7A1,1,0,0,0,6,3V6H1A1,1,0,0,0,0,7V33a1,1,0,0,0,1,1H16.893A12.283,12.283,0,0,1,15.769,32Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const CalendarAdd = createWorkflowIcon('VueWorkflowCalendarAdd', svgAttributes, svgInnerHTML);

export default CalendarAdd;
