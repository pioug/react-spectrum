import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,12A12,12,0,0,0,12,24,11.831,11.831,0,0,0,24,35.8,11.662,11.662,0,0,0,35.8,24,11.831,11.831,0,0,0,24,12Zm7.242,7.907-7.224,9.434a1.206,1.206,0,0,1-.875.461c-.024,0-.049,0-.073,0a1.2,1.2,0,0,1-.849-.351l-4.837-4.847a1.2,1.2,0,0,1,0-1.7l1.327-1.325a1.2,1.2,0,0,1,1.7,0l2.4,2.4L27.89,17.3a1.2,1.2,0,0,1,1.686-.21l1.455,1.133A1.2,1.2,0,0,1,31.242,19.907Z"></path><path fill-rule="evenodd" d="M11.521,14H5a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1H16.26a15.9,15.9,0,0,1,7.055-1.965A11.818,11.818,0,0,0,12,.2,11.662,11.662,0,0,0,.2,12,11.819,11.819,0,0,0,8.034,23.315,15.921,15.921,0,0,1,11.521,14Z"></path>`;

const ApproveReject = createWorkflowIcon('VueWorkflowApproveReject', svgAttributes, svgInnerHTML);

export default ApproveReject;
