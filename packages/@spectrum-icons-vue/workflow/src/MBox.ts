import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5A1,1,0,0,0,33,4ZM32,30H4V10H32Z"></path><rect fill-rule="evenodd" height="2" width="2" x="6" y="12"></rect><rect fill-rule="evenodd" height="2" width="2" x="6" y="22"></rect><rect fill-rule="evenodd" height="2" width="4" x="10" y="12"></rect><rect fill-rule="evenodd" height="2" width="4" x="16" y="12"></rect><rect fill-rule="evenodd" height="2" width="4" x="22" y="12"></rect><rect fill-rule="evenodd" height="2" width="4" x="10" y="26"></rect><rect fill-rule="evenodd" height="2" width="4" x="16" y="26"></rect><rect fill-rule="evenodd" height="2" width="4" x="22" y="26"></rect><rect fill-rule="evenodd" height="2" width="2" x="28" y="12"></rect><rect fill-rule="evenodd" height="2" width="2" x="28" y="16"></rect><rect fill-rule="evenodd" height="4" width="2" x="6" y="16"></rect><rect fill-rule="evenodd" height="4" width="2" x="28" y="20"></rect><rect fill-rule="evenodd" height="2" width="2" x="6" y="26"></rect><rect fill-rule="evenodd" height="2" width="2" x="28" y="26"></rect>`;

const MBox = createWorkflowIcon('VueWorkflowMBox', svgAttributes, svgInnerHTML);

export default MBox;
