import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26,0H10A2,2,0,0,0,8,2V34a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V2A2,2,0,0,0,26,0ZM17,2h2a1.041,1.041,0,0,1,1,1,1.04,1.04,0,0,1-1,1H17a1.023,1.023,0,0,1-1-1A1.024,1.024,0,0,1,17,2Zm1,33.1A2.1,2.1,0,1,1,20.1,33,2.1,2.1,0,0,1,18,35.1ZM26,30H10V6H26Z" transform="translate(0 0)"></path>`;

const DevicePhone = createWorkflowIcon('VueWorkflowDevicePhone', svgAttributes, svgInnerHTML);

export default DevicePhone;
