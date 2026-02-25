import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="8" rx="1" ry="1" width="6" x="2" y="26"></rect><path fill-rule="evenodd" d="M16,33a1,1,0,0,1-1,1H11a1,1,0,0,1,0-2h4A1,1,0,0,1,16,33Z"></path><path fill-rule="evenodd" d="M24,33a1,1,0,0,1-1,1H19a1,1,0,0,1,0-2h4A1,1,0,0,1,24,33Z"></path><path fill-rule="evenodd" d="M32,33a1,1,0,0,1-1,1H27a1,1,0,0,1,0-2h4A1,1,0,0,1,32,33Z"></path>`;

const ConfidenceOne = createWorkflowIcon('VueWorkflowConfidenceOne', svgAttributes, svgInnerHTML);

export default ConfidenceOne;
