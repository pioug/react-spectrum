import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.948,30.684,32,20V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5V20L.052,30.684A1.011,1.011,0,0,0,0,31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1A1.011,1.011,0,0,0,35.948,30.684ZM12,30l1.333-4h9.334L24,30ZM30,20H6V6H30Z"></path>`;

const DeviceLaptop = createWorkflowIcon('VueWorkflowDeviceLaptop', svgAttributes, svgInnerHTML);

export default DeviceLaptop;
