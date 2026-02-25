import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,15.5V4H32V30H18.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H33a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V15.5a.5.5,0,0,0,.5.5h1A.5.5,0,0,0,4,15.5Z"></path><path fill-rule="evenodd" d="M5.54,18.853l3.389,3.39L1.383,29.789a.5.5,0,0,0,0,.707L3.5,32.617a.5.5,0,0,0,.707,0l7.546-7.546,3.389,3.389A.5.5,0,0,0,16,28.107V18H5.893A.5.5,0,0,0,5.54,18.853Z"></path>`;

const OpenInLight = createWorkflowIcon('VueWorkflowOpenInLight', svgAttributes, svgInnerHTML);

export default OpenInLight;
