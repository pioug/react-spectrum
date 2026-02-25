import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8,6A1.914,1.914,0,0,0,6,8V28a2.02,2.02,0,0,0,2,2,2.112,2.112,0,0,1,2,2v3a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V32a2.112,2.112,0,0,1,2-2,2.021,2.021,0,0,0,2-2V16h1a1,1,0,0,0,1-1V13a1,1,0,0,0-1-1H30V8a1.987,1.987,0,0,0-2.083-2A1.947,1.947,0,0,1,26,4V1a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V4A1.875,1.875,0,0,1,8,6Zm18,4V26H10V10Z"></path>`;

const Watch = createWorkflowIcon('VueWorkflowWatch', svgAttributes, svgInnerHTML);

export default Watch;
