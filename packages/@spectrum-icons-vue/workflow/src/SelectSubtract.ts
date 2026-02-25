import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,14V12h2v3.111a.889.889,0,0,1-.889.889H28V14Z"></path><path fill-rule="evenodd" d="M14,30V28h2v3.111a.889.889,0,0,1-.889.889H12V30Z"></path><rect fill-rule="evenodd" height="5" width="2" x="4" y="20"></rect><rect fill-rule="evenodd" height="5" width="2" x="4" y="12"></rect><path fill-rule="evenodd" d="M6,30V28H4v3.111A.889.889,0,0,0,4.889,32H9V30Z"></path><path fill-rule="evenodd" d="M31.111,4H27V6h3V9h2V4.888A.888.888,0,0,0,31.111,4Z"></path><rect fill-rule="evenodd" height="2" width="5.001" x="19" y="4"></rect><rect fill-rule="evenodd" height="2" width="5.001" x="11" y="4"></rect><path fill-rule="evenodd" d="M8,4H5A1,1,0,0,0,4,5V9H6V6H8Z"></path><rect fill-rule="evenodd" height="4" width="2" x="14" y="21"></rect><rect fill-rule="evenodd" height="2" width="4.001" x="21" y="14"></rect><path fill-rule="evenodd" d="M18,14H15a1,1,0,0,0-1,1v3h2V16h2Z"></path>`;

const SelectSubtract = createWorkflowIcon('VueWorkflowSelectSubtract', svgAttributes, svgInnerHTML);

export default SelectSubtract;
