import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="8" y="28"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="12" x="20" y="20"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="12" x="20" y="12"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="8" y="4"></rect><path fill-rule="evenodd" d="M8,14V10.672a.5.5,0,0,1,.866-.341L16,18,8.866,25.669A.5.5,0,0,1,8,25.328V22H1a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1Z"></path>`;

const TextIndentIncrease = createWorkflowIcon('VueWorkflowTextIndentIncrease', svgAttributes, svgInnerHTML);

export default TextIndentIncrease;
