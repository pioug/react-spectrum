import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="14" width="8" x="22" y="8"></rect><path fill-rule="evenodd" d="M35,2H1A1,1,0,0,0,0,3V27a1,1,0,0,0,1,1H14v5a1,1,0,0,1-1,1H11a.979.979,0,0,0-1,1v1H26V35a1,1,0,0,0-1-1H23a1,1,0,0,1-1-1V28H35a1,1,0,0,0,1-1V3A1,1,0,0,0,35,2ZM32,24H4V6H32Z"></path>`;

const AdDisplay = createWorkflowIcon('VueWorkflowAdDisplay', svgAttributes, svgInnerHTML);

export default AdDisplay;
