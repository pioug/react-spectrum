import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="2" x="2" y="20"></rect><rect fill-rule="evenodd" height="6" width="2" x="2" y="10"></rect><rect fill-rule="evenodd" height="6" width="2" x="32" y="10"></rect><path fill-rule="evenodd" d="M4,32V30H2v3.111A.889.889,0,0,0,2.889,34H6V32Z"></path><path fill-rule="evenodd" d="M33.111,2H30V4h2V6h2V2.888A.888.888,0,0,0,33.111,2Z"></path><rect fill-rule="evenodd" height="2" width="6" x="20" y="2"></rect><rect fill-rule="evenodd" height="2" width="6" x="10" y="2"></rect><rect fill-rule="evenodd" height="2" width="6" x="10" y="32"></rect><path fill-rule="evenodd" d="M6,2H3A1,1,0,0,0,2,3V6H4V4H6Z"></path><path fill-rule="evenodd" d="M27,18a9,9,0,1,0,9,9A9,9,0,0,0,27,18Zm5.957,6.26-6.476,7.929a.5.5,0,0,1-.738.041l-4.759-4.667a.5.5,0,0,1-.008-.708l1.61-1.641a.5.5,0,0,1,.706-.007l2.573,2.519L30.4,22.173a.5.5,0,0,1,.7-.07l1.78,1.453A.5.5,0,0,1,32.957,24.26Z"></path>`;

const SelectionChecked = createWorkflowIcon('VueWorkflowSelectionChecked', svgAttributes, svgInnerHTML);

export default SelectionChecked;
