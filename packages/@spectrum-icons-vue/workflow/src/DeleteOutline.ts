import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.491,8,25.183,32H8.817L6.509,8ZM22,2H12a2,2,0,0,0-2,2V6H2.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h2L6.913,33.1a1,1,0,0,0,1,.9H26.092a1,1,0,0,0,1-.9L29.5,8h2a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H24V4A2,2,0,0,0,22,2ZM12,6V4H22V6Z"></path><path fill-rule="evenodd" d="M17,29a1,1,0,0,1-1-1V12a1,1,0,0,1,2,0V28A1,1,0,0,1,17,29Z"></path><path fill-rule="evenodd" d="M20.934,29A1,1,0,0,1,20,27.933l1.071-15.995a1,1,0,1,1,2,.134L22,28.068A1,1,0,0,1,20.934,29Z"></path><path fill-rule="evenodd" d="M13.066,29A1,1,0,0,0,14,27.933L12.925,11.938a1,1,0,1,0-2,.134l1.071,16A1,1,0,0,0,13.066,29Z"></path>`;

const DeleteOutline = createWorkflowIcon('VueWorkflowDeleteOutline', svgAttributes, svgInnerHTML);

export default DeleteOutline;
