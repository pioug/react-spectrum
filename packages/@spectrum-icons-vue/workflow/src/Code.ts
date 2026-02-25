import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35.493,19.061,27.3,27.381a1,1,0,0,1-1.425,0l-.893-.907a1.006,1.006,0,0,1,0-1.4L31.943,18l-6.959-7.071a1.006,1.006,0,0,1,0-1.4l.893-.907a1,1,0,0,1,1.425,0l8.191,8.32A1.523,1.523,0,0,1,35.493,19.061Z"></path><path fill-rule="evenodd" d="M.507,16.939,8.7,8.619a1,1,0,0,1,1.425,0l.893.907a1.006,1.006,0,0,1,0,1.4L4.057,18l6.959,7.071a1.006,1.006,0,0,1,0,1.4l-.893.907a1,1,0,0,1-1.425,0L.507,19.061A1.523,1.523,0,0,1,.507,16.939Z"></path><path fill-rule="evenodd" d="M15.489,29.687H14.345a1,1,0,0,1-.966-1.259L19.571,5.387a1,1,0,0,1,.966-.741h1.105A1,1,0,0,1,22.608,5.9L16.455,28.946A1,1,0,0,1,15.489,29.687Z"></path>`;

const Code = createWorkflowIcon('VueWorkflowCode', svgAttributes, svgInnerHTML);

export default Code;
