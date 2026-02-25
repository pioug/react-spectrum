import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M13.4,4c-4.5,0-8.919,3.623-9.354,8.105A9.009,9.009,0,0,0,13,22c1.05,0,3-.075,3-.075V33.5a.5.5,0,0,0,.5.5h2a.5.5,0,0,0,.5-.5V7h6V33.5a.5.5,0,0,0,.5.5h2a.5.5,0,0,0,.5-.5V5a1,1,0,0,0-1-1Z"></path>`;

const TextParagraph = createWorkflowIcon('VueWorkflowTextParagraph', svgAttributes, svgInnerHTML);

export default TextParagraph;
