import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="14" r="4"></circle><path fill-rule="evenodd" d="M33,6H3A1,1,0,0,0,2,7V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM32,28H26V24a4,4,0,0,0-4-4H14a4,4,0,0,0-4,4v4H4V8H32Z"></path>`;

const Landscape = createWorkflowIcon('VueWorkflowLandscape', svgAttributes, svgInnerHTML);

export default Landscape;
