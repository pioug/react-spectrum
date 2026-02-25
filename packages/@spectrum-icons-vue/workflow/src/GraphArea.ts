import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30.371,16.743,34,24v9a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V18L12,30l3.584-5.376a.5.5,0,0,1,.832,0L20,30l9.517-13.324A.5.5,0,0,1,30.371,16.743Z"></path><path fill-rule="evenodd" d="M11.769,25.66l2.068-3.1.083-.124a2.5,2.5,0,0,1,4.16,0l.083.124,1.911,2.866,7.811-10.935.1-.135a2.5,2.5,0,0,1,4.271.335l.074.148L34,18.187V2L26,12,20.391,6.391a.5.5,0,0,0-.74.037L7.8,20.9Z"></path>`;

const GraphArea = createWorkflowIcon('VueWorkflowGraphArea', svgAttributes, svgInnerHTML);

export default GraphArea;
