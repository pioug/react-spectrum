import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27.1,18.1A8.9,8.9,0,1,0,36,27,8.9,8.9,0,0,0,27.1,18.1Zm0,16a7.1,7.1,0,0,1-1-14.121V27a1,1,0,0,0,.293.707l3.022,3.023a.5.5,0,0,0,.708,0l.707-.708a.5.5,0,0,0,0-.707L28.1,26.586V19.978a7.1,7.1,0,0,1-1,14.122Z"></path><path fill-rule="evenodd" d="M16,26c0,.114.024.222.034.334A10.924,10.924,0,0,1,18,20.687V10a2,2,0,0,1,2-2h4.1a5,5,0,1,0,0-2H20a4,4,0,0,0-4,4v6H11.9a5,5,0,1,0,0,2H16ZM29,4a3,3,0,1,1-3,3A3,3,0,0,1,29,4ZM7,20a3,3,0,1,1,3-3A3,3,0,0,1,7,20Z"></path>`;

const JourneyEvent2 = createWorkflowIcon('VueWorkflowJourneyEvent2', svgAttributes, svgInnerHTML);

export default JourneyEvent2;
