import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm4.9,10.4H28.5v3.4a.5.5,0,0,1-.5.5H26a.5.5,0,0,1-.5-.5V28.5H22.1a.5.5,0,0,1-.5-.5V26a.5.5,0,0,1,.5-.5h3.4V22.1a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v3.4h3.4a.5.5,0,0,1,.5.5v2A.5.5,0,0,1,31.9,28.5Z"></path><path fill-rule="evenodd" d="M16,27.1V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5v6a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V8h8V28H9a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h8.172A10.82,10.82,0,0,1,16,27.1Z"></path>`;

const TextAdd = createWorkflowIcon('VueWorkflowTextAdd', svgAttributes, svgInnerHTML);

export default TextAdd;
