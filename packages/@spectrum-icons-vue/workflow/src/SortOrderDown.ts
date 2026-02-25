import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="4" rx="1" ry="1" width="12" x="2" y="24"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="16" x="2" y="16"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="20" x="2" y="8"></rect><path fill-rule="evenodd" d="M32,24H29.993V9a.988.988,0,0,0-.987-1h-.992a1,1,0,0,0-1,1l-.007,15H25a.5.5,0,0,0-.5.5.49.49,0,0,0,.147.35l3.537,4.033a.5.5,0,0,0,.632,0l3.537-4.033a.49.49,0,0,0,.147-.35A.5.5,0,0,0,32,24Z"></path>`;

const SortOrderDown = createWorkflowIcon('VueWorkflowSortOrderDown', svgAttributes, svgInnerHTML);

export default SortOrderDown;
