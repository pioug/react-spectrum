import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30.5,2H3.5A1.5,1.5,0,0,0,2,3.5V8.463a1.5,1.5,0,0,0,1.5,1.5h27a1.5,1.5,0,0,0,1.5-1.5V3.5A1.5,1.5,0,0,0,30.5,2ZM25,8.764,21.28,4.726a.432.432,0,0,1,.332-.708H28.4a.432.432,0,0,1,.332.708Z"></path><path fill-rule="evenodd" d="M30.5,12H3.5A1.5,1.5,0,0,0,2,13.5v19A1.5,1.5,0,0,0,3.5,34h27A1.5,1.5,0,0,0,32,32.5v-19A1.5,1.5,0,0,0,30.5,12ZM6,15.75A.75.75,0,0,1,6.75,15h20.5a.75.75,0,0,1,.75.75v1.5a.75.75,0,0,1-.75.75H6.75A.75.75,0,0,1,6,17.25Zm22,13.5a.75.75,0,0,1-.75.75H6.75A.75.75,0,0,1,6,29.25v-1.5A.75.75,0,0,1,6.75,27h20.5a.75.75,0,0,1,.75.75Zm-2-6a.75.75,0,0,1-.75.75H6.75A.75.75,0,0,1,6,23.25v-1.5A.75.75,0,0,1,6.75,21h18.5a.75.75,0,0,1,.75.75Z"></path>`;

const Dropdown = createWorkflowIcon('VueWorkflowDropdown', svgAttributes, svgInnerHTML);

export default Dropdown;
