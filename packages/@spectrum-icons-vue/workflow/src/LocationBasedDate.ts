import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="8" rx="1" ry="1" width="8" x="22" y="16"></rect><path fill-rule="evenodd" d="M35,4H30V1a1,1,0,0,0-1-1H27a1,1,0,0,0-1,1V4H14V1a1,1,0,0,0-1-1H11a1,1,0,0,0-1,1V4H5A1,1,0,0,0,4,5v6.109A10.633,10.633,0,0,1,6,10.3V6h4V7a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V6H26V7a1,1,0,0,0,1,1h2a1,1,0,0,0,1-1V6h4V28H17.143c-.374.675-.766,1.345-1.17,2H35a1,1,0,0,0,1-1V5A1,1,0,0,0,35,4Z"></path><path fill-rule="evenodd" d="M9,12.367a8.25,8.25,0,0,0-8.25,8.25C.75,25.173,9,35.57,9,35.57s8.25-10.4,8.25-14.953A8.25,8.25,0,0,0,9,12.367Zm0,11.75a3.5,3.5,0,1,1,3.5-3.5A3.5,3.5,0,0,1,9,24.117Z"></path>`;

const LocationBasedDate = createWorkflowIcon('VueWorkflowLocationBasedDate', svgAttributes, svgInnerHTML);

export default LocationBasedDate;
