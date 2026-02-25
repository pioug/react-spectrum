import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,18v3.287a.75.75,0,0,1-.75.75L16.75,22a.75.75,0,0,1-.75-.75V18H0V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V18Z"></path><path fill-rule="evenodd" d="M35,10H26V6a2,2,0,0,0-2-2H12a2,2,0,0,0-2,2v4H1a1,1,0,0,0-1,1v5H16V14.639a.75.75,0,0,1,.75-.75l2.5.037a.75.75,0,0,1,.75.75V16H36V11A1,1,0,0,0,35,10ZM13,7H23v3H13Z"></path>`;

const Briefcase = createWorkflowIcon('VueWorkflowBriefcase', svgAttributes, svgInnerHTML);

export default Briefcase;
