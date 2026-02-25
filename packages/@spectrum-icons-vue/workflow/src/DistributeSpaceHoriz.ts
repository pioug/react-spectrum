import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<rect fill-rule="evenodd" height="24" rx="1" ry="1" width="10" x="4" y="10"></rect><rect fill-rule="evenodd" height="16" rx="1" ry="1" width="12" x="20" y="12"></rect><path fill-rule="evenodd" d="M20,7.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V4h3.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H22V.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V2H14V.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V2H8.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H12V7.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V4h6Z" transform="translate(0 0)"></path>`;

const DistributeSpaceHoriz = createWorkflowIcon('VueWorkflowDistributeSpaceHoriz', svgAttributes, svgInnerHTML);

export default DistributeSpaceHoriz;
