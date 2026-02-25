import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,6H7A1,1,0,0,0,6,7V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM14,32H8V28h6Zm0-6H8V22h6Zm0-6H8V16h6ZM32,32H16V28H32Zm0-6H16V22H32Zm0-6H16V16H32Zm0-6H8V8H32Z"></path><path fill-rule="evenodd" d="M4,4H30V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V29a1,1,0,0,0,1,1H4Z"></path>`;

const SelectContainer = createWorkflowIcon('VueWorkflowSelectContainer', svgAttributes, svgInnerHTML);

export default SelectContainer;
