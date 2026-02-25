import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="22" cy="14" r="4"></circle><path fill-rule="evenodd" d="M8,21V7A1,1,0,0,1,9,6H35a1,1,0,0,1,1,1V21a1,1,0,0,1-1,1H9A1,1,0,0,1,8,21Zm26-9.343A6.016,6.016,0,0,1,30.343,8H13.657A6.015,6.015,0,0,1,10,11.657v4.686A6.016,6.016,0,0,1,13.657,20H30.343A6.015,6.015,0,0,1,34,16.343Z"></path><path fill-rule="evenodd" d="M33,26H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8H6V24H34v1A1,1,0,0,1,33,26Z"></path><path fill-rule="evenodd" d="M29,30H1a1,1,0,0,1-1-1V13a1,1,0,0,1,1-1H2V28H30v1A1,1,0,0,1,29,30Z"></path>`;

const Money = createWorkflowIcon('VueWorkflowMoney', svgAttributes, svgInnerHTML);

export default Money;
