import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="12" width="12" x="12" y="12"></rect><path fill-rule="evenodd" d="M10,10H24V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5V23a1,1,0,0,0,1,1h5Z"></path><path fill-rule="evenodd" d="M31,12H26V26H12v5a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V13A1,1,0,0,0,31,12Z"></path>`;

const DividePath = createWorkflowIcon('VueWorkflowDividePath', svgAttributes, svgInnerHTML);

export default DividePath;
