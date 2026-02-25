import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" rx="1" ry="1" width="36" y="4"></rect><path fill-rule="evenodd" d="M2,12V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V12ZM23,24H13a1,1,0,0,1-1-1V19a1,1,0,0,1,1-1H23a1,1,0,0,1,1,1v4A1,1,0,0,1,23,24Z"></path>`;

const Archive = createWorkflowIcon('VueWorkflowArchive', svgAttributes, svgInnerHTML);

export default Archive;
