import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="3" rx="1" ry="1" width="16" x="10" y="30"></rect><rect fill-rule="evenodd" height="3" rx="1" ry="1" width="16" x="10" y="8"></rect><rect fill-rule="evenodd" height="3" rx="1" ry="1" width="16" x="10" y="14"></rect><path fill-rule="evenodd" d="M30.5,2H5.5A1.5,1.5,0,0,0,4,3.5V34H6V26H30v8h2V3.5A1.5,1.5,0,0,0,30.5,2ZM30,22H6V4H30Z"></path>`;

const Panel = createWorkflowIcon('VueWorkflowPanel', svgAttributes, svgInnerHTML);

export default Panel;
