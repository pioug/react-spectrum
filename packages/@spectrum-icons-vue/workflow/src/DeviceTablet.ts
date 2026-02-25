import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M34,4H2A2,2,0,0,0,0,6V30a2,2,0,0,0,2,2H34a2,2,0,0,0,2-2V6A2,2,0,0,0,34,4ZM30,28H4V8H30Zm3-7.5A2.5,2.5,0,1,1,35.5,18,2.5,2.5,0,0,1,33,20.5Z"></path>`;

const DeviceTablet = createWorkflowIcon('VueWorkflowDeviceTablet', svgAttributes, svgInnerHTML);

export default DeviceTablet;
