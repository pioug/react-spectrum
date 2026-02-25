import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M17.292,28.438a3.522,3.522,0,0,1,.2-.438H12V24h9.167l2-2H12V18H27.167L29,16.172c.064-.065.138-.113.206-.172H12V12H30v3.457a3.55,3.55,0,0,1,1.5-.407l.115-.006h.092c.1,0,.2.02.294.028V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V29a1,1,0,0,0,1,1H16.764ZM4,4H30v6H4Zm6,24H4V24h6Zm0-6H4V18h6Zm0-6H4V12h6Z"></path><path fill-rule="evenodd" d="M35.738,21.764l-3.506-3.5a.736.736,0,0,0-.526-.215h-.024a.838.838,0,0,0-.564.247L20.929,28.48a.62.62,0,0,0-.152.256l-2.661,6.631c-.069.229.28.517.477.517a.256.256,0,0,0,.037,0c.168-.038,5.755-2.4,6.634-2.661a.6.6,0,0,0,.252-.151l10.19-10.19a.834.834,0,0,0,.245-.537A.74.74,0,0,0,35.738,21.764ZM24.769,32.1c-1.314.4-3.928,1.862-5.064,2.2L21.9,29.232Z"></path>`;

const TableEdit = createWorkflowIcon('VueWorkflowTableEdit', svgAttributes, svgInnerHTML);

export default TableEdit;
