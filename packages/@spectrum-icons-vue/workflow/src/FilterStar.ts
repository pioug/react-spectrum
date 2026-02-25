import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M14.8,27A13.146,13.146,0,0,1,18,18.589C20.083,15.895,29.733,3.617,29.733,3.617A1,1,0,0,0,28.946,2H1.054A1,1,0,0,0,.267,3.617L12,18.589V33.9a.992.992,0,0,0,1.68.825l2.338-2.439A12.131,12.131,0,0,1,14.8,27Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1Zm6.874,7.083-3.789,3.037L31.366,32.9a.2.2,0,0,1-.306.222L27,30.461l-4.059,2.665a.2.2,0,0,1-.306-.222l1.281-4.684-3.789-3.037a.2.2,0,0,1,.117-.36l4.85-.23,1.718-4.542a.2.2,0,0,1,.378,0l1.718,4.542,4.85.23A.2.2,0,0,1,33.874,25.183Z"></path>`;

const FilterStar = createWorkflowIcon('VueWorkflowFilterStar', svgAttributes, svgInnerHTML);

export default FilterStar;
