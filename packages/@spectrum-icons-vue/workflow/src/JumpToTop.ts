import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22,22V33a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V22H5.007a.5.5,0,0,1-.354-.854L17,9,29.346,21.146a.5.5,0,0,1-.354.854Z"></path><rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="34" y="2"></rect>`;

const JumpToTop = createWorkflowIcon('VueWorkflowJumpToTop', svgAttributes, svgInnerHTML);

export default JumpToTop;
