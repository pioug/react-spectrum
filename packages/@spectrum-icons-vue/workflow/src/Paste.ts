import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28,6v5a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V6H5A1,1,0,0,0,4,7V33a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V7a1,1,0,0,0-1-1Z"></path><path fill-rule="evenodd" d="M22,6V4a4,4,0,0,0-8,0V6H10v4H26V6ZM20,6H16V4a2,2,0,0,1,4,0Z"></path>`;

const Paste = createWorkflowIcon('VueWorkflowPaste', svgAttributes, svgInnerHTML);

export default Paste;
