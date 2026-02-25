import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="32" x="2" y="26"></rect><path fill-rule="evenodd" d="M2.5,20h10.75A.8.8,0,0,0,14,19.2a.784.784,0,0,0-.235-.56L9.81,14.681l.692-.693a11.447,11.447,0,0,1,19.116,5.074A1.215,1.215,0,0,0,30.78,20h1.894a1,1,0,0,0,.991-1.17A15.43,15.43,0,0,0,14.621,7.165,16.181,16.181,0,0,0,7.337,11.5l-.356.357L3.364,8.236A.781.781,0,0,0,2.8,8a.8.8,0,0,0-.8.754V19.5A.5.5,0,0,0,2.5,20Z"></path>`;

const Revert = createWorkflowIcon('VueWorkflowRevert', svgAttributes, svgInnerHTML);

export default Revert;
