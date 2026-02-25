import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="14" y="4"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="14" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="14" y="28"></rect><path fill-rule="evenodd" d="M10,2V.5A.5.5,0,0,0,9.5,0h-1A.5.5,0,0,0,8,.5V2Z"></path><path fill-rule="evenodd" d="M8,4V9.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V4Z"></path><path fill-rule="evenodd" d="M8,14V12.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V14Z"></path><path fill-rule="evenodd" d="M6,16v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V16Z"></path><path fill-rule="evenodd" d="M12,14V12.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V14Z"></path><path fill-rule="evenodd" d="M10,16v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V16Z"></path><path fill-rule="evenodd" d="M8,26V24.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V26Z"></path><path fill-rule="evenodd" d="M6,28v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V28Z"></path><path fill-rule="evenodd" d="M12,26V24.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V26Z"></path><path fill-rule="evenodd" d="M10,28v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V28Z"></path><path fill-rule="evenodd" d="M4,26V24.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V26Z"></path><path fill-rule="evenodd" d="M2,28v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V28Z"></path>`;

const TextRomanLowercase = createWorkflowIcon('VueWorkflowTextRomanLowercase', svgAttributes, svgInnerHTML);

export default TextRomanLowercase;
