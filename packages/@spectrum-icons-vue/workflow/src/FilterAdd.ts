import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.8,27A13.146,13.146,0,0,1,18,18.589C20.083,15.9,29.733,3.617,29.733,3.617A1,1,0,0,0,28.946,2H1.054A1,1,0,0,0,.267,3.617L12,18.589V33.9a.992.992,0,0,0,1.68.825l2.338-2.439A12.131,12.131,0,0,1,14.8,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const FilterAdd = createWorkflowIcon('VueWorkflowFilterAdd', svgAttributes, svgInnerHTML);

export default FilterAdd;
