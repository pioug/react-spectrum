import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23.517,6.311A1,1,0,0,1,22.8,8H20v6H14V8H11.222A1.006,1.006,0,0,1,10.5,6.293L17,0Z"></path><path fill-rule="evenodd" d="M23.5,29.707A1.006,1.006,0,0,0,22.778,28H20V22H14v6H11.2a1,1,0,0,0-.715,1.689L17,36Z"></path><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="30" x="2" y="16"></rect>`;

const MoveUpDown = createWorkflowIcon('VueWorkflowMoveUpDown', svgAttributes, svgInnerHTML);

export default MoveUpDown;
