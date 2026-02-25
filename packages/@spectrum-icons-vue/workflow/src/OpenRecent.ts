import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.1,18.1A8.9,8.9,0,1,0,36,27,8.9,8.9,0,0,0,27.1,18.1Zm0,16a7.1,7.1,0,0,1-1-14.121V27a1,1,0,0,0,.293.707l3.022,3.023a.5.5,0,0,0,.708,0l.707-.708a.5.5,0,0,0,0-.707L28.1,26.586V19.978a7.1,7.1,0,0,1-1,14.122Z"></path><path fill-rule="evenodd" d="M15.8,27a11.289,11.289,0,0,1,18.565-8.642l1.128-3.007A1,1,0,0,0,34.557,14H30V9a1,1,0,0,0-1-1h0l-12.332.008-3.3-3.4A2,2,0,0,0,11.929,4H4A2,2,0,0,0,2,6V29a1,1,0,0,0,1,1H16.216A11.254,11.254,0,0,1,15.8,27ZM7.757,14.649,4,24.667V6h7.929l3.305,3.4.59.607h.845L28,10v4H8.693A1,1,0,0,0,7.757,14.649Z"></path>`;

const OpenRecent = createWorkflowIcon('VueWorkflowOpenRecent', svgAttributes, svgInnerHTML);

export default OpenRecent;
