import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="12" y="11.99996"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="6" y="6"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="6" y="18"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="18" y="17.99996"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="24" y="12"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="18" y="6"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="12" y="24"></rect><rect opacity="0.50" fill-rule="evenodd" height="6" width="6" x="24" y="24"></rect><path fill-rule="evenodd" d="M31,4H5A1,1,0,0,0,4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V5A1,1,0,0,0,31,4ZM30,30H6V6H30Z"></path>`;

const Transparency = createWorkflowIcon('VueWorkflowTransparency', svgAttributes, svgInnerHTML);

export default Transparency;
