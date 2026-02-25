import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM24.662,32.412l-4.128-4.128a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,32.412Z"></path><path fill-rule="evenodd" d="M14.7,27a12.229,12.229,0,0,1,1.34-5.563L6.728,24.364,12,14.453V4h8V14.454l.98,1.825a12.231,12.231,0,0,1,1.77-.81L22,14V4h1a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H9A1,1,0,0,0,8,1V3A1,1,0,0,0,9,4h1V14L.928,31.759A3,3,0,0,0,3.659,36H18.636A12.252,12.252,0,0,1,14.7,27Z"></path>`;

const BeakerCheck = createWorkflowIcon('VueWorkflowBeakerCheck', svgAttributes, svgInnerHTML);

export default BeakerCheck;
