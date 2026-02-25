import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path opacity="0.2" d="M32,18a13.953,13.953,0,0,0-4.114-9.9L18,18Z"></path><path opacity="0.33" d="M18,18l9.919,9.869A13.956,13.956,0,0,0,32,18Z"></path><path opacity="0.47" d="M18,18V32a13.955,13.955,0,0,0,9.874-4.087Z"></path><path opacity="0.6" d="M18,32V18L8.1,27.889A13.96,13.96,0,0,0,18,32Z"></path><path opacity="0.7" d="M18,18H4a13.959,13.959,0,0,0,4.1,9.889Z"></path><path opacity="0.8" d="M18,18,8.09,8.122A13.953,13.953,0,0,0,4,18Z"></path><path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2Zm0,30A13.991,13.991,0,0,1,8.07,8.144L17.939,18V4c.02,0,.04,0,.061,0a14,14,0,0,1,0,28Z"></path>`;

const ColorWheel = createWorkflowIcon('VueWorkflowColorWheel', svgAttributes, svgInnerHTML);

export default ColorWheel;
