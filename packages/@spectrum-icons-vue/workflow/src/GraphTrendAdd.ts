import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.063,16.846l.894-2.459.76,1.518a11.922,11.922,0,0,1,7.127-1.052L33.91,7.616A.5.5,0,0,0,34,7.33V2.352a.5.5,0,0,0-.906-.291L24.953,13.436,20.895,5.321a.5.5,0,0,0-.917.053l-5.45,14.992-4.081-4.082a.5.5,0,0,0-.674-.031L2.18,22.579a.5.5,0,0,0-.18.384v4.188a.5.5,0,0,0,.829.377l7.048-6.157,4.861,4.861A12.281,12.281,0,0,1,20.063,16.846Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const GraphTrendAdd = createWorkflowIcon('VueWorkflowGraphTrendAdd', svgAttributes, svgInnerHTML);

export default GraphTrendAdd;
