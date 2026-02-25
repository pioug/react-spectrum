import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="24"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="18"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="30"></rect><path fill-rule="evenodd" d="M2,2.672a.5.5,0,0,1,.866-.341L8,8,2.866,13.669A.5.5,0,0,1,2,13.328Z"></path><path fill-rule="evenodd" d="M33,2H13a1,1,0,0,0-1,1V13a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM32,12H14V4H32Z"></path>`;

const TextSpaceBefore = createWorkflowIcon('VueWorkflowTextSpaceBefore', svgAttributes, svgInnerHTML);

export default TextSpaceBefore;
