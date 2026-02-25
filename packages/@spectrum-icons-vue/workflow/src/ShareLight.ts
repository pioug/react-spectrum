import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M24.476,7.165,18,0,11.54,7.165A.5.5,0,0,0,11.911,8H16V19.5a.5.5,0,0,0,.5.5h3a.5.5,0,0,0,.5-.5V8h4.105A.5.5,0,0,0,24.476,7.165Z"></path><path fill-rule="evenodd" d="M33,10H26v2h6V32H4V12h6V10H3a1,1,0,0,0-1,1V33a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V11A1,1,0,0,0,33,10Z"></path>`;

const ShareLight = createWorkflowIcon('VueWorkflowShareLight', svgAttributes, svgInnerHTML);

export default ShareLight;
