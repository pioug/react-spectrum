import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" width="6" x="10" y="4"></rect><rect fill-rule="evenodd" height="2" width="6" x="20" y="4"></rect><path fill-rule="evenodd" d="M3,4A1,1,0,0,0,2,5V8H4V6H6V4Z"></path><rect fill-rule="evenodd" height="4" width="2" x="2" y="12"></rect><rect fill-rule="evenodd" height="4" width="2" x="2" y="20"></rect><path fill-rule="evenodd" d="M4,30V28H2v3a1,1,0,0,0,1,1H6V30Z"></path><rect fill-rule="evenodd" height="2" width="6" x="10" y="30"></rect><rect fill-rule="evenodd" height="2" width="6" x="20" y="30"></rect><path fill-rule="evenodd" d="M30,4V6h2V8h2V5a1,1,0,0,0-1-1Z"></path><rect fill-rule="evenodd" height="4" width="2" x="32" y="12"></rect><rect fill-rule="evenodd" height="4" width="2" x="32" y="20"></rect><path fill-rule="evenodd" d="M32,28v2H30v2h3a1,1,0,0,0,1-1V28Z"></path>`;

const RectSelect = createWorkflowIcon('VueWorkflowRectSelect', svgAttributes, svgInnerHTML);

export default RectSelect;
