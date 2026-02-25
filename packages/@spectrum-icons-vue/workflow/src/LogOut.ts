import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="18" rx="1" ry="1" width="4" x="16"></rect><path fill-rule="evenodd" d="M25.215,5.063l-1.14,1.823a1.01,1.01,0,0,0,.337,1.384,11.738,11.738,0,1,1-12.82,0,1,1,0,0,0,.336-1.377L10.784,5.062A1,1,0,0,0,9.4,4.731a15.9,15.9,0,1,0,17.191,0A1,1,0,0,0,25.215,5.063Z"></path>`;

const LogOut = createWorkflowIcon('VueWorkflowLogOut', svgAttributes, svgInnerHTML);

export default LogOut;
