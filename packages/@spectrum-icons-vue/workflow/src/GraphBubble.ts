import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="8" cy="8" r="6"></circle><circle fill-rule="evenodd" cx="6" cy="24" r="4"></circle><path fill-rule="evenodd" d="M26.5,14.338a4.941,4.941,0,1,0-6.547.507,10.04,10.04,0,1,0,6.547-.507Z"></path>`;

const GraphBubble = createWorkflowIcon('VueWorkflowGraphBubble', svgAttributes, svgInnerHTML);

export default GraphBubble;
