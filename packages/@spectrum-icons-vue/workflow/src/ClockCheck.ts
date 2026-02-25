import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,16.086V7a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V17.586a1,1,0,0,1-.293.707L12.1,23.9a1,1,0,0,1-1.414,0L9.35,22.565a1,1,0,0,1,0-1.414l4.358-4.358A1,1,0,0,0,14,16.086Z"></path><path fill-rule="evenodd" d="M15.763,31.988A14,14,0,1,1,29.669,15a12.185,12.185,0,0,1,2.143.68A15.992,15.992,0,1,0,16,34c.29,0,.573-.028.86-.044A12.309,12.309,0,0,1,15.763,31.988Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM24.662,32.412l-4.128-4.127a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,32.412Z"></path>`;

const ClockCheck = createWorkflowIcon('VueWorkflowClockCheck', svgAttributes, svgInnerHTML);

export default ClockCheck;
