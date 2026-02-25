import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M5,18H4a2,2,0,0,0-2,2V33a1,1,0,0,0,1,1H5a1,1,0,0,0,1-1V19A1,1,0,0,0,5,18Z"></path><path fill-rule="evenodd" d="M32,18H31a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V20A2,2,0,0,0,32,18Z"></path><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="20" x="8" y="22"></rect><path fill-rule="evenodd" d="M22,4H14a6,6,0,0,0-6,6v9a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1V10A6,6,0,0,0,22,4Z"></path>`;

const Seat = createWorkflowIcon('VueWorkflowSeat', svgAttributes, svgInnerHTML);

export default Seat;
