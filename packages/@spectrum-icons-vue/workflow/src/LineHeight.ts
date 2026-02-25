import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="4"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="12" y="28"></rect><path fill-rule="evenodd" d="M9,30H6.994L7,8H9.006a.5.5,0,0,0,.5-.5.49.49,0,0,0-.147-.35L5.824,3.113a.5.5,0,0,0-.633,0L1.655,7.146a.491.491,0,0,0-.148.35.5.5,0,0,0,.5.5H4.015L4.009,30H2a.5.5,0,0,0-.5.5.49.49,0,0,0,.147.35l3.537,4.033a.5.5,0,0,0,.632,0l3.536-4.033A.491.491,0,0,0,9.5,30.5.5.5,0,0,0,9,30Z"></path>`;

const LineHeight = createWorkflowIcon('VueWorkflowLineHeight', svgAttributes, svgInnerHTML);

export default LineHeight;
