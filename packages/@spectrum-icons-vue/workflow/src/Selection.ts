import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="5" width="2" x="4" y="20"></rect><rect fill-rule="evenodd" height="5" width="2" x="4" y="12"></rect><path fill-rule="evenodd" d="M6,30V28H4v3.111A.889.889,0,0,0,4.89,32H9V30Z"></path><rect fill-rule="evenodd" height="2" width="5" x="12" y="30"></rect><rect fill-rule="evenodd" height="2" width="5" x="20" y="30"></rect><rect fill-rule="evenodd" height="5" width="2" x="30" y="11"></rect><rect fill-rule="evenodd" height="5" width="2" x="30" y="19"></rect><path fill-rule="evenodd" d="M30,27v3H28v2h3a1,1,0,0,0,1-1V27Z"></path><path fill-rule="evenodd" d="M31.112,4H27V6h3V8h2V4.889A.889.889,0,0,0,31.112,4Z"></path><rect fill-rule="evenodd" height="2" width="5.001" x="19" y="4"></rect><rect fill-rule="evenodd" height="2" width="5.001" x="11" y="4"></rect><path fill-rule="evenodd" d="M8,4H5A1,1,0,0,0,4,5V9H6V6H8Z"></path>`;

const Selection = createWorkflowIcon('VueWorkflowSelection', svgAttributes, svgInnerHTML);

export default Selection;
