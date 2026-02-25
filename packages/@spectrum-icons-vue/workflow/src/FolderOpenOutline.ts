import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M8.69,14H33.225L28.559,28H4ZM13.929,4H4A2,2,0,0,0,2,6V29a1,1,0,0,0,1,1H29.279a1,1,0,0,0,.949-.684l5.333-16A1,1,0,0,0,34.613,12H32V9a1,1,0,0,0-1-1h0l-12.332.007-3.3-3.4A2,2,0,0,0,13.929,4Z"></path>`;

const FolderOpenOutline = createWorkflowIcon('VueWorkflowFolderOpenOutline', svgAttributes, svgInnerHTML);

export default FolderOpenOutline;
