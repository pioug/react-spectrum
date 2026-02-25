import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M1,4A1,1,0,0,0,0,5v6a1,1,0,0,0,1,1H3a1,1,0,0,0,1-1V8h8V28H9a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V29a1,1,0,0,0-1-1H22V8h8v3a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1Z"></path>`;

const TextBold = createWorkflowIcon('VueWorkflowTextBold', svgAttributes, svgInnerHTML);

export default TextBold;
