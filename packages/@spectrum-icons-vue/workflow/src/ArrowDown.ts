import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,20V3a1,1,0,0,0-1-1H13a1,1,0,0,0-1,1V20H5.007a.5.5,0,0,0-.353.854L18,34.2,31.346,20.854A.5.5,0,0,0,30.993,20Z"></path>`;

const ArrowDown = createWorkflowIcon('VueWorkflowArrowDown', svgAttributes, svgInnerHTML);

export default ArrowDown;
