import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.57133,28.71471a6.42856,6.42856,0,1,0,0-12.85712,6.49654,6.49654,0,0,0-.7253.04091,8.14391,8.14391,0,1,0-15.92158-3.23521,6.8615,6.8615,0,0,0-8.40756,8.3936,3.85732,3.85732,0,1,0-.6598,7.65782Z"></path>`;

const Cloud = createWorkflowIcon('VueWorkflowCloud', svgAttributes, svgInnerHTML);

export default Cloud;
