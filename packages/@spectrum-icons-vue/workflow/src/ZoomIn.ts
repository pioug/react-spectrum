import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M21.5,14H18V10.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V14H10.5a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5H14v3.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V18h3.5a.5.5,0,0,0,.5-.5v-3A.5.5,0,0,0,21.5,14Z"></path><path fill-rule="evenodd" d="M35.173,32.215,27.256,24.3A14.031,14.031,0,1,0,24.3,27.257l7.916,7.916a2.1,2.1,0,0,0,2.958-2.958ZM6,16A10,10,0,1,1,16,26,10,10,0,0,1,6,16Z"></path>`;

const ZoomIn = createWorkflowIcon('VueWorkflowZoomIn', svgAttributes, svgInnerHTML);

export default ZoomIn;
