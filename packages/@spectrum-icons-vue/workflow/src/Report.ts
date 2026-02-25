import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,4H9A1,1,0,0,0,8,5V31a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1V5A1,1,0,0,0,27,4ZM16,10.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v7a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5Zm-6,4a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5Zm12,15a.5.5,0,0,1-.5.5h-11a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h11a.5.5,0,0,1,.5.5Zm4-6a.5.5,0,0,1-.5.5h-15a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h15a.5.5,0,0,1,.5.5Zm0-6a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5V6.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Z"></path>`;

const Report = createWorkflowIcon('VueWorkflowReport', svgAttributes, svgInnerHTML);

export default Report;
