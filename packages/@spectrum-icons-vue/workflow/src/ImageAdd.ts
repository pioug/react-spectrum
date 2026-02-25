import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="23.8" cy="12.6" r="2.5"></circle><path fill-rule="evenodd" d="M14.7,27a12.227,12.227,0,0,1,1.262-5.4C13.854,19.242,11.657,16,9.785,16,7.113,16,2,24,2,24V6H34V16.893a12.366,12.366,0,0,1,2,1.743V5a1.068,1.068,0,0,0-1.125-1H1.125A1.068,1.068,0,0,0,0,5V31a1.068,1.068,0,0,0,1.125,1H15.769A12.24,12.24,0,0,1,14.7,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const ImageAdd = createWorkflowIcon('VueWorkflowImageAdd', svgAttributes, svgInnerHTML);

export default ImageAdd;
