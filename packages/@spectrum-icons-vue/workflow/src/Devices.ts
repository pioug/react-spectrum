import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,22H6V6H34V4a2,2,0,0,0-2-2H2A2,2,0,0,0,0,4V24a2,2,0,0,0,2,2H18ZM3,16.5A2.5,2.5,0,1,1,5.5,14,2.5,2.5,0,0,1,3,16.5Z"></path><path fill-rule="evenodd" d="M34,8H22a2,2,0,0,0-2,2V34a2,2,0,0,0,2,2H34a2,2,0,0,0,2-2V10A2,2,0,0,0,34,8Zm-7,2h2a1,1,0,0,1,0,2H27a1,1,0,0,1,0-2Zm1,25.1A2.1,2.1,0,1,1,30.1,33,2.1,2.1,0,0,1,28,35.1ZM34,30H22V14H34Z"></path>`;

const Devices = createWorkflowIcon('VueWorkflowDevices', svgAttributes, svgInnerHTML);

export default Devices;
