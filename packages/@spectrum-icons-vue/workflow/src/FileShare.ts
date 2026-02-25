import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="16 2 16 12 6 12 16 2"></polygon><path fill-rule="evenodd" d="M14,23a3,3,0,0,1,3-3h1.208a3,3,0,0,1,.6-3.008L26,9.016l4,4.427V3a1,1,0,0,0-1-1H18V13a1,1,0,0,1-1,1H6V33a1,1,0,0,0,1,1h7Z"></path><path fill-rule="evenodd" d="M31.722,18.331,26,12l-5.708,6.331A1,1,0,0,0,21.035,20H24v7.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V20h2.979A1,1,0,0,0,31.722,18.331Z"></path><path fill-rule="evenodd" d="M32,22V32H20V22H17a1,1,0,0,0-1,1V35a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V23a1,1,0,0,0-1-1Z"></path>`;

const FileShare = createWorkflowIcon('VueWorkflowFileShare', svgAttributes, svgInnerHTML);

export default FileShare;
