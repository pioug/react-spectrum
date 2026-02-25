import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M25.458,6h0Z"></path><path fill-rule="evenodd" d="M32.554,19.7,28.57,8.424A4.636,4.636,0,0,0,24.444,6C22.447,6,10,6,10,6A1,1,0,0,0,9,5H3A1,1,0,0,0,2,6V22a1,1,0,0,0,1,1H9a1,1,0,0,0,1-1v-.476c2.545,1.174,7.177,4.83,7.64,9.312A3.327,3.327,0,0,0,20.921,34c1.626,0,3.1-1.814,3.173-3.937a21.477,21.477,0,0,0-.8-6.081l6.55.01A3,3,0,0,0,32.554,19.7ZM29.847,22h-9.5a15.051,15.051,0,0,1,1.746,8.063c-.052,1.2-.563,1.932-1.173,1.937a1.374,1.374,0,0,1-1.281-1.2c-.49-5.873-6.773-10.245-9.64-11.4V8L24.99,7.98a1.842,1.842,0,0,1,1.742,1.232l4.017,11.356A1,1,0,0,1,29.847,22Z"></path>`;

const ThumbDownOutline = createWorkflowIcon('VueWorkflowThumbDownOutline', svgAttributes, svgInnerHTML);

export default ThumbDownOutline;
