import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,6H30V3a1,1,0,0,0-1-1H27a1,1,0,0,0-1,1V6H12V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V6H3A1,1,0,0,0,2,7V33a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V7A1,1,0,0,0,35,6ZM34,32H4V8H8V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8H26V9a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V8h4Z"></path><rect fill-rule="evenodd" height="8" rx="1" ry="1" width="8" x="22" y="20"></rect>`;

const Date = createWorkflowIcon('VueWorkflowDate', svgAttributes, svgInnerHTML);

export default Date;
