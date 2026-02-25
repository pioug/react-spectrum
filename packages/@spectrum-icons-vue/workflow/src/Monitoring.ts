import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,2H1A1,1,0,0,0,0,3V25a1,1,0,0,0,1,1H14v3a1,1,0,0,1-1,1H11a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V31a1,1,0,0,0-1-1H23a1,1,0,0,1-1-1V26H35a1,1,0,0,0,1-1V3A1,1,0,0,0,35,2ZM32,17.883H24.222a1.378,1.378,0,0,1-1.237-.83l-2.3-5-4.249,8.072a1.368,1.368,0,0,1-1.2.757H15.2a1.383,1.383,0,0,1-1.2-.83l-1.845-4L11.09,17.369a1.337,1.337,0,0,1-1.041.514H4V14H9l2.428-3.609a1.346,1.346,0,0,1,1.217-.5,1.4,1.4,0,0,1,1.061.818l1.61,3.5,4.249-8.072A1.405,1.405,0,0,1,20.8,5.376a1.378,1.378,0,0,1,1.2.829L25.5,14H32Z"></path>`;

const Monitoring = createWorkflowIcon('VueWorkflowMonitoring', svgAttributes, svgInnerHTML);

export default Monitoring;
