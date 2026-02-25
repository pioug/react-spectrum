import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,33a1,1,0,0,0,1,1h7V18H2Z"></path><path fill-rule="evenodd" d="M3,2A1,1,0,0,0,2,3V14h8V2Z"></path><path fill-rule="evenodd" d="M26,34h7a1,1,0,0,0,1-1V28H26Z"></path><path fill-rule="evenodd" d="M33,2H26V8h8V3A1,1,0,0,0,33,2Z"></path><rect fill-rule="evenodd" height="12" width="8" x="14" y="22"></rect><rect fill-rule="evenodd" height="16" width="8" x="14" y="2"></rect><rect fill-rule="evenodd" height="12" width="8" x="26" y="12"></rect>`;

const ViewCard = createWorkflowIcon('VueWorkflowViewCard', svgAttributes, svgInnerHTML);

export default ViewCard;
