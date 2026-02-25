import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,32H18V4H32Zm2,1V3a1,1,0,0,0-1-1H17a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33A1,1,0,0,0,34,33Z"></path><rect fill-rule="evenodd" height="10" rx="1" transform="translate(25 11) rotate(90)" width="32" x="-9" y="13"></rect>`;

const MarginLeft = createWorkflowIcon('VueWorkflowMarginLeft', svgAttributes, svgInnerHTML);

export default MarginLeft;
