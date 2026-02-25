import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,24a5,5,0,0,0-4.9,4H20a2,2,0,0,1-2-2V10a2,2,0,0,1,2-2h4.1a5,5,0,1,0,0-2H20a4,4,0,0,0-4,4v6H11.9a5,5,0,1,0,0,2H16v8a4,4,0,0,0,4,4h4.1A5,5,0,1,0,29,24ZM29,4a3,3,0,1,1-3,3A3,3,0,0,1,29,4ZM7,20a3,3,0,1,1,3-3A3,3,0,0,1,7,20ZM29,32a3,3,0,1,1,3-3A3,3,0,0,1,29,32Z"></path>`;

const JourneyVoyager = createWorkflowIcon('VueWorkflowJourneyVoyager', svgAttributes, svgInnerHTML);

export default JourneyVoyager;
