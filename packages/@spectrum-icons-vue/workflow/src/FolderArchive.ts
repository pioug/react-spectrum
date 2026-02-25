import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,23.828A3,3,0,0,1,12,21V19a3,3,0,0,1,3-3H34V11a1,1,0,0,0-1-1H2V31a1,1,0,0,0,1,1H14Z"></path><path fill-rule="evenodd" d="M35,22H15a1,1,0,0,1-1-1V19a1,1,0,0,1,1-1H35a1,1,0,0,1,1,1v2A1,1,0,0,1,35,22Zm-1,2V35a1,1,0,0,1-1,1H17a1,1,0,0,1-1-1V24Zm-6,6V29a1,1,0,0,0-1-1H23a1,1,0,0,0-1,1v1a1,1,0,0,0,1,1h4A1,1,0,0,0,28,30Z"></path><path fill-rule="evenodd" d="M16,6H2V3.5A1.5,1.5,0,0,1,3.5,2h7.672a2,2,0,0,1,1.414.586Z"></path>`;

const FolderArchive = createWorkflowIcon('VueWorkflowFolderArchive', svgAttributes, svgInnerHTML);

export default FolderArchive;
