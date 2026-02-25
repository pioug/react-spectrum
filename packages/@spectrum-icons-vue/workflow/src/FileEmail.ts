import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M16,23a1,1,0,0,1,1-1H30V14H19a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1h9Z"></path><path fill-rule="evenodd" d="M28.208,32.25,36,26.584V35a1,1,0,0,1-1,1H19a1,1,0,0,1-1-1V26.584l7.792,5.667A2.054,2.054,0,0,0,28.208,32.25ZM27,30.347,36,24H18Z"></path>`;

const FileEmail = createWorkflowIcon('VueWorkflowFileEmail', svgAttributes, svgInnerHTML);

export default FileEmail;
