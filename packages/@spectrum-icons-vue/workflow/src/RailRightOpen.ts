import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14,14h9.006a.994.994,0,0,1,.994.994v6.012a.994.994,0,0,1-.994.994H14v8.912a.5.5,0,0,1-.848.351L0,18,13.152,4.736A.5.5,0,0,1,14,5.088Z"></path><rect fill-rule="evenodd" height="28" rx="0.707" ry="0.707" width="4" x="28" y="4"></rect>`;

const RailRightOpen = createWorkflowIcon('VueWorkflowRailRightOpen', svgAttributes, svgInnerHTML);

export default RailRightOpen;
