import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M30.946,2H3.054a1,1,0,0,0-.787,1.617L14,18.589V33.9a.992.992,0,0,0,1.68.824l3.981-4.153A1.219,1.219,0,0,0,20,29.728V18.589L31.733,3.617A1,1,0,0,0,30.946,2Z"></path>`;

const Filter = createWorkflowIcon('VueWorkflowFilter', svgAttributes, svgInnerHTML);

export default Filter;
