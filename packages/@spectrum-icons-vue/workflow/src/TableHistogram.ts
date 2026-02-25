import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM10,32H4V28h6Zm0-6H4V22h6Zm0-6H4V16h6ZM22,32H12V28H22Zm10-6H12V22H32Zm-6-6H12V16H26Zm6-6H4V4H32Z"></path>`;

const TableHistogram = createWorkflowIcon('VueWorkflowTableHistogram', svgAttributes, svgInnerHTML);

export default TableHistogram;
