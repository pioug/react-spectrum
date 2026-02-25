import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,14V10.672a.5.5,0,0,1,.866-.341L14,18,6.866,25.669A.5.5,0,0,1,6,25.328V22H1a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1Z"></path><path fill-rule="evenodd" d="M35,4H5A1,1,0,0,0,4,5V8H32v8H16V28H4v3a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V5A1,1,0,0,0,35,4ZM32,28H18V24H32Zm0-6H18V18H32Z"></path>`;

const ExperienceImport = createWorkflowIcon('VueWorkflowExperienceImport', svgAttributes, svgInnerHTML);

export default ExperienceImport;
