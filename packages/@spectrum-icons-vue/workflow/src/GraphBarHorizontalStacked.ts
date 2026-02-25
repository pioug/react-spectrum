import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="34" rx="0.5" ry="0.5" width="2" x="2" y="2"></rect><rect fill-rule="evenodd" height="6" width="6" x="6" y="20"></rect><rect fill-rule="evenodd" height="6" width="14" x="6" y="4"></rect><rect fill-rule="evenodd" height="6" width="4" x="6" y="28"></rect><rect fill-rule="evenodd" height="6" width="10" x="6" y="12"></rect><path fill-rule="evenodd" d="M25,12H18v6h7a1,1,0,0,0,1-1V13A1,1,0,0,0,25,12Z"></path><path fill-rule="evenodd" d="M33,4H22v6H33a1,1,0,0,0,1-1V5A1,1,0,0,0,33,4Z"></path><path fill-rule="evenodd" d="M17,20H14v6h3a1,1,0,0,0,1-1V21A1,1,0,0,0,17,20Z"></path><path fill-rule="evenodd" d="M15,28H12v6h3a1,1,0,0,0,1-1V29A1,1,0,0,0,15,28Z"></path>`;

const GraphBarHorizontalStacked = createWorkflowIcon('VueWorkflowGraphBarHorizontalStacked', svgAttributes, svgInnerHTML);

export default GraphBarHorizontalStacked;
