import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14H30V33a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V3A1,1,0,0,1,7,2H18V13A1,1,0,0,0,19,14Zm.5,10h-3a.5.5,0,0,0-.5.5v5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-5A.5.5,0,0,0,19.5,24Zm-6,2h-3a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,13.5,26Zm12-6h-3a.5.5,0,0,0-.5.5v9a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5v-9A.5.5,0,0,0,25.5,20Z"></path>`;

const FileChart = createWorkflowIcon('VueWorkflowFileChart', svgAttributes, svgInnerHTML);

export default FileChart;
