import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31.5,6H24V4a2,2,0,0,0-2-2H12a2,2,0,0,0-2,2V6H2.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h2L6.913,33.1a1,1,0,0,0,1,.9H26.092a1,1,0,0,0,1-.9L29.5,8h2a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,31.5,6ZM11.065,29A1,1,0,0,1,10,28.068l-1.071-16a1,1,0,1,1,2-.134l1.071,16A1,1,0,0,1,11.065,29ZM18,28a1,1,0,0,1-2,0V12a1,1,0,0,1,2,0ZM22,6H12V4H22Zm2,22.068A1,1,0,1,1,22,27.934l1.071-16a1,1,0,1,1,2,.134Z"></path>`;

const Delete = createWorkflowIcon('VueWorkflowDelete', svgAttributes, svgInnerHTML);

export default Delete;
