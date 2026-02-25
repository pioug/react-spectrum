import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,7V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V7A1,1,0,0,0,3,8H8V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V31a1,1,0,0,0-1-1H12V26H31a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1H12V18H31a1,1,0,0,0,1-1V15a1,1,0,0,0-1-1H12V8H31A1,1,0,0,0,32,7Z"></path>`;

const Breakdown = createWorkflowIcon('VueWorkflowBreakdown', svgAttributes, svgInnerHTML);

export default Breakdown;
