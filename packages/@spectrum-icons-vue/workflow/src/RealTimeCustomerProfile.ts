import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,1A17,17,0,1,0,35,18,17.00006,17.00006,0,0,0,18,1ZM28.98206,28.18323a10.82571,10.82571,0,0,0-6.22425-3.1283,1.30722,1.30722,0,0,1-1.131-1.3114V21.8512a1.313,1.313,0,0,1,.33289-.84436A9.99058,9.99058,0,0,0,24.24011,14.771c0-4.72058-2.5083-7.35926-6.28674-7.35926s-6.35791,2.7367-6.35791,7.35926a10.103,10.103,0,0,0,2.38293,6.2384,1.30994,1.30994,0,0,1,.33313.84412v1.8833a1.29957,1.29957,0,0,1-1.14013,1.31079,10.86311,10.86311,0,0,0-6.23926,3.041,14.99931,14.99931,0,1,1,22.04993.09461Z"></path>`;

const RealTimeCustomerProfile = createWorkflowIcon('VueWorkflowRealTimeCustomerProfile', svgAttributes, svgInnerHTML);

export default RealTimeCustomerProfile;
