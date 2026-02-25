import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M4,4H18V32H4ZM2,3V33a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3Z"></path><rect fill-rule="evenodd" height="10" rx="1" transform="translate(11 47) rotate(-90)" width="32" x="13" y="13"></rect>`;

const MarginRight = createWorkflowIcon('VueWorkflowMarginRight', svgAttributes, svgInnerHTML);

export default MarginRight;
