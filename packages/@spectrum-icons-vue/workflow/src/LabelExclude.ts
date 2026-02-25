import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.7,27.1A12.3,12.3,0,0,1,31.754,15.755L18.293,2.293A1,1,0,0,0,17.586,2H3A1,1,0,0,0,2,3V17.586a1,1,0,0,0,.293.707L15.539,31.539A12.25,12.25,0,0,1,14.7,27.1ZM8,10.6A2.6,2.6,0,1,1,10.6,8,2.6,2.6,0,0,1,8,10.6Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.934,6.934,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path>`;

const LabelExclude = createWorkflowIcon('VueWorkflowLabelExclude', svgAttributes, svgInnerHTML);

export default LabelExclude;
