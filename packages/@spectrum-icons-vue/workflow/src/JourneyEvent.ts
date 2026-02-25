import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18a9,9,0,1,0,9,9A9,9,0,0,0,27,18Zm4.081,9.748-5.927,6.778a.613.613,0,0,1-1.027-.642l2-4.749L23.3,27.921a1.059,1.059,0,0,1-.379-1.67l5.928-6.777a.613.613,0,0,1,1.026.642l-2,4.749L30.7,26.079A1.058,1.058,0,0,1,31.081,27.748Z"></path><path fill-rule="evenodd" d="M16,26c0,.114.024.222.034.334A10.924,10.924,0,0,1,18,20.687V10a2,2,0,0,1,2-2h4.1a5,5,0,1,0,0-2H20a4,4,0,0,0-4,4v6H11.9a5,5,0,1,0,0,2H16ZM29,4a3,3,0,1,1-3,3A3,3,0,0,1,29,4ZM7,20a3,3,0,1,1,3-3A3,3,0,0,1,7,20Z"></path>`;

const JourneyEvent = createWorkflowIcon('VueWorkflowJourneyEvent', svgAttributes, svgInnerHTML);

export default JourneyEvent;
