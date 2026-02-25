import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,26.2A10.2,10.2,0,1,1,28.2,18,10.2,10.2,0,0,1,18,28.2Z"></path><circle fill-rule="evenodd" cx="18" cy="18" r="4"></circle>`;

const Target = createWorkflowIcon('VueWorkflowTarget', svgAttributes, svgInnerHTML);

export default Target;
