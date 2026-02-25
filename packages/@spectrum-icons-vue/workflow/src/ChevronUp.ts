import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28,21.98a2,2,0,0,1-3.411,1.411l-6.578-6.572-6.578,6.572a2,2,0,0,1-2.874-2.773l.049-.049L16.6,12.585a2,2,0,0,1,2.825,0h0l7.989,7.983A1.989,1.989,0,0,1,28,21.98Z"></path>`;

const ChevronUp = createWorkflowIcon('VueWorkflowChevronUp', svgAttributes, svgInnerHTML);

export default ChevronUp;
