import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.7,27A12.293,12.293,0,0,1,34,16.893V9a1,1,0,0,0-1-1H2V29a1,1,0,0,0,1,1H15.084A12.251,12.251,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M16,6H2V3.5A1.5,1.5,0,0,1,3.5,2h7.672a2,2,0,0,1,1.414.586Z"></path>`;

const FolderDelete = createWorkflowIcon('VueWorkflowFolderDelete', svgAttributes, svgInnerHTML);

export default FolderDelete;
