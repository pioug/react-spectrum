import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM28,19a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V17a1,1,0,0,1,1-1H27a1,1,0,0,1,1,1Z"></path>`;

const RemoveCircle = createWorkflowIcon('VueWorkflowRemoveCircle', svgAttributes, svgInnerHTML);

export default RemoveCircle;
