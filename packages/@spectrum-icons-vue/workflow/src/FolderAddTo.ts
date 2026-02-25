import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12.064,27.418l8.356-9.076a3.086,3.086,0,0,1,2.213-.961,3.044,3.044,0,0,1,3.041,3.037v.943A13.842,13.842,0,0,1,34,25.605V11a1,1,0,0,0-1-1H2V31a1,1,0,0,0,1,1H16.285Z"></path><path fill-rule="evenodd" d="M23.273,23.6V20.418a.636.636,0,0,0-1.086-.45l-6.86,7.449,6.86,7.449a.636.636,0,0,0,1.086-.45V31.187a11.687,11.687,0,0,1,11.916,4.632.45.45,0,0,0,.811-.26C36,33.638,33.808,23.6,23.273,23.6Z"></path><path fill-rule="evenodd" d="M16,8H2V5.5A1.5,1.5,0,0,1,3.5,4h7.672a2,2,0,0,1,1.414.586Z"></path>`;

const FolderAddTo = createWorkflowIcon('VueWorkflowFolderAddTo', svgAttributes, svgInnerHTML);

export default FolderAddTo;
