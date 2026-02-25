import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.8,27A13.146,13.146,0,0,1,18,18.589C20.083,15.895,29.733,3.617,29.733,3.617A1,1,0,0,0,28.946,2H1.054A1,1,0,0,0,.267,3.617L12,18.589V33.9a.992.992,0,0,0,1.68.825l2.338-2.439A12.131,12.131,0,0,1,14.8,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM24.662,32.412l-4.128-4.127a.5.5,0,0,1,0-.707l1.036-1.036a.5.5,0,0,1,.707,0l2.731,2.731,6.106-6.106a.5.5,0,0,1,.707,0l1.043,1.043a.5.5,0,0,1,0,.707l-7.5,7.5A.5.5,0,0,1,24.662,32.412Z"></path>`;

const FilterCheck = createWorkflowIcon('VueWorkflowFilterCheck', svgAttributes, svgInnerHTML);

export default FilterCheck;
