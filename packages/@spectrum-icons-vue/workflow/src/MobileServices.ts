import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34,4H2A2,2,0,0,0,0,6V30a2,2,0,0,0,2,2H34a2,2,0,0,0,2-2V6A2,2,0,0,0,34,4ZM30,28H4V8H30Zm3-7.5A2.5,2.5,0,1,1,35.5,18,2.5,2.5,0,0,1,33,20.5Z"></path><path fill-rule="evenodd" d="M7.019,25.686a1.249,1.249,0,0,1-.707-.383,1.13,1.13,0,0,1,.094-1.647l4.252-3.668a.631.631,0,0,1,.854.041l2.357,2.4,4.667-7.27a.625.625,0,0,1,1.055.035l2.147,3.712,3.95-8.015a1.233,1.233,0,0,1,1.638-.5,1.159,1.159,0,0,1,.545,1.575L22.364,22.889a.623.623,0,0,1-1.083.016L18.99,18.946l-4.276,6.661a.625.625,0,0,1-.963.085l-2.786-2.837L8.035,25.42A1.246,1.246,0,0,1,7.019,25.686Z"></path>`;

const MobileServices = createWorkflowIcon('VueWorkflowMobileServices', svgAttributes, svgInnerHTML);

export default MobileServices;
