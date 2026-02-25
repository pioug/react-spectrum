import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.093,6.061l-8.14,11.374L20.9,9.321a.5.5,0,0,0-.917.053l-5.45,14.992-4.081-4.081a.5.5,0,0,0-.674-.031L2.18,26.579a.5.5,0,0,0-.18.384v4.188a.5.5,0,0,0,.829.376l7.048-6.157,5.708,5.708a.5.5,0,0,0,.823-.183l4.548-12.51L24,24.481a.5.5,0,0,0,.857.063L33.91,11.616A.5.5,0,0,0,34,11.33V6.352A.5.5,0,0,0,33.093,6.061Z"></path>`;

const GraphTrend = createWorkflowIcon('VueWorkflowGraphTrend', svgAttributes, svgInnerHTML);

export default GraphTrend;
