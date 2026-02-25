import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,8.5a9.5,9.5,0,0,1,0,19H12a9.5,9.5,0,0,1,0-19ZM24,6H12a12,12,0,0,0,0,24H24A12,12,0,0,0,24,6Zm0,6a6,6,0,1,1-6,6A6.00678,6.00678,0,0,1,24,12Z"></path>`;

const Boolean = createWorkflowIcon('VueWorkflowBoolean', svgAttributes, svgInnerHTML);

export default Boolean;
