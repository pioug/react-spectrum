import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="18" cy="18" r="7.9"></circle><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" width="3.6" x="16.2"></rect><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" width="3.6" x="16.2" y="30"></rect><rect fill-rule="evenodd" height="3.6" rx="0.5" ry="0.5" width="6" y="16.2"></rect><rect fill-rule="evenodd" height="3.6" rx="0.5" ry="0.5" width="6" x="30" y="16.2"></rect><rect fill-rule="evenodd" height="3.6" rx="0.5" ry="0.5" transform="translate(3.536 22.576) rotate(-45)" width="6" x="26.02" y="5.22"></rect><rect fill-rule="evenodd" height="3.6" rx="0.5" ry="0.5" transform="translate(-18.464 13.464) rotate(-45)" width="6" x="4.02" y="27.22"></rect><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" transform="translate(-2.9 7) rotate(-45)" width="3.6" x="5.2" y="4"></rect><rect fill-rule="evenodd" height="6" rx="0.5" ry="0.5" transform="translate(-12.004 28.98) rotate(-45)" width="3.6" x="27.18" y="25.98"></rect>`;

const Light = createWorkflowIcon('VueWorkflowLight', svgAttributes, svgInnerHTML);

export default Light;
