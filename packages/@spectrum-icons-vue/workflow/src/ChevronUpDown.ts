import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M28,11.98a2,2,0,0,1-3.411,1.411L18.012,6.818l-6.578,6.572a2,2,0,0,1-2.874-2.773l.049-.049L16.6,2.585a2,2,0,0,1,2.825,0h0l7.989,7.983A1.989,1.989,0,0,1,28,11.98Z"></path><path fill-rule="evenodd" d="M8,24.02a2,2,0,0,1,3.411-1.411l6.578,6.572,6.578-6.572a2,2,0,0,1,2.874,2.773l-.049.049L19.4,33.414a2,2,0,0,1-2.825,0h0L8.586,25.431A1.989,1.989,0,0,1,8,24.02Z" data-name="S_UpChevron"></path>`;

const ChevronUpDown = createWorkflowIcon('VueWorkflowChevronUpDown', svgAttributes, svgInnerHTML);

export default ChevronUpDown;
