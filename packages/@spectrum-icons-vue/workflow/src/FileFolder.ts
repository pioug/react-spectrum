import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M18,33.5V23a3,3,0,0,1,3-3h4.586a2.982,2.982,0,0,1,2.121.879L30,23.172V14H19a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H18.1A2.385,2.385,0,0,1,18,33.5Z"></path><path fill-rule="evenodd" d="M33.5,34h-13a.5.5,0,0,1-.5-.5V26H33.5a.5.5,0,0,1,.5.5v7A.5.5,0,0,1,33.5,34ZM28,24l-1.707-1.707A1,1,0,0,0,25.586,22H21a1,1,0,0,0-1,1v1Z"></path>`;

const FileFolder = createWorkflowIcon('VueWorkflowFileFolder', svgAttributes, svgInnerHTML);

export default FileFolder;
