import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.454,8,5.084,23.372a.992.992,0,0,0-.251.421L2.055,33.1c-.114.376.459.85.783.85a.311.311,0,0,0,.062-.006c.276-.064,7.867-2.344,9.311-2.778a.984.984,0,0,0,.415-.25L28,15.544ZM11.4,29.316c-2.161.649-4.862,1.465-6.729,2.022l2.009-6.73Z"></path><path fill-rule="evenodd" d="M33.567,8.2,27.8,2.432a1.215,1.215,0,0,0-.866-.353H26.9a1.372,1.372,0,0,0-.927.407l-4.1,4.1,7.543,7.543,4.1-4.1a1.372,1.372,0,0,0,.4-.883A1.224,1.224,0,0,0,33.567,8.2Z"></path>`;

const Draw = createWorkflowIcon('VueWorkflowDraw', svgAttributes, svgInnerHTML);

export default Draw;
