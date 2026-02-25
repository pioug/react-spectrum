import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M22,14H12.994a.994.994,0,0,0-.994.994v6.012a.994.994,0,0,0,.994.994H22v8.912a.5.5,0,0,0,.848.351L36,18,22.848,4.736A.5.5,0,0,0,22,5.088Z"></path><rect fill-rule="evenodd" height="28" rx="0.707" ry="0.707" width="4" x="4" y="4"></rect>`;

const RailRightClose = createWorkflowIcon('VueWorkflowRailRightClose', svgAttributes, svgInnerHTML);

export default RailRightClose;
