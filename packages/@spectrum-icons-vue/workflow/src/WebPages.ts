import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,9V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1H7A1,1,0,0,0,6,9ZM32,32H8V14H32Z"></path><path fill-rule="evenodd" d="M4,6H30V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V27a1,1,0,0,0,1,1H4Z"></path><path fill-rule="evenodd" d="M6,9V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1H7A1,1,0,0,0,6,9ZM32,32H8V14H32Z"></path><path fill-rule="evenodd" d="M4,6H30V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V27a1,1,0,0,0,1,1H4Z"></path>`;

const WebPages = createWorkflowIcon('VueWorkflowWebPages', svgAttributes, svgInnerHTML);

export default WebPages;
