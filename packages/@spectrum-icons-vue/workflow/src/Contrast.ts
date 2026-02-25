import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2.1A15.9,15.9,0,1,0,33.9,18,15.9,15.9,0,0,0,18,2.1Zm0,29.813A13.913,13.913,0,1,1,31.913,18,13.912,13.912,0,0,1,18,31.913Z"></path><path fill-rule="evenodd" d="M18,6.2V29.8A11.8,11.8,0,0,0,18,6.2Z"></path>`;

const Contrast = createWorkflowIcon('VueWorkflowContrast', svgAttributes, svgInnerHTML);

export default Contrast;
