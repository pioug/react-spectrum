import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,32H4V4H32Zm2,1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33A1,1,0,0,0,34,33Z"></path><rect fill-rule="evenodd" height="8" rx="0.5" ry="0.5" transform="translate(28 8) rotate(90)" width="24" x="-2" y="14"></rect>`;

const PaddingLeft = createWorkflowIcon('VueWorkflowPaddingLeft', svgAttributes, svgInnerHTML);

export default PaddingLeft;
