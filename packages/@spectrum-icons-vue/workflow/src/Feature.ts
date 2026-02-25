import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M18,2.2A15.8,15.8,0,1,0,33.8,18,15.8,15.8,0,0,0,18,2.2ZM30.2,14.774l-6.726,5.392,2.274,8.308a.355.355,0,0,1-.237.443.351.351,0,0,1-.306-.049L18,24.144l-7.206,4.731a.355.355,0,0,1-.543-.394l2.274-8.315L5.8,14.774a.355.355,0,0,1,.208-.639l8.61-.408,3.05-8.063a.355.355,0,0,1,.671,0l3.05,8.063,8.61.408a.355.355,0,0,1,.348.362A.351.351,0,0,1,30.2,14.774Z"></path>`;

const Feature = createWorkflowIcon('VueWorkflowFeature', svgAttributes, svgInnerHTML);

export default Feature;
