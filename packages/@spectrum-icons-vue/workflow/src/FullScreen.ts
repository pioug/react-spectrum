import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M32,24.5V30H26.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H34V24.5a.5.5,0,0,0-.5-.5h-1A.5.5,0,0,0,32,24.5Z"></path><path fill-rule="evenodd" d="M4,30V24.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V32H9.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5Z"></path><path fill-rule="evenodd" d="M26,4.5v1a.5.5,0,0,0,.5.5H32v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V4H26.5A.5.5,0,0,0,26,4.5Z"></path><path fill-rule="evenodd" d="M4,6H9.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,9.5,4H2v7.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5Z"></path><rect fill-rule="evenodd" height="16" rx="0.5" ry="0.5" width="20" x="8" y="10"></rect>`;

const FullScreen = createWorkflowIcon('VueWorkflowFullScreen', svgAttributes, svgInnerHTML);

export default FullScreen;
