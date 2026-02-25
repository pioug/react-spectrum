import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.306,18.66l5.973-5.974a1,1,0,0,0,0-1.414L24.755,2.747a1,1,0,0,0-1.414,0L17.367,8.72a1,1,0,0,0-.286.593l-.468,4.078L2.746,27.257a1,1,0,0,0,0,1.414l4.61,4.61a1,1,0,0,0,1.414,0L22.636,19.414l4.077-.468A1,1,0,0,0,27.306,18.66Zm-10.352.412a2.75,2.75,0,1,1,3.889,0A2.75,2.75,0,0,1,16.954,19.072Z"></path>`;

const Flashlight = createWorkflowIcon('VueWorkflowFlashlight', svgAttributes, svgInnerHTML);

export default Flashlight;
