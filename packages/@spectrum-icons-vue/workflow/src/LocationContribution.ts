import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,5V31a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H3A1,1,0,0,0,2,5ZM6,8H24V22H6ZM6,28V24H24v4Zm24,0H26V8h4Z"></path><path fill-rule="evenodd" d="M18.838,10.346,13.85,17.473,11.01,14.9a.5.5,0,0,0-.706.035l-.939,1.038a.5.5,0,0,0,.035.706l3.84,3.476a1.21,1.21,0,0,0,1.8-.2L20.8,11.722a.5.5,0,0,0-.123-.7l-1.147-.8A.5.5,0,0,0,18.838,10.346Z"></path>`;

const LocationContribution = createWorkflowIcon('VueWorkflowLocationContribution', svgAttributes, svgInnerHTML);

export default LocationContribution;
