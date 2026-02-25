import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,3V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3ZM32,30H4V4H32Z"></path><path fill-rule="evenodd" d="M9.55,15.917a1,1,0,0,1-.679-.266L6.794,13.734a1.0003,1.0003,0,1,1,1.35173-1.47486L8.151,12.264l1.311,1.211,4.28-5.039a1.00158,1.00158,0,0,1,1.52954,1.2935L15.266,9.736l-4.954,5.833a1,1,0,0,1-.7.351Z"></path><path fill-rule="evenodd" d="M9.55,25.917a1,1,0,0,1-.679-.266L6.794,23.734a1.0003,1.0003,0,0,1,1.357-1.47l1.311,1.211,4.28-5.039a1.00158,1.00158,0,0,1,1.52964,1.29339L15.266,19.736l-4.954,5.833a1,1,0,0,1-.7.351Z"></path><rect fill-rule="evenodd" x="18" y="10" width="10" height="4" rx="0.5"></rect><rect fill-rule="evenodd" x="18" y="20" width="10" height="4" rx="0.5"></rect>`;

const TaskList = createWorkflowIcon('VueWorkflowTaskList', svgAttributes, svgInnerHTML);

export default TaskList;
