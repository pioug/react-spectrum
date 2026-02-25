import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="2" y="2"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="14" y="2"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="26" y="2"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="2" y="14"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="14" y="14"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="26" y="14"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="2" y="26"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="14" y="26"></rect><rect fill-rule="evenodd" height="6" rx="1" ry="1" width="6" x="26" y="26"></rect>`;

const Apps = createWorkflowIcon('VueWorkflowApps', svgAttributes, svgInnerHTML);

export default Apps;
