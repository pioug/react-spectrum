import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.313,6.686A16,16,0,1,0,11.958,32.818L16.9,20H11L15,8h9l-5,8h7L12.473,33A15.991,15.991,0,0,0,29.313,6.686Z"></path>`;

const EmailLightning = createWorkflowIcon('VueWorkflowEmailLightning', svgAttributes, svgInnerHTML);

export default EmailLightning;
