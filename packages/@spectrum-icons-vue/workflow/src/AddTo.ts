import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,12V5a1,1,0,0,0-1-1H5A1,1,0,0,0,4,5V23a1,1,0,0,0,1,1h7v7a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V13a1,1,0,0,0-1-1Z"></path>`;

const AddTo = createWorkflowIcon('VueWorkflowAddTo', svgAttributes, svgInnerHTML);

export default AddTo;
