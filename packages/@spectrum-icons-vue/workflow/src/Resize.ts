import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,4H5A1,1,0,0,0,4,5V31a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V5A1,1,0,0,0,31,4ZM18,20.828l4.414-4.414,2.732,2.732A.5.5,0,0,0,26,18.793V10H17.207a.5.5,0,0,0-.354.854l2.732,2.732L15.172,18H8V8H28V28H18Z"></path>`;

const Resize = createWorkflowIcon('VueWorkflowResize', svgAttributes, svgInnerHTML);

export default Resize;
