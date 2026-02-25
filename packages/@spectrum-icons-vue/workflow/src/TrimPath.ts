import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="20" rx="1" ry="1" width="20" x="12" y="12"></rect><path fill-rule="evenodd" d="M10,10H24V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5V23a1,1,0,0,0,1,1h5Z"></path>`;

const TrimPath = createWorkflowIcon('VueWorkflowTrimPath', svgAttributes, svgInnerHTML);

export default TrimPath;
