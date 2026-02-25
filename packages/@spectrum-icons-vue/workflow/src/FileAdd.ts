import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="16 2 16 12 6 12 16 2"></polygon><path fill-rule="evenodd" d="M14.7,27A12.309,12.309,0,0,1,30,15.069V3a1,1,0,0,0-1-1H18V13a1,1,0,0,1-1,1H6V33a1,1,0,0,0,1,1h9.886A12.241,12.241,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const FileAdd = createWorkflowIcon('VueWorkflowFileAdd', svgAttributes, svgInnerHTML);

export default FileAdd;
