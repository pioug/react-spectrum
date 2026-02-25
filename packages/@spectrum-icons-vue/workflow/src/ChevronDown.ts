import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8,14.02a2,2,0,0,1,3.411-1.411l6.578,6.572,6.578-6.572a2,2,0,0,1,2.874,2.773l-.049.049L19.4,23.415a2,2,0,0,1-2.825,0h0L8.586,15.432A1.989,1.989,0,0,1,8,14.02Z"></path>`;

const ChevronDown = createWorkflowIcon('VueWorkflowChevronDown', svgAttributes, svgInnerHTML);

export default ChevronDown;
