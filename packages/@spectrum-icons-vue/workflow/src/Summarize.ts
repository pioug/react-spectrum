import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="6" y="2"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="24" x="6" y="18"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="32" x="2" y="10"></rect><path fill-rule="evenodd" d="M19.5,34a.5.5,0,0,0,.5-.5V30h2.793a.5.5,0,0,0,.354-.854L18,24l-5.146,5.146a.5.5,0,0,0,.354.854H16v3.5a.5.5,0,0,0,.5.5Z"></path>`;

const Summarize = createWorkflowIcon('VueWorkflowSummarize', svgAttributes, svgInnerHTML);

export default Summarize;
