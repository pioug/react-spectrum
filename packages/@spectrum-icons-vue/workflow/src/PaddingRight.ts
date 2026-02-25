import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,3H32V31H4ZM3,33H33a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1H3A1,1,0,0,0,2,2V32A1,1,0,0,0,3,33Z"></path><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" transform="translate(43 -9) rotate(90)" width="24" x="14" y="13"></rect>`;

const PaddingRight = createWorkflowIcon('VueWorkflowPaddingRight', svgAttributes, svgInnerHTML);

export default PaddingRight;
