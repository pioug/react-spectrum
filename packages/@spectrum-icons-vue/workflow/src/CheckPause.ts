import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M23.1,15.343l6.391-8.215a1,1,0,0,0-.175-1.4L27.857,4.592a1,1,0,0,0-1.4.175L12.822,22.283,6.175,15.671a1,1,0,0,0-1.414,0L3.437,17a1,1,0,0,0,0,1.415l8.926,8.9a1,1,0,0,0,1.5-.093l.888-1.142A12.294,12.294,0,0,1,23.1,15.343Z"></path><path fill-rule="evenodd" d="M27,18.1A8.9,8.9,0,1,0,35.9,27,8.9,8.9,0,0,0,27,18.1ZM26,31.574H23.368V22.426H26Zm4.632,0H28V22.426h2.632Z"></path>`;

const CheckPause = createWorkflowIcon('VueWorkflowCheckPause', svgAttributes, svgInnerHTML);

export default CheckPause;
