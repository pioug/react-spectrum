import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14ZM14,29a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V25a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1Zm0-8a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V17a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1Zm0-8a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V9A1,1,0,0,1,9,8h4a1,1,0,0,1,1,1Z"></path>`;

const FileTemplate = createWorkflowIcon('VueWorkflowFileTemplate', svgAttributes, svgInnerHTML);

export default FileTemplate;
