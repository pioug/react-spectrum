import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,.4,6.428,33.5A.385.385,0,0,0,6.8,34H29.2a.385.385,0,0,0,.368-.5Z"></path>`;

const Sharpen = createWorkflowIcon('VueWorkflowSharpen', svgAttributes, svgInnerHTML);

export default Sharpen;
