import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.191,32.143,30.646,27.6A9.066,9.066,0,1,0,27.6,30.646l4.545,4.545a2.044,2.044,0,0,0,3.048,0A2.195,2.195,0,0,0,35.191,32.143ZM17.412,22.98a5.568,5.568,0,1,1,5.568,5.567A5.568,5.568,0,0,1,17.412,22.98Z"></path><path fill-rule="evenodd" d="M11.6,23A11.4,11.4,0,0,1,20,12.012V11a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H19a.948.948,0,0,0,.5-.155A11.4,11.4,0,0,1,11.6,23Z"></path><path fill-rule="evenodd" d="M22,9v2.65c.33-.029.662-.05,1-.05a11.334,11.334,0,0,1,5,1.167V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V8H21A1,1,0,0,1,22,9Z"></path>`;

const Compare = createWorkflowIcon('VueWorkflowCompare', svgAttributes, svgInnerHTML);

export default Compare;
