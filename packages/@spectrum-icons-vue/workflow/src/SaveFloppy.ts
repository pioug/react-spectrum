import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="4" x="20" y="4"></rect><path fill-rule="evenodd" d="M31.708,8.293s-4.015-4-4.146-4.114A.969.969,0,0,0,27,4H26v8H14V4H5A1,1,0,0,0,4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V9A1,1,0,0,0,31.708,8.293ZM26,30H10V16H26Z"></path>`;

const SaveFloppy = createWorkflowIcon('VueWorkflowSaveFloppy', svgAttributes, svgInnerHTML);

export default SaveFloppy;
