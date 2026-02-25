import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16,33a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V24H16Z"></path><path fill-rule="evenodd" d="M29.572,11.143a6.449,6.449,0,0,0-.726.041A8.144,8.144,0,1,0,12.924,7.948a6.862,6.862,0,0,0-8.407,8.394A3.857,3.857,0,1,0,3.857,24H16V18H11.7a.7.7,0,0,1-.7-.7.685.685,0,0,1,.207-.49l6.468-5.685a.5.5,0,0,1,.65,0l6.468,5.685A.685.685,0,0,1,25,17.3a.7.7,0,0,1-.7.7H20v6h9.572a6.429,6.429,0,0,0,0-12.857Z"></path>`;

const UploadToCloud = createWorkflowIcon('VueWorkflowUploadToCloud', svgAttributes, svgInnerHTML);

export default UploadToCloud;
