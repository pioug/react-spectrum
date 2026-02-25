import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13.5,18a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V20H8V30H9.5a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H6V20H2v1.5a.5.5,0,0,1-.5.5H.5a.5.5,0,0,1-.5-.5v-3A.5.5,0,0,1,.5,18Z"></path><path fill-rule="evenodd" d="M9,4A1,1,0,0,0,8,5v6a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h8V28H17a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1V29a1,1,0,0,0-1-1H24V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1Z"></path>`;

const TextSize = createWorkflowIcon('VueWorkflowTextSize', svgAttributes, svgInnerHTML);

export default TextSize;
