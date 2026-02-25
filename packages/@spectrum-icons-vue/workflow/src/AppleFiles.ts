import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M31.66,8H17.709a2.347,2.347,0,0,1-1.3-.393L11.59,4.393A2.343,2.343,0,0,0,10.292,4H4.34A2.34,2.34,0,0,0,2,6.34V27.66A2.34,2.34,0,0,0,4.34,30H31.66A2.34,2.34,0,0,0,34,27.66V10.34A2.34,2.34,0,0,0,31.66,8ZM4,11.5A1.5,1.5,0,0,1,5.5,10h25A1.5,1.5,0,0,1,32,11.5V12H4Z"></path>`;

const AppleFiles = createWorkflowIcon('VueWorkflowAppleFiles', svgAttributes, svgInnerHTML);

export default AppleFiles;
