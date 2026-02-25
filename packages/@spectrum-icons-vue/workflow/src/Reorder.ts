import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,4a.994.994,0,0,0-.747.336l-11,10A.979.979,0,0,0,6,14.994,1,1,0,0,0,7,16H29a1,1,0,0,0,1-1.006.979.979,0,0,0-.255-.658l-11-10A1,1,0,0,0,18,4Z"></path><path fill-rule="evenodd" d="M18,32a1,1,0,0,0,.747-.336l11-10A.979.979,0,0,0,30,21.006,1,1,0,0,0,29,20H7a1,1,0,0,0-1,1.006.979.979,0,0,0,.255.658l11,10A.994.994,0,0,0,18,32Z"></path>`;

const Reorder = createWorkflowIcon('VueWorkflowReorder', svgAttributes, svgInnerHTML);

export default Reorder;
