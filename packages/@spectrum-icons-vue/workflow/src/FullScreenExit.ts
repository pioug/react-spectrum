import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,2.5V8H.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H8V2.5A.5.5,0,0,0,7.5,2h-1A.5.5,0,0,0,6,2.5Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M30,8V2.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V10h7.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M0,26.5v1a.5.5,0,0,0,.5.5H6v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V26H.5A.5.5,0,0,0,0,26.5Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M30,28h5.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H28v7.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5Z" transform="translate(0)"></path><rect fill-rule="evenodd" height="16" rx="0.5" ry="0.5" width="20" x="8" y="10"></rect>`;

const FullScreenExit = createWorkflowIcon('VueWorkflowFullScreenExit', svgAttributes, svgInnerHTML);

export default FullScreenExit;
