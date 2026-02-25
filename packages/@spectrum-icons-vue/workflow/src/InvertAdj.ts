import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8,18.5a10.4,10.4,0,0,0,2.182,6.341L25.919,11.07A10.5,10.5,0,0,0,8,18.5Z"></path><path fill-rule="evenodd" d="M35,2H1A1,1,0,0,0,0,3V33a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V3A1,1,0,0,0,35,2ZM29,18.5a10.466,10.466,0,0,1-18.818,6.341L2,32V4H34l-8.081,7.07A10.472,10.472,0,0,1,29,18.5Z"></path>`;

const InvertAdj = createWorkflowIcon('VueWorkflowInvertAdj', svgAttributes, svgInnerHTML);

export default InvertAdj;
