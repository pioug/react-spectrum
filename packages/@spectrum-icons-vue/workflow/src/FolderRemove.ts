import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,6H2V3.5A1.5,1.5,0,0,1,3.5,2h7.672a2,2,0,0,1,1.414.586Z"></path><path fill-rule="evenodd" d="M14.7,27A12.3,12.3,0,0,1,34,16.886V9a1,1,0,0,0-1-1H2V29a1,1,0,0,0,1,1H15.069A12.3,12.3,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27.1,18.2A8.9,8.9,0,1,0,36,27.1,8.9,8.9,0,0,0,27.1,18.2Zm5.826,12.267a.5.5,0,0,1,0,.707l-1.752,1.752a.5.5,0,0,1-.707,0L27.1,29.559l-3.367,3.367a.5.5,0,0,1-.707,0l-1.752-1.752a.5.5,0,0,1,0-.707L24.641,27.1l-3.367-3.367a.5.5,0,0,1,0-.707l1.752-1.752a.5.5,0,0,1,.707,0L27.1,24.641l3.367-3.367a.5.5,0,0,1,.707,0l1.752,1.752a.5.5,0,0,1,0,.707L29.559,27.1Z"></path>`;

const FolderRemove = createWorkflowIcon('VueWorkflowFolderRemove', svgAttributes, svgInnerHTML);

export default FolderRemove;
