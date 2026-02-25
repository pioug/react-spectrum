import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24,16.1v17a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1v-17H5.007a.5.5,0,0,1-.353-.854L18,1.9,31.346,15.246a.5.5,0,0,1-.353.854Z"></path>`;

const ArrowUp = createWorkflowIcon('VueWorkflowArrowUp', svgAttributes, svgInnerHTML);

export default ArrowUp;
