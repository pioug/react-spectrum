import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="28" x="4" y="32"></rect><path fill-rule="evenodd" d="M5,4A1,1,0,0,0,4,5v6a1,1,0,0,0,1,1H7a1,1,0,0,0,1-1V8h8V26H13a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H23a1,1,0,0,0,1-1V27a1,1,0,0,0-1-1H20V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1Z"></path>`;

const TextUnderline = createWorkflowIcon('VueWorkflowTextUnderline', svgAttributes, svgInnerHTML);

export default TextUnderline;
