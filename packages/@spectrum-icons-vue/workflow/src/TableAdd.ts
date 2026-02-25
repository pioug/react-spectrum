import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.769,32H14V28h.75c-.026-.331-.05-.662-.05-1s.023-.669.05-1H14V22h1.769a12.338,12.338,0,0,1,1.124-2H14V16h7.52A12.242,12.242,0,0,1,34,16.893V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H16.893A12.338,12.338,0,0,1,15.769,32ZM4,4H32V14H4Zm8,28H4V28h8Zm0-6H4V22h8Zm0-6H4V16h8Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const TableAdd = createWorkflowIcon('VueWorkflowTableAdd', svgAttributes, svgInnerHTML);

export default TableAdd;
