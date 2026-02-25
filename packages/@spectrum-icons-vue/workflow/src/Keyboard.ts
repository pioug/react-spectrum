import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" y="8"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="8" y="14"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" x="28" y="14"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="8" x="26" y="20"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="6" y="20"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="16" x="8" y="20"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="6" y="8"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="12" y="8"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="18" y="8"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="10" y="14"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="16" y="14"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="22" y="14"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="24" y="8"></rect><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="4" x="30" y="8"></rect>`;

const Keyboard = createWorkflowIcon('VueWorkflowKeyboard', svgAttributes, svgInnerHTML);

export default Keyboard;
