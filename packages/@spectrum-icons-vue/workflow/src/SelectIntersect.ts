import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="2" x="2" y="10"></rect><path fill-rule="evenodd" d="M4,22V20H2v3.111A.889.889,0,0,0,2.889,24H8V22Z"></path><path fill-rule="evenodd" d="M14,32V28H12v5.111a.889.889,0,0,0,.889.889H16V32Z"></path><rect fill-rule="evenodd" height="2" width="6" x="20" y="32"></rect><rect fill-rule="evenodd" height="6" width="2" x="32" y="20"></rect><path fill-rule="evenodd" d="M32,30v2H30v2h3a1,1,0,0,0,1-1V30Z"></path><path fill-rule="evenodd" d="M23.111,2H20V4h2V8h2V2.889A.889.889,0,0,0,23.111,2Z"></path><path fill-rule="evenodd" d="M33.111,12H28v2h4v2h2V12.889A.889.889,0,0,0,33.111,12Z"></path><rect fill-rule="evenodd" height="2" width="6" x="10" y="2"></rect><path fill-rule="evenodd" d="M6,2H3A1,1,0,0,0,2,3V6H4V4H6Z"></path><rect fill-rule="evenodd" height="2.263" width="2.25" x="12" y="12"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="16.84" y="12"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="21.739" y="12.01"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="12" y="16.824"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="16.84" y="16.824"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="16.84" y="21.507"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="21.739" y="16.834"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="12.01" y="21.737"></rect><rect fill-rule="evenodd" height="2.263" width="2.25" x="21.749" y="21.507"></rect>`;

const SelectIntersect = createWorkflowIcon('VueWorkflowSelectIntersect', svgAttributes, svgInnerHTML);

export default SelectIntersect;
