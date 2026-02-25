import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,14V9a1,1,0,0,0-1-1h0l-12.332.008-3.3-3.4A2,2,0,0,0,11.929,4H4A2,2,0,0,0,2,6V29a1,1,0,0,0,1,1H29.307a1,1,0,0,0,.936-.649l5.25-14A1,1,0,0,0,34.557,14ZM4,6h7.929l3.305,3.4.59.607h.845L28,10v4H8.693a1,1,0,0,0-.936.649L4,24.667Z"></path>`;

const FolderOpen = createWorkflowIcon('VueWorkflowFolderOpen', svgAttributes, svgInnerHTML);

export default FolderOpen;
