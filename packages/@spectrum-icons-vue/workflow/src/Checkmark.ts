import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31.312,7.725,29.857,6.592a1,1,0,0,0-1.4.175L14.822,24.283,8.175,17.671a1,1,0,0,0-1.414,0L5.436,19a1,1,0,0,0,0,1.414l8.926,8.9a1,1,0,0,0,1.5-.093L31.487,9.128A1,1,0,0,0,31.312,7.725Z"></path>`;

const Checkmark = createWorkflowIcon('VueWorkflowCheckmark', svgAttributes, svgInnerHTML);

export default Checkmark;
