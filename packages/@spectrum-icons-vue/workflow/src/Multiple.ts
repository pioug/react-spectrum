import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31,4H21a1,1,0,0,0-1,1v5h4a2,2,0,0,1,2,2v4h5a1,1,0,0,0,1-1V5A1,1,0,0,0,31,4Z"></path><rect fill-rule="evenodd" height="12" rx="1" ry="1" width="12" x="4" y="20"></rect><path fill-rule="evenodd" d="M23,12H13a1,1,0,0,0-1,1v5h4a2,2,0,0,1,2,2v4h5a1,1,0,0,0,1-1V13A1,1,0,0,0,23,12Z"></path>`;

const Multiple = createWorkflowIcon('VueWorkflowMultiple', svgAttributes, svgInnerHTML);

export default Multiple;
