import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,22.2A2.8,2.8,0,1,1,26.2,25,2.8,2.8,0,0,1,29,22.2ZM29,18a7,7,0,0,0-7,7c0,3.866,7,11,7,11s7-7.134,7-11A7,7,0,0,0,29,18Z"></path><path fill-rule="evenodd" d="M20.775,28H20a2,2,0,0,1-2-2V10a2,2,0,0,1,2-2h4.1a5,5,0,1,0,0-2H20a4,4,0,0,0-4,4v6H11.9a5,5,0,1,0,0,2H16v8a4,4,0,0,0,4,4h1.825A19.039,19.039,0,0,1,20.775,28ZM29,4a3,3,0,1,1-3,3A3,3,0,0,1,29,4ZM7,20a3,3,0,1,1,3-3A3,3,0,0,1,7,20Z"></path>`;

const Journey = createWorkflowIcon('VueWorkflowJourney', svgAttributes, svgInnerHTML);

export default Journey;
