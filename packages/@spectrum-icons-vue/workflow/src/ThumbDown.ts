import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="18" rx="1" ry="1" width="6" x="2" y="6"></rect><path fill-rule="evenodd" d="M31.077,21.89H21.11A63.859,63.859,0,0,1,22,31.08C22,32.741,20.968,34,20,34a1.839,1.839,0,0,1-2-2,11.326,11.326,0,0,0-2.516-6.258A46.35,46.35,0,0,0,10,20.958V6s2.809.033,14,0a3.946,3.946,0,0,1,3.677,2.424l5.128,10.788A1.862,1.862,0,0,1,31.077,21.89Z"></path>`;

const ThumbDown = createWorkflowIcon('VueWorkflowThumbDown', svgAttributes, svgInnerHTML);

export default ThumbDown;
