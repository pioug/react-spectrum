import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18.26,10.911l1.993,5.228,5.629.264a.233.233,0,0,1,.136.415l-4.4,3.5L23.107,25.7a.235.235,0,0,1-.356.256L18.04,22.893l-4.711,3.068a.235.235,0,0,1-.356-.256l1.486-5.391-4.4-3.5A.233.233,0,0,1,10.2,16.4l5.629-.264,1.993-5.228A.236.236,0,0,1,18.26,10.911Z"></path><path fill-rule="evenodd" d="M2,28H0v2a2,2,0,0,0,2,2H6V30H2Z"></path><rect fill-rule="evenodd" height="2" width="4" x="6" y="4"></rect><rect fill-rule="evenodd" height="2" width="4" x="8" y="30"></rect><rect fill-rule="evenodd" height="4" width="2" y="10"></rect><path fill-rule="evenodd" d="M2,6H4V4H2A2,2,0,0,0,0,6V8H2Z"></path><rect fill-rule="evenodd" height="4" width="2" y="16"></rect><rect fill-rule="evenodd" height="4" width="2" y="22"></rect><rect fill-rule="evenodd" height="4" width="2" x="34" y="10"></rect><rect fill-rule="evenodd" height="4" width="2" x="34" y="16"></rect><rect fill-rule="evenodd" height="4" width="2" x="34" y="22"></rect><rect fill-rule="evenodd" height="2" width="4" x="14" y="30"></rect><rect fill-rule="evenodd" height="2" width="4" x="12" y="4"></rect><path fill-rule="evenodd" d="M34,4H30V6h4V8h2V6A2,2,0,0,0,34,4Z"></path><rect fill-rule="evenodd" height="2" width="4" x="18" y="4"></rect><path fill-rule="evenodd" d="M34,30H32v2h2a2,2,0,0,0,2-2V28H34Z"></path><rect fill-rule="evenodd" height="2" width="4" x="26" y="30"></rect><rect fill-rule="evenodd" height="2" width="4" x="20" y="30"></rect><rect fill-rule="evenodd" height="2" width="4" x="24" y="4"></rect>`;

const Offer = createWorkflowIcon('VueWorkflowOffer', svgAttributes, svgInnerHTML);

export default Offer;
