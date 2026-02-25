import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,4H3A1,1,0,0,0,2,5V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5A1,1,0,0,0,33,4ZM12,28H4V18h8Zm0-12H4V6h8ZM22,28H14V18h8Zm0-12H14V6h8ZM32,28H24V18h8Zm0-12H24V6h8Z"></path>`;

const Collection = createWorkflowIcon('VueWorkflowCollection', svgAttributes, svgInnerHTML);

export default Collection;
