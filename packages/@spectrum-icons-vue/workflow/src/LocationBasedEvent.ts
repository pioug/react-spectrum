import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.5,14.054a.494.494,0,0,0-.5.5V34.336a.494.494,0,0,0,.846.353L26.51,29h8c.446,0,.479-.726.225-.98S20.846,14.2,20.846,14.2A.489.489,0,0,0,20.5,14.054Z"></path><path fill-rule="evenodd" d="M2,2V12.476A10.735,10.735,0,0,1,6,10.3L6,6H28V17.158l4,4V2Z"></path><path fill-rule="evenodd" d="M9,12.367a8.25,8.25,0,0,0-8.25,8.25C.75,25.173,9,35.57,9,35.57s8.25-10.4,8.25-14.953A8.25,8.25,0,0,0,9,12.367Zm0,11.75a3.5,3.5,0,1,1,3.5-3.5A3.5,3.5,0,0,1,9,24.117Z"></path>`;

const LocationBasedEvent = createWorkflowIcon('VueWorkflowLocationBasedEvent', svgAttributes, svgInnerHTML);

export default LocationBasedEvent;
