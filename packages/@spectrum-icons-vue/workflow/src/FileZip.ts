import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H14V17.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1h5V30.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V34H29a1,1,0,0,0,1-1V14ZM18,27a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V17a1,1,0,0,1,1-1h1v4h6V16h1a1,1,0,0,1,1,1Z"></path><circle fill-rule="evenodd" cx="13" cy="24" r="2.186"></circle>`;

const FileZip = createWorkflowIcon('VueWorkflowFileZip', svgAttributes, svgInnerHTML);

export default FileZip;
