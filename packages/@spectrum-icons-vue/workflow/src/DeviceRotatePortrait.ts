import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M36,15.084V8a2,2,0,0,0-2-2H2A2,2,0,0,0,0,8V24a2,2,0,0,0,2,2H14.751a12.219,12.219,0,0,1,.333-2H6V8H30v7.085ZM4,17a1.023,1.023,0,0,1-1,1,1.022,1.022,0,0,1-1-1V15a1.04,1.04,0,0,1,1-1,1.041,1.041,0,0,1,1,1Z"></path><path fill-rule="evenodd" d="M32.375,20.332l1.478-1.479A.49.49,0,0,0,34,18.5a.5.5,0,0,0-.5-.5H28.448a.5.5,0,0,0-.447.447V23.5a.5.5,0,0,0,.5.5.488.488,0,0,0,.349-.148l1.506-1.506a6.018,6.018,0,0,1,2.144,5.6,6.075,6.075,0,1,1-8.123-6.615.976.976,0,0,0,.62-.921V19.155a.76.76,0,0,0-.974-.723,8.919,8.919,0,0,0-6.451,8.552,9.021,9.021,0,0,0,8.645,8.937,8.891,8.891,0,0,0,6.154-15.589Z"></path>`;

const DeviceRotatePortrait = createWorkflowIcon('VueWorkflowDeviceRotatePortrait', svgAttributes, svgInnerHTML);

export default DeviceRotatePortrait;
