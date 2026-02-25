import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect opacity="0.9" height="24" width="2" x="4" y="6"></rect><rect opacity="0.8" height="24" width="2" x="6" y="6"></rect><rect opacity="0.7" height="24" width="2" x="8" y="6"></rect><rect opacity="0.6" height="24" width="2" x="10" y="6"></rect><rect opacity="0.5" height="24" width="2" x="12" y="6"></rect><rect opacity="0.4" height="24" width="2" x="14" y="6"></rect><rect opacity="0.25" height="24" width="2" x="20" y="6"></rect><rect opacity="0.3" height="24" width="2" x="18" y="6"></rect><rect opacity="0.35" height="24" width="2" x="16" y="6"></rect><rect opacity="0.2" height="24" width="2" x="22" y="6"></rect><rect opacity="0.15" height="24" width="2" x="24" y="6"></rect><rect opacity="0.1" height="24" width="2" x="26" y="6"></rect><rect opacity="0.05" height="24" width="2" x="28" y="6"></rect><path fill-rule="evenodd" d="M2,5V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5ZM32,30H4V6H32Z"></path>`;

const Gradient = createWorkflowIcon('VueWorkflowGradient', svgAttributes, svgInnerHTML);

export default Gradient;
