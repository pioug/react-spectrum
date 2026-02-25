import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9.46,4H7A1,1,0,0,0,6,5V31a1,1,0,0,0,1,1H9.46a2,2,0,0,0,1.007-.272L32.531,18.862a1,1,0,0,0,0-1.724L10.467,4.272A2,2,0,0,0,9.46,4Z"></path>`;

const Play = createWorkflowIcon('VueWorkflowPlay', svgAttributes, svgInnerHTML);

export default Play;
