import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM28,19a1,1,0,0,1-1,1H20v7a1,1,0,0,1-1,1H17a1,1,0,0,1-1-1V20H9a1,1,0,0,1-1-1V17a1,1,0,0,1,1-1h7V9a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1v7h7a1,1,0,0,1,1,1Z"></path>`;

const AddCircle = createWorkflowIcon('VueWorkflowAddCircle', svgAttributes, svgInnerHTML);

export default AddCircle;
