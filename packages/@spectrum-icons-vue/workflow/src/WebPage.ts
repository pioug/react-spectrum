import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,5V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5ZM32,30H4V10H32Z"></path>`;

const WebPage = createWorkflowIcon('VueWorkflowWebPage', svgAttributes, svgInnerHTML);

export default WebPage;
