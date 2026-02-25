import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,8H19.414l6.247-6.247a.971.971,0,0,0,0-1.411,1,1,0,0,0-1.416,0L18,6.586,11.776.362a.99.99,0,0,0-1.42-.006.971.971,0,0,0,.006,1.42L16.586,8H1A1,1,0,0,0,0,9V33a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V9A1,1,0,0,0,35,8ZM30,30H4V12H30Zm4-1a1,1,0,0,1-2,0V27a1,1,0,0,1,2,0Z"></path>`;

const DeviceTV = createWorkflowIcon('VueWorkflowDeviceTV', svgAttributes, svgInnerHTML);

export default DeviceTV;
