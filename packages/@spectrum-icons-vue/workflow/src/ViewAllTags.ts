import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="4" x="2" y="2"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="10" y="2"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="4" x="2" y="10"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="10" y="10"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="4" x="2" y="18"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="4" x="2" y="26"></rect><path fill-rule="evenodd" d="M35.668,26.106l-9.88-9.879A.772.772,0,0,0,25.242,16h-8.47a.772.772,0,0,0-.772.772v8.471a.772.772,0,0,0,.226.546l9.879,9.88a.772.772,0,0,0,1.092,0L35.668,27.2A.772.772,0,0,0,35.668,26.106ZM20.4,22.948A2.548,2.548,0,1,1,22.948,20.4,2.548,2.548,0,0,1,20.4,22.948Z"></path><path fill-rule="evenodd" d="M14.294,27.2c-.332-.332-.223-.756-.353-1.2H11a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h6.091Z"></path><path fill-rule="evenodd" d="M14,18H11a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h3Z"></path>`;

const ViewAllTags = createWorkflowIcon('VueWorkflowViewAllTags', svgAttributes, svgInnerHTML);

export default ViewAllTags;
