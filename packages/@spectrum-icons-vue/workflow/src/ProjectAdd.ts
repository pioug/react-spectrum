import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,8H0V5A1,1,0,0,1,1,4H7.586a1,1,0,0,1,.707.293Z"></path><path fill-rule="evenodd" d="M14.7,27.1A12.287,12.287,0,0,1,32,15.869V11a1,1,0,0,0-1-1H0V31a1,1,0,0,0,1,1H15.721A12.251,12.251,0,0,1,14.7,27.1ZM8,27.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-13a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Zm6,0a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const ProjectAdd = createWorkflowIcon('VueWorkflowProjectAdd', svgAttributes, svgInnerHTML);

export default ProjectAdd;
