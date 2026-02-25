import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="24" x="6" y="4"></rect><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="24" x="6" y="8"></rect><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="24" x="6" y="12"></rect><rect fill-rule="evenodd" height="2" rx="0.5" ry="0.5" width="24" x="6" y="16"></rect><path fill-rule="evenodd" d="M32,10V20H27a1,1,0,0,0-1,1v2a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V21a1,1,0,0,0-1-1H4V10H1a1,1,0,0,0-1,1V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1Z"></path>`;

const Inbox = createWorkflowIcon('VueWorkflowInbox', svgAttributes, svgInnerHTML);

export default Inbox;
