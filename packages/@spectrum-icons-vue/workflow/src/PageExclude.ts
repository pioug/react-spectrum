import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M15.059,30H2V10H30v5.184a12.273,12.273,0,0,1,2,.685V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H15.721A12.177,12.177,0,0,1,15.059,30Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.934,6.934,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path>`;

const PageExclude = createWorkflowIcon('VueWorkflowPageExclude', svgAttributes, svgInnerHTML);

export default PageExclude;
