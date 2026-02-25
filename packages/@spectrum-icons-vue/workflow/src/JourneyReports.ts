import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="18" rx="0.5" width="2" x="34" y="18"></rect><rect fill-rule="evenodd" height="12" rx="0.5" width="2" x="30" y="24"></rect><rect fill-rule="evenodd" height="8" rx="0.5" width="2" x="26" y="28"></rect><rect fill-rule="evenodd" height="6" rx="0.5" width="2" x="22" y="30"></rect><path fill-rule="evenodd" d="M20,28a2,2,0,0,1-2-2V10a2,2,0,0,1,2-2h4.1a5,5,0,1,0,0-2H20a4,4,0,0,0-4,4v6H11.9a5,5,0,1,0,0,2H16v8a4,4,0,0,0,4,4ZM29,4a3,3,0,1,1-3,3A3,3,0,0,1,29,4ZM7,20a3,3,0,1,1,3-3A3,3,0,0,1,7,20Z"></path>`;

const JourneyReports = createWorkflowIcon('VueWorkflowJourneyReports', svgAttributes, svgInnerHTML);

export default JourneyReports;
