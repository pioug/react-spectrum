import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M36,18,26.854,8.854A.5.5,0,0,0,26,9.207V14H10V9.207a.5.5,0,0,0-.854-.354L0,18l9.146,9.146A.5.5,0,0,0,10,26.793V22H26v4.793a.5.5,0,0,0,.854.354Z"></path>`;

const Switch = createWorkflowIcon('VueWorkflowSwitch', svgAttributes, svgInnerHTML);

export default Switch;
