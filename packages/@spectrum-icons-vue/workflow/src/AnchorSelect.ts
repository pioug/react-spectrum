import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M10,6,28,24H18l-8,8ZM8.5,2.054a.5.5,0,0,0-.5.5v32.78a.5.5,0,0,0,.5.5.49.49,0,0,0,.35-.147L18.524,26h13a.5.5,0,0,0,.354-.854L8.854,2.2A.49.49,0,0,0,8.5,2.054Z"></path>`;

const AnchorSelect = createWorkflowIcon('VueWorkflowAnchorSelect', svgAttributes, svgInnerHTML);

export default AnchorSelect;
