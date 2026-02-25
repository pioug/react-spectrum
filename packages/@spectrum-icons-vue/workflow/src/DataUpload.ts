import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<ellipse fill-rule="evenodd" cx="18" cy="7" rx="16" ry="5"></ellipse><path fill-rule="evenodd" d="M17,31l-4.209-.011a2.5,2.5,0,0,1-1.852-4.179l2.517-2.786C8.729,23.548,3.321,22.366,2,20.27V29c0,2.656,6.632,4.822,15,4.984Z"></path><path fill-rule="evenodd" d="M32.3,19.235C33.377,18.562,34,17.8,34,17V10.27c-1.216,1.538-3.958,2.536-7.014,3.151Z"></path><path fill-rule="evenodd" d="M22.456,14.063c-1.619.147-3.164.212-4.456.212-4.936,0-14.212-1.168-16-4V17c0,2.479,5.778,4.531,13.352,4.926Z"></path><path fill-rule="evenodd" d="M35.146,27.146a.5.5,0,0,1-.353.854H30v8H20V28H15.207a.5.5,0,0,1-.353-.854L25,16Z"></path>`;

const DataUpload = createWorkflowIcon('VueWorkflowDataUpload', svgAttributes, svgInnerHTML);

export default DataUpload;
