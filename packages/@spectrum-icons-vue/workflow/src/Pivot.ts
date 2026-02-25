import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,26V12a6,6,0,0,0-6-6H10V1.207A.5.5,0,0,0,9.146.854L0,10l9.146,9.146A.5.5,0,0,0,10,18.793V14H22V26H17.207a.5.5,0,0,0-.354.854L26,36l9.146-9.146A.5.5,0,0,0,34.793,26Z"></path>`;

const Pivot = createWorkflowIcon('VueWorkflowPivot', svgAttributes, svgInnerHTML);

export default Pivot;
