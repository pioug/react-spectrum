import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23.8,7.2a6.8,6.8,0,0,0-13.6,0V20.8a6.8,6.8,0,1,0,13.6,0Z"></path><path fill-rule="evenodd" d="M28,21V16.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V21A9,9,0,1,1,8,21V16.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V21c0,5.725,5.357,11,10,11v2H8.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h17a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H18V31.942C22.643,31.942,28,26.726,28,21Z"></path>`;

const VoiceOver = createWorkflowIcon('VueWorkflowVoiceOver', svgAttributes, svgInnerHTML);

export default VoiceOver;
