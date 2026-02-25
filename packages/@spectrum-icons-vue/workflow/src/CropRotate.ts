import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23,21h3V10.5a.5.5,0,0,0-.5-.5H16v3h7Z"></path><path fill-rule="evenodd" d="M28.5,23H13V6.5a.5.5,0,0,0-.5-.5h-2a.5.5,0,0,0-.5.5V10H6.5a.5.5,0,0,0-.5.5v2a.5.5,0,0,0,.5.5H10V25.5a.5.5,0,0,0,.5.5H23v3.5a.5.5,0,0,0,.5.5h2a.5.5,0,0,0,.5-.5V26h2.5a.5.5,0,0,0,.5-.5v-2A.5.5,0,0,0,28.5,23Z"></path><path fill-rule="evenodd" d="M28.264,3l-.23,0V.5a.5.5,0,0,0-.5-.5.493.493,0,0,0-.35.147L23.147,3.684a.5.5,0,0,0,0,.632l4.034,3.537a.493.493,0,0,0,.35.147.5.5,0,0,0,.5-.5V4.958l.23,0a3.786,3.786,0,0,1,3.781,3.892v.827a.325.325,0,0,0,.326.326h1.3A.326.326,0,0,0,34,9.674V8.847A5.74,5.74,0,0,0,28.264,3Z"></path><path fill-rule="evenodd" d="M8.819,28.147A.493.493,0,0,0,8.469,28a.5.5,0,0,0-.5.5v2.541l-.23,0a3.786,3.786,0,0,1-3.781-3.892v-.827A.325.325,0,0,0,3.629,26h-1.3A.326.326,0,0,0,2,26.326v.827A5.74,5.74,0,0,0,7.736,33l.23,0v2.5a.5.5,0,0,0,.5.5.493.493,0,0,0,.35-.147l4.034-3.537a.5.5,0,0,0,0-.632Z"></path>`;

const CropRotate = createWorkflowIcon('VueWorkflowCropRotate', svgAttributes, svgInnerHTML);

export default CropRotate;
