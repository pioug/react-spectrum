import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,22h4V9a1,1,0,0,0-1-1H14v4H24Z"></path><path fill-rule="evenodd" d="M12,24V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V8H3A1,1,0,0,0,2,9v2a1,1,0,0,0,1,1H8V27a1,1,0,0,0,1,1H24v5a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V28h5a1,1,0,0,0,1-1V25a1,1,0,0,0-1-1Z"></path>`;

const Crop = createWorkflowIcon('VueWorkflowCrop', svgAttributes, svgInnerHTML);

export default Crop;
