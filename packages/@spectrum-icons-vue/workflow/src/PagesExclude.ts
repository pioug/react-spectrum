import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,6H28V3a1,1,0,0,0-1-1H1A1,1,0,0,0,0,3V27a1,1,0,0,0,1,1H2Z"></path><path fill-rule="evenodd" d="M15.721,32H6V14H30v1.184a12.273,12.273,0,0,1,2,.685V9a1,1,0,0,0-1-1H5A1,1,0,0,0,4,9V33a1,1,0,0,0,1,1H16.818A12.266,12.266,0,0,1,15.721,32Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.934,6.934,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path>`;

const PagesExclude = createWorkflowIcon('VueWorkflowPagesExclude', svgAttributes, svgInnerHTML);

export default PagesExclude;
