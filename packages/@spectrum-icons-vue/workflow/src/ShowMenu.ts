import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="6"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="28" x="4" y="26"></rect>`;

const ShowMenu = createWorkflowIcon('VueWorkflowShowMenu', svgAttributes, svgInnerHTML);

export default ShowMenu;
