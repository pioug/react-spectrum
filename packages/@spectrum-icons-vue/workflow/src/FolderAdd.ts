import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,16a10.95,10.95,0,0,1,7,2.522V9a1,1,0,0,0-1-1h0l-14.332.008-3.3-3.4A2,2,0,0,0,13.929,4H4A2,2,0,0,0,2,6V29a1,1,0,0,0,1,1H16.427A10.969,10.969,0,0,1,27,16ZM4,6h9.929l3.887,4H4Z"></path><path fill-rule="evenodd" d="M27,18a9,9,0,1,0,9,9A9,9,0,0,0,27,18Zm5.4,10a.5.5,0,0,1-.5.5H28.5v3.4a.5.5,0,0,1-.5.5H26a.5.5,0,0,1-.5-.5V28.5H22.1a.5.5,0,0,1-.5-.5V26a.5.5,0,0,1,.5-.5h3.4V22.1a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v3.4h3.4a.5.5,0,0,1,.5.5Z"></path>`;

const FolderAdd = createWorkflowIcon('VueWorkflowFolderAdd', svgAttributes, svgInnerHTML);

export default FolderAdd;
