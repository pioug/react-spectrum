import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29.241,2H12.8a.8.8,0,0,0-.8.806.785.785,0,0,0,.236.56l3.5,3.5a57.07,57.07,0,0,0-5.442,9.691A29.236,29.236,0,0,0,8.12,25.043c-.082.853-.12,1.7-.12,2.536a29.888,29.888,0,0,0,.576,5.753.827.827,0,0,0,1.618.023l.006-.023a25.346,25.346,0,0,1,2.594-6.919,22.717,22.717,0,0,1,4.3-5.429,48.574,48.574,0,0,1,7.33-5.429l4.209,4.209a.785.785,0,0,0,.56.236A.8.8,0,0,0,30,19.2V2.759A.807.807,0,0,0,29.241,2Z"></path>`;

const Alias = createWorkflowIcon('VueWorkflowAlias', svgAttributes, svgInnerHTML);

export default Alias;
