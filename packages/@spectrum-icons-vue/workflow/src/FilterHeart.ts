import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.8,27A13.146,13.146,0,0,1,18,18.589C20.083,15.895,29.733,3.617,29.733,3.617A1,1,0,0,0,28.946,2H1.054A1,1,0,0,0,.267,3.617L12,18.589V33.9a.992.992,0,0,0,1.68.825l2.338-2.439A12.131,12.131,0,0,1,14.8,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM27,34s-7-5.4-7-8.273a3.818,3.818,0,0,1,3.818-3.818A4.006,4.006,0,0,1,27,23.818a4.006,4.006,0,0,1,3.182-1.909A3.818,3.818,0,0,1,34,25.727C34,28.6,27,34,27,34Z"></path>`;

const FilterHeart = createWorkflowIcon('VueWorkflowFilterHeart', svgAttributes, svgInnerHTML);

export default FilterHeart;
