import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.191,5.113,1.8,14.478a.5.5,0,0,0-.081.927L9.64,19.358Z"></path><path fill-rule="evenodd" d="M13.089,21.032l11.937,6a1,1,0,0,0,1.343-.446L35.636,6.364Z"></path><path fill-rule="evenodd" d="M10.08,23.25v7.639a.713.713,0,0,0,1.174.544l5.36-4.516Z"></path>`;

const Send = createWorkflowIcon('VueWorkflowSend', svgAttributes, svgInnerHTML);

export default Send;
