import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,26H12V22h8V20H12V16H28v2h4V3a1,1,0,0,0-1-1H1A1,1,0,0,0,0,3V29a1,1,0,0,0,1,1H20ZM4,6H28v8H4Zm6,20H4V16h6Z"></path><path fill-rule="evenodd" d="M35.394,29.051l-3.837-3.837,4.3-4.363A.5.5,0,0,0,35.5,20H22V33.494a.5.5,0,0,0,.854.358l4.33-4.265,3.837,3.837a1,1,0,0,0,1.414,0l2.96-2.959A1,1,0,0,0,35.394,29.051Z"></path>`;

const ExperienceAddTo = createWorkflowIcon('VueWorkflowExperienceAddTo', svgAttributes, svgInnerHTML);

export default ExperienceAddTo;
