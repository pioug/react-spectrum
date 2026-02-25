import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26,14c0-.4-.021-.8-.06-1.188A9.995,9.995,0,0,0,12.812,25.94c.391.039.787.06,1.188.06A12,12,0,0,0,26,14Z"></path><path fill-rule="evenodd" d="M10,22A12,12,0,0,1,25.482,10.518,12,12,0,1,0,10.518,25.482,11.989,11.989,0,0,1,10,22Z"></path><path fill-rule="evenodd" d="M25.482,10.518a11.907,11.907,0,0,1,.458,2.294A10,10,0,1,1,12.812,25.94a11.907,11.907,0,0,1-2.294-.458A12,12,0,1,0,25.482,10.518Z"></path>`;

const DataCorrelated = createWorkflowIcon('VueWorkflowDataCorrelated', svgAttributes, svgInnerHTML);

export default DataCorrelated;
