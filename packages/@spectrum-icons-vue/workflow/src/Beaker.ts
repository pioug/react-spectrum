import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.072,31.759,24,14V4h1a1,1,0,0,0,1-1V1a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V3a1,1,0,0,0,1,1h1V14L2.928,31.759A3,3,0,0,0,5.659,36H30.341A3,3,0,0,0,33.072,31.759ZM8.727,24.364,14,14.454V4h8V14.455l2.636,4.909Z"></path>`;

const Beaker = createWorkflowIcon('VueWorkflowBeaker', svgAttributes, svgInnerHTML);

export default Beaker;
