import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M6,4A4,4,0,0,0,2,8V22a4,4,0,0,0,4,4H8v8.793a.5.5,0,0,0,.854.353L18,26H30a4,4,0,0,0,4-4V8a4,4,0,0,0-4-4Z"></path>`;

const Comment = createWorkflowIcon('VueWorkflowComment', svgAttributes, svgInnerHTML);

export default Comment;
