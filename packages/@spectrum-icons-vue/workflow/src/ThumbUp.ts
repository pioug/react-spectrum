import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="18" rx="1" ry="1" width="6" x="2" y="14"></rect><path fill-rule="evenodd" d="M30.967,14H21a54.94,54.94,0,0,0,1-9.08C22,3.259,20.968,2,20,2a1.839,1.839,0,0,0-2,2,11.326,11.326,0,0,1-2.516,6.258A46.35,46.35,0,0,1,10,15.042V30s2.809-.033,14,0a3.946,3.946,0,0,0,3.677-2.424l5.128-10.788A2,2,0,0,0,30.967,14Z"></path>`;

const ThumbUp = createWorkflowIcon('VueWorkflowThumbUp', svgAttributes, svgInnerHTML);

export default ThumbUp;
