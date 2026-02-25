import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="2" x="2" y="10"></rect><path fill-rule="evenodd" d="M4,22V20H2v3.111A.889.889,0,0,0,2.889,24H6V22Z"></path><path fill-rule="evenodd" d="M24,12V10H22v3.111a.889.889,0,0,0,.889.889H26V12Z"></path><path fill-rule="evenodd" d="M14,32V30H12v3.111a.889.889,0,0,0,.889.889H16V32Z"></path><rect fill-rule="evenodd" height="2" width="6" x="20" y="32"></rect><rect fill-rule="evenodd" height="6" width="2" x="32" y="20"></rect><path fill-rule="evenodd" d="M32,30v2H30v2h3a1,1,0,0,0,1-1V30Z"></path><path fill-rule="evenodd" d="M23.111,2H20V4h2V6h2V2.889A.889.889,0,0,0,23.111,2Z"></path><path fill-rule="evenodd" d="M33.111,12H30v2h2v2h2V12.889A.889.889,0,0,0,33.111,12Z"></path><path fill-rule="evenodd" d="M13.111,22H10v2h2v2h2V22.889A.889.889,0,0,0,13.111,22Z"></path><rect fill-rule="evenodd" height="2" width="6" x="10" y="2"></rect><path fill-rule="evenodd" d="M6,2H3A1,1,0,0,0,2,3V6H4V4H6Z"></path>`;

const SelectAdd = createWorkflowIcon('VueWorkflowSelectAdd', svgAttributes, svgInnerHTML);

export default SelectAdd;
