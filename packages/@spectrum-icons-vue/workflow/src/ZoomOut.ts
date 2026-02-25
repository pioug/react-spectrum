import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="0.5" ry="0.5" width="12" x="10" y="14"></rect><path fill-rule="evenodd" d="M35.173,32.215,27.256,24.3A14.031,14.031,0,1,0,24.3,27.257l7.916,7.916a2.1,2.1,0,0,0,2.958-2.958ZM6,16A10,10,0,1,1,16,26,10,10,0,0,1,6,16Z"></path>`;

const ZoomOut = createWorkflowIcon('VueWorkflowZoomOut', svgAttributes, svgInnerHTML);

export default ZoomOut;
