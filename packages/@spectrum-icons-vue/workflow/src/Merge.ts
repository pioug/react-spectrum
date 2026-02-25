import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.19482,10.20642A.68527.68527,0,0,0,26.70508,10,.6995.6995,0,0,0,26,10.70142V14H18V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5V9a1,1,0,0,0,1,1h9V24H3a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1H17a1,1,0,0,0,1-1V20h8v3.29858A.6995.6995,0,0,0,26.70508,24a.68527.68527,0,0,0,.48974-.20642l5.68506-6.46875a.49926.49926,0,0,0,0-.64966Z"></path>`;

const Merge = createWorkflowIcon('VueWorkflowMerge', svgAttributes, svgInnerHTML);

export default Merge;
