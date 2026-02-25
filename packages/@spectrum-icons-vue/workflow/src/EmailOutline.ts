import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,4H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V5A1,1,0,0,0,35,4ZM34,6V7.506L18,19.741,2,7.506V6Zm0,4.023v15.9l-10.4-7.95Zm-21.6,7.95L2,25.923v-15.9ZM2,30V28.44l12.042-9.208,2.743,2.1a2,2,0,0,0,2.43,0l2.743-2.1L34,28.44V30Z"></path>`;

const EmailOutline = createWorkflowIcon('VueWorkflowEmailOutline', svgAttributes, svgInnerHTML);

export default EmailOutline;
