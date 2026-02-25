import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.5,30h-3a.5.5,0,0,0-.5.5v-4a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v-6a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v-8a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V6.519A.519.519,0,0,0,17.481,6H14.519A.519.519,0,0,0,14,6.519V10.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v10a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v8a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V34H34V30.5A.5.5,0,0,0,33.5,30Z"></path>`;

const GraphHistogram = createWorkflowIcon('VueWorkflowGraphHistogram', svgAttributes, svgInnerHTML);

export default GraphHistogram;
