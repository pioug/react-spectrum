import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM20,27a6.929,6.929,0,0,1,1.475-4.252l9.777,9.777A6.966,6.966,0,0,1,20,27Zm12.525,4.252-9.777-9.777a6.966,6.966,0,0,1,9.777,9.777Z"></path><rect fill-rule="evenodd" height="6" rx="2.8" ry="2.8" width="6" y="2"></rect><rect fill-rule="evenodd" height="6" rx="2.8" ry="2.8" width="6" x="6" y="14"></rect><rect fill-rule="evenodd" height="6" rx="2.8" ry="2.8" width="6" x="6" y="26"></rect><rect fill-rule="evenodd" height="4" rx="1" ry="1" width="22" x="8" y="4"></rect><path fill-rule="evenodd" d="M27,16H15a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h3.515A10.975,10.975,0,0,1,27,16Z"></path><path fill-rule="evenodd" d="M16.05,28H15a1,1,0,0,0-1,1v2a1,1,0,0,0,1,1h2.21A10.942,10.942,0,0,1,16.05,28Z"></path>`;

const TextBulletedHierarchyExclude = createWorkflowIcon('VueWorkflowTextBulletedHierarchyExclude', svgAttributes, svgInnerHTML);

export default TextBulletedHierarchyExclude;
