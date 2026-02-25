import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.7,27.1c0-.371.023-.737.056-1.1H12V22h3.816a12.311,12.311,0,0,1,1.15-2H12V16h9.728A12.205,12.205,0,0,1,32,15.869V3a1,1,0,0,0-1-1H1A1,1,0,0,0,0,3V29a1,1,0,0,0,1,1H15.059A12.238,12.238,0,0,1,14.7,27.1ZM4,6H28v8H4Zm6,20H4V16h6Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const ExperienceAdd = createWorkflowIcon('VueWorkflowExperienceAdd', svgAttributes, svgInnerHTML);

export default ExperienceAdd;
