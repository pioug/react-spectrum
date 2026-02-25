import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3ZM32,32H4V4H32Z"></path><path fill-rule="evenodd" d="M6,7v8a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V7a1,1,0,0,0-1-1H7A1,1,0,0,0,6,7Z"></path><path fill-rule="evenodd" d="M19.987,13v8a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V13a1,1,0,0,0-1-1h-8A1,1,0,0,0,19.987,13Z"></path><path fill-rule="evenodd" d="M8,21v8a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V21a1,1,0,0,0-1-1H9A1,1,0,0,0,8,21Z"></path>`;

const Group = createWorkflowIcon('VueWorkflowGroup', svgAttributes, svgInnerHTML);

export default Group;
