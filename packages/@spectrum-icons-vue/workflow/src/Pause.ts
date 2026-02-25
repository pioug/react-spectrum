import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="28" rx="1" width="8" x="6" y="4.00007"></rect><rect fill-rule="evenodd" height="28" rx="1" width="8" x="20" y="4.00007"></rect>`;

const Pause = createWorkflowIcon('VueWorkflowPause', svgAttributes, svgInnerHTML);

export default Pause;
