import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M9,8H26V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V25a1,1,0,0,0,1,1H8V9A1,1,0,0,1,9,8Z"></path><path fill-rule="evenodd" d="M33,10H11a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10ZM29,23.5H23.5V29h-3V23.5H15v-3h5.5V15h3v5.5H29Z"></path>`;

const Duplicate = createWorkflowIcon('VueWorkflowDuplicate', svgAttributes, svgInnerHTML);

export default Duplicate;
