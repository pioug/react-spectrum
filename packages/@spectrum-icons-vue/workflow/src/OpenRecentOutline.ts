import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M16.051,28H4L8.689,14H33.225l-1.093,3.279a10.983,10.983,0,0,1,1.729,1.138l1.7-5.1A1,1,0,0,0,34.613,12H32V9a1,1,0,0,0-1-1h0l-12.332.007-3.3-3.4A2,2,0,0,0,13.929,4H4A2,2,0,0,0,2,6V29a1,1,0,0,0,1,1H16.427A10.837,10.837,0,0,1,16.051,28Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm0,16a7.1,7.1,0,0,1-1-14.121V27a1,1,0,0,0,.293.707l3.023,3.023a.5.5,0,0,0,.707,0l.707-.708a.5.5,0,0,0,0-.707L28,26.586V19.978A7.1,7.1,0,0,1,27,34.1Z"></path>`;

const OpenRecentOutline = createWorkflowIcon('VueWorkflowOpenRecentOutline', svgAttributes, svgInnerHTML);

export default OpenRecentOutline;
