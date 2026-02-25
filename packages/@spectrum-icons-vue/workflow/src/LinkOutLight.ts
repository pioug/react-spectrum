import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,17.5V30H4V4H18.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H3A1,1,0,0,0,2,3V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V17.5a.5.5,0,0,0-.5-.5h-1A.5.5,0,0,0,32,17.5Z"></path><path fill-rule="evenodd" d="M23.54,2.853l3.389,3.39-9.546,9.546a.5.5,0,0,0,0,.707L19.5,18.617a.5.5,0,0,0,.707,0l9.546-9.546,3.389,3.389A.5.5,0,0,0,34,12.107V2H23.893A.5.5,0,0,0,23.54,2.853Z"></path>`;

const LinkOutLight = createWorkflowIcon('VueWorkflowLinkOutLight', svgAttributes, svgInnerHTML);

export default LinkOutLight;
