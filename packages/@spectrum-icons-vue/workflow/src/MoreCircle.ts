import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2A16,16,0,1,0,34,18,16,16,0,0,0,18,2ZM9.02,21.391A3.391,3.391,0,1,1,12.411,18,3.391,3.391,0,0,1,9.02,21.391Zm8.981,0A3.391,3.391,0,1,1,21.391,18,3.392,3.392,0,0,1,18,21.391Zm8.822,0A3.391,3.391,0,1,1,30.214,18,3.391,3.391,0,0,1,26.823,21.391Z"></path>`;

const MoreCircle = createWorkflowIcon('VueWorkflowMoreCircle', svgAttributes, svgInnerHTML);

export default MoreCircle;
