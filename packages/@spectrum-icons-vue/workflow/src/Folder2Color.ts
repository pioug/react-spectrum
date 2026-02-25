import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,8l-14.331.008-3.3-3.4A2,2,0,0,0,13.929,4H4A2,2,0,0,0,2,6V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V9A1,1,0,0,0,33,8ZM32,28H4V10H32Z"></path><rect opacity="0.50" fill-rule="evenodd" height="18" width="28" x="4" y="10"></rect>`;

const Folder2Color = createWorkflowIcon('VueWorkflowFolder2Color', svgAttributes, svgInnerHTML);

export default Folder2Color;
