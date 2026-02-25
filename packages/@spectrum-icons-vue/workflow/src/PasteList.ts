import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22,6V4a4,4,0,0,0-8,0V6H10v4H26V6ZM20,6H16V4a2,2,0,0,1,4,0Z"></path><path fill-rule="evenodd" d="M31,6H28v5a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V6H5A1,1,0,0,0,4,7V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V7A1,1,0,0,0,31,6ZM12,27a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V25a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm0-8a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V17a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm14,6.5a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Zm0-8a.5.5,0,0,1-.5.5h-9a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Z"></path>`;

const PasteList = createWorkflowIcon('VueWorkflowPasteList', svgAttributes, svgInnerHTML);

export default PasteList;
