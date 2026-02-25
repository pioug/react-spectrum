import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM12,32H4V28h8Zm0-6H4V22h8Zm0-6H4V16h8ZM32,32H14V28H32Zm0-6H14V22H32Zm0-6H14V16H32Zm0-6H4V4H32Z"></path>`;

const Table = createWorkflowIcon('VueWorkflowTable', svgAttributes, svgInnerHTML);

export default Table;
