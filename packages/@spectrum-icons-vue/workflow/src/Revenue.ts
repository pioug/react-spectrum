import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,23.658V33a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V21.9l-4.27,3.493Z"></path><path fill-rule="evenodd" d="M2,33a1,1,0,0,0,1,1H7a1,1,0,0,0,1-1V20.7L2,25.839Z"></path><path fill-rule="evenodd" d="M10,18.981V33a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V21.658l-4.211-4.211Z"></path><path fill-rule="evenodd" d="M26,20.259V33a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V20.769l-2.8-3.13Z"></path><path fill-rule="evenodd" d="M24.6,8.833l2.169,2.427-6.631,5.4-7.7-7.7a.5.5,0,0,0-.679-.026L2,17.289v5.267l9.895-8.481,7.651,7.651a.5.5,0,0,0,.67.034l9.056-7.814,1.856,2.195A.5.5,0,0,0,32,15.808V8H24.97A.5.5,0,0,0,24.6,8.833Z"></path>`;

const Revenue = createWorkflowIcon('VueWorkflowRevenue', svgAttributes, svgInnerHTML);

export default Revenue;
