import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="2" x="2" y="20"></rect><rect fill-rule="evenodd" height="6" width="2" x="2" y="10"></rect><path fill-rule="evenodd" d="M4,32V30H2v3.111A.889.889,0,0,0,2.889,34H6V32Z"></path><rect fill-rule="evenodd" height="2" width="6" x="10" y="32"></rect><rect fill-rule="evenodd" height="6" width="2" x="32" y="10"></rect><path fill-rule="evenodd" d="M33.111,2H30V4h2V6h2V2.889A.889.889,0,0,0,33.111,2Z"></path><rect fill-rule="evenodd" height="2" width="6" x="20" y="2"></rect><rect fill-rule="evenodd" height="2" width="6" x="10" y="2"></rect><path fill-rule="evenodd" d="M6,2H3A1,1,0,0,0,2,3V6H4V4H6Z"></path><path fill-rule="evenodd" d="M34.887,24.684l-4.034-3.537A.489.489,0,0,0,30.5,21a.5.5,0,0,0-.5.5V24H26V20h2.5a.5.5,0,0,0,.5-.5.49.49,0,0,0-.148-.35l-3.536-4.033a.5.5,0,0,0-.633,0l-3.536,4.033A.489.489,0,0,0,21,19.5a.5.5,0,0,0,.5.5H24v4H20V21.5a.5.5,0,0,0-.5-.5.489.489,0,0,0-.35.147l-4.034,3.537a.5.5,0,0,0,0,.632l4.034,3.536A.49.49,0,0,0,19.5,29a.5.5,0,0,0,.5-.5V26h4v4H21.5a.5.5,0,0,0-.5.5.487.487,0,0,0,.147.35l3.536,4.034a.5.5,0,0,0,.633,0l3.536-4.034A.488.488,0,0,0,29,30.5a.5.5,0,0,0-.5-.5H26V26h4v2.5a.5.5,0,0,0,.5.5.49.49,0,0,0,.35-.148l4.034-3.536a.5.5,0,0,0,0-.632Z"></path>`;

const SelectionMove = createWorkflowIcon('VueWorkflowSelectionMove', svgAttributes, svgInnerHTML);

export default SelectionMove;
