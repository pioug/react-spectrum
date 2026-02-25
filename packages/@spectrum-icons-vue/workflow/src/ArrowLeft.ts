import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,12H33a1,1,0,0,1,1,1V23a1,1,0,0,1-1,1H16v6.993a.5.5,0,0,1-.854.354L1.8,18,15.146,4.654A.5.5,0,0,1,16,5.007Z"></path>`;

const ArrowLeft = createWorkflowIcon('VueWorkflowArrowLeft', svgAttributes, svgInnerHTML);

export default ArrowLeft;
