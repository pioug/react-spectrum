import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,2H1A1,1,0,0,0,0,3V27a1,1,0,0,0,1,1H14v3a1,1,0,0,1-1,1H11a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V33a1,1,0,0,0-1-1H23a1,1,0,0,1-1-1V28H35a1,1,0,0,0,1-1V3A1,1,0,0,0,35,2ZM32,24H4V6H32Z"></path>`;

const DeviceDesktop = createWorkflowIcon('VueWorkflowDeviceDesktop', svgAttributes, svgInnerHTML);

export default DeviceDesktop;
