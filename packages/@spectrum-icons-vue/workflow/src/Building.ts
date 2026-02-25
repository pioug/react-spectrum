import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H5A1,1,0,0,0,4,3V33a1,1,0,0,0,1,1H16V22h6V34H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM12,26H6V22h6Zm0-8H6V14h6Zm0-8H6V6h6Zm10,8H16V14h6Zm0-8H16V6h6ZM32,26H26V22h6Zm0-8H26V14h6Zm0-8H26V6h6Z"></path>`;

const Building = createWorkflowIcon('VueWorkflowBuilding', svgAttributes, svgInnerHTML);

export default Building;
