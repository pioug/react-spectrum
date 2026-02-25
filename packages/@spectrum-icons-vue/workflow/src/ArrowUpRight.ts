import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26.2,18.284,12.181,32.3a1,1,0,0,1-1.414,0L3.7,25.233a1,1,0,0,1,0-1.414L17.716,9.8,12.772,4.854A.5.5,0,0,1,13.125,4H32V22.875a.5.5,0,0,1-.854.353Z"></path>`;

const ArrowUpRight = createWorkflowIcon('VueWorkflowArrowUpRight', svgAttributes, svgInnerHTML);

export default ArrowUpRight;
