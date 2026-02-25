import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M7.939,8.1a3.9,3.9,0,1,0-3.9-3.9A3.9,3.9,0,0,0,7.939,8.1Z"></path><path fill-rule="evenodd" d="M17.939,8.1a3.9,3.9,0,1,0-3.9-3.9A3.9,3.9,0,0,0,17.939,8.1Z"></path><path fill-rule="evenodd" d="M27.939,8.1a3.9,3.9,0,1,0-3.9-3.9A3.9,3.9,0,0,0,27.939,8.1Z"></path><path fill-rule="evenodd" d="M28.139,10h-.4a6.136,6.136,0,0,0-4.8,1.863A6.139,6.139,0,0,0,18.139,10h-.4a6.136,6.136,0,0,0-4.8,1.863A6.139,6.139,0,0,0,8.139,10h-.4c-3.2,0-5.8,1.6-5.8,4.8V22a1,1,0,0,0,1,1h1l1,10a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1l1-10h2l1,10a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1l1-10h2l1,10a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1l1-10h1a1,1,0,0,0,1-1V14.8C33.939,11.6,31.342,10,28.139,10Z"></path>`;

const Demographic = createWorkflowIcon('VueWorkflowDemographic', svgAttributes, svgInnerHTML);

export default Demographic;
