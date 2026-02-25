import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23,28H20V22H16v6H13a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H23a1,1,0,0,0,1-1V29A1,1,0,0,0,23,28Z"></path><path fill-rule="evenodd" d="M31,4H5A1,1,0,0,0,4,5v6a1,1,0,0,0,1,1H7a1,1,0,0,0,1-1V8h8v8h4V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5A1,1,0,0,0,31,4Z"></path><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="28" x="4" y="18"></rect>`;

const TextStrikethrough = createWorkflowIcon('VueWorkflowTextStrikethrough', svgAttributes, svgInnerHTML);

export default TextStrikethrough;
