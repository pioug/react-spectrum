import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="2" width="10" x="20" y="12"></rect><path fill-rule="evenodd" d="M14.75,28H6V8H32v7.769a12.265,12.265,0,0,1,2,1.124V7a1,1,0,0,0-1-1H5A1,1,0,0,0,4,7V27a1,1,0,0,1-2,0V10.5a.5.5,0,0,0-.5-.5H.5a.5.5,0,0,0-.5.5V27a3,3,0,0,0,3,3H15.084A12.259,12.259,0,0,1,14.75,28Z"></path><path fill-rule="evenodd" d="M21.52,16H20v.893A12.225,12.225,0,0,1,21.52,16Z"></path><path fill-rule="evenodd" d="M18,18.635V12H8V22h7.769A12.3,12.3,0,0,1,18,18.635Z"></path><path fill-rule="evenodd" d="M15.084,24H8v2h6.75A12.259,12.259,0,0,1,15.084,24Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm5,9.4a.5.5,0,0,1-.5.5H28v3.5a.5.5,0,0,1-.5.5h-1a.5.5,0,0,1-.5-.5V28H22.5a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H26V22.5a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5V26h3.5a.5.5,0,0,1,.5.5Z"></path>`;

const NewsAdd = createWorkflowIcon('VueWorkflowNewsAdd', svgAttributes, svgInnerHTML);

export default NewsAdd;
