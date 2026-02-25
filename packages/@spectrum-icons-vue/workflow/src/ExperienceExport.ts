import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30,28H12V24h7.6V22H12V18h7.6V16H4V8H30V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1ZM10,28H4V18h6Z"></path><path fill-rule="evenodd" d="M28,14V10.672a.5.5,0,0,1,.866-.341L36,18l-7.134,7.669A.5.5,0,0,1,28,25.328V22H23a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1Z"></path>`;

const ExperienceExport = createWorkflowIcon('VueWorkflowExperienceExport', svgAttributes, svgInnerHTML);

export default ExperienceExport;
