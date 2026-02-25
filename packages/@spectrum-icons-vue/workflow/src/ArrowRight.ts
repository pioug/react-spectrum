import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,12H3a1,1,0,0,0-1,1V23a1,1,0,0,0,1,1H20v6.993a.5.5,0,0,0,.854.354L34.2,18,20.854,4.654A.5.5,0,0,0,20,5.007Z"></path>`;

const ArrowRight = createWorkflowIcon('VueWorkflowArrowRight', svgAttributes, svgInnerHTML);

export default ArrowRight;
