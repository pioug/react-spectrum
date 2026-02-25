import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,4H5A1,1,0,0,0,4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V5A1,1,0,0,0,31,4ZM30,30H6V6H30Z"></path><path fill-rule="evenodd" d="M28,15.632V8H20.368A10.283,10.283,0,0,1,28,15.632Z"></path><path fill-rule="evenodd" d="M15.632,8H8v7.632A10.283,10.283,0,0,1,15.632,8Z"></path><path fill-rule="evenodd" d="M8,20.368V28h7.632A10.283,10.283,0,0,1,8,20.368Z"></path><path fill-rule="evenodd" d="M20.368,28H28V20.368A10.283,10.283,0,0,1,20.368,28Z"></path>`;

const Vignette = createWorkflowIcon('VueWorkflowVignette', svgAttributes, svgInnerHTML);

export default Vignette;
