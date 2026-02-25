import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,27V21a1,1,0,0,1,1-1H26V15.207a.5.5,0,0,1,.854-.354L36,24l-9.146,9.146A.5.5,0,0,1,26,32.793V28H15A1,1,0,0,1,14,27Z"></path><path fill-rule="evenodd" d="M22,15V9a1,1,0,0,0-1-1H10V3.207a.5.5,0,0,0-.854-.354L0,12l9.146,9.146A.5.5,0,0,0,10,20.793V16H21A1,1,0,0,0,22,15Z"></path>`;

const Sync = createWorkflowIcon('VueWorkflowSync', svgAttributes, svgInnerHTML);

export default Sync;
