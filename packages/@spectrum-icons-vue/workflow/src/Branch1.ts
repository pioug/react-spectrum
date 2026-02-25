import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28,18a5.962,5.962,0,0,0-4.608,2.2L13.84,15.333a6.067,6.067,0,1,0-1.346,2.6l9.622,4.9A6,6,0,1,0,28,18Zm0,9a3,3,0,1,1,3-3A3,3,0,0,1,28,27Z"></path>`;

const Branch1 = createWorkflowIcon('VueWorkflowBranch1', svgAttributes, svgInnerHTML);

export default Branch1;
