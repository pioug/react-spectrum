import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,8H2V5A1,1,0,0,1,3,4H9.586a1,1,0,0,1,.707.293Z"></path><path fill-rule="evenodd" d="M33,10H2V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10ZM12,14.5a.5.5,0,0,1,.5-.5h14a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-14a.5.5,0,0,1-.5-.5ZM8.5,27.75a.75.75,0,0,1-.75.75H6.25a.75.75,0,0,1-.75-.75v-1.5a.75.75,0,0,1,.75-.75h1.5a.75.75,0,0,1,.75.75Zm0-6a.75.75,0,0,1-.75.75H6.25a.75.75,0,0,1-.75-.75v-1.5a.75.75,0,0,1,.75-.75h1.5a.75.75,0,0,1,.75.75Zm0-6a.75.75,0,0,1-.75.75H6.25a.75.75,0,0,1-.75-.75v-1.5a.75.75,0,0,1,.75-.75h1.5a.75.75,0,0,1,.75.75ZM25,27.5a.5.5,0,0,1-.5.5h-12a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h12a.5.5,0,0,1,.5.5Zm6-6a.5.5,0,0,1-.5.5h-18a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h18a.5.5,0,0,1,.5.5Z"></path>`;

const Organize = createWorkflowIcon('VueWorkflowOrganize', svgAttributes, svgInnerHTML);

export default Organize;
