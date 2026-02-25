import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" transform="translate(-7.456 18) rotate(-45)" width="39.598" x="-1.799" y="17"></rect>`;

const Line = createWorkflowIcon('VueWorkflowLine', svgAttributes, svgInnerHTML);

export default Line;
