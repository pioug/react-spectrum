import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,8H2V5A1,1,0,0,1,3,4H9.586a1,1,0,0,1,.707.293Z"></path><path fill-rule="evenodd" d="M33,10H2V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10ZM10,27.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-13a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Zm6,0a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Zm6,0a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Zm6,0a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Z"></path>`;

const Project = createWorkflowIcon('VueWorkflowProject', svgAttributes, svgInnerHTML);

export default Project;
