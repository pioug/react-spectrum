import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,6H5A1,1,0,0,0,4,7V27a1,1,0,0,1-2,0V10.5a.5.5,0,0,0-.5-.5H.5a.5.5,0,0,0-.5.5V27a3,3,0,0,0,3,3H31a3,3,0,0,0,3-3V7A1,1,0,0,0,33,6ZM31,28H6V8H32V27A1,1,0,0,1,31,28Z"></path><rect fill-rule="evenodd" height="16" width="8" x="22" y="10"></rect>`;

const AdPrint = createWorkflowIcon('VueWorkflowAdPrint', svgAttributes, svgInnerHTML);

export default AdPrint;
