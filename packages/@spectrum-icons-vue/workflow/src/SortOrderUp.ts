import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" x="2" y="8" width="12" height="4" rx="1"></rect><rect fill-rule="evenodd" x="2" y="16" width="16" height="4" rx="1"></rect><rect fill-rule="evenodd" x="2" y="24" width="20" height="4" rx="1"></rect><path fill-rule="evenodd" d="M31.999,12H29.99268V27a.98756.98756,0,0,1-.98633,1h-.99268a1.00007,1.00007,0,0,1-1-.999L27.00732,12H25.001a.49969.49969,0,0,1-.501-.50354.48872.48872,0,0,1,.14746-.35l3.53613-4.03369a.50021.50021,0,0,1,.63282,0l3.53613,4.03369a.48872.48872,0,0,1,.14746.35A.49969.49969,0,0,1,31.999,12Z"></path>`;

const SortOrderUp = createWorkflowIcon('VueWorkflowSortOrderUp', svgAttributes, svgInnerHTML);

export default SortOrderUp;
