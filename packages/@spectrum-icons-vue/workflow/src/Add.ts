import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,16H20V7a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1v9H7a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h9v9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V20h9a1,1,0,0,0,1-1V17A1,1,0,0,0,29,16Z"></path>`;

const Add = createWorkflowIcon('VueWorkflowAdd', svgAttributes, svgInnerHTML);

export default Add;
