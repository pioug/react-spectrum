import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="6" width="2" x="4" y="18"></rect><path fill-rule="evenodd" d="M6,30V28H4v3.111A.889.889,0,0,0,4.889,32H8V30Z"></path><rect fill-rule="evenodd" height="2" width="6" x="12" y="30"></rect><rect fill-rule="evenodd" height="6" width="2" x="30" y="12"></rect><path fill-rule="evenodd" d="M31.111,4H28V6h2V8h2V4.889A.889.889,0,0,0,31.111,4Z"></path><rect fill-rule="evenodd" height="2" width="6" x="18" y="4"></rect><rect fill-rule="evenodd" height="43.854" rx="0.818" ry="0.818" transform="translate(-7.456 18) rotate(-45)" width="2.455" x="16.773" y="-3.927"></rect><polygon fill-rule="evenodd" points="32 27.437 32 22 30 22 30 25.437 32 27.437"></polygon><polygon fill-rule="evenodd" points="25.436 30 22 30 22 32 27.436 32 25.436 30"></polygon><polygon fill-rule="evenodd" points="4 8.563 4 14 6 14 6 10.563 4 8.563"></polygon><polygon fill-rule="evenodd" points="10.562 6 14 6 14 4 8.562 4 10.562 6"></polygon>`;

const Deselect = createWorkflowIcon('VueWorkflowDeselect', svgAttributes, svgInnerHTML);

export default Deselect;
