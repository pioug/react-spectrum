import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,4H7A1,1,0,0,0,6,5v9H30V5A1,1,0,0,0,29,4ZM6,31a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V22H6Z"></path><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="32" x="2" y="16"></rect>`;

const Separator = createWorkflowIcon('VueWorkflowSeparator', svgAttributes, svgInnerHTML);

export default Separator;
