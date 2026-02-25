import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,2H3A1,1,0,0,0,2,3V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V3A1,1,0,0,0,33,2ZM27.606,15.707,18,25.314,8.394,15.707A1,1,0,0,1,9.1,14H26.9A1,1,0,0,1,27.606,15.707Z"></path>`;

const Menu = createWorkflowIcon('VueWorkflowMenu', svgAttributes, svgInnerHTML);

export default Menu;
