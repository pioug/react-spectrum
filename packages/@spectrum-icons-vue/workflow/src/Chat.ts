import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M19,14a1,1,0,0,1,1,1V27a1,1,0,0,1-1,1H9.586a1,1,0,0,0-.707.293L6,31.171V29a1,1,0,0,0-1-1H3a1,1,0,0,1-1-1V15a1,1,0,0,1,1-1ZM3,12a3,3,0,0,0-3,3V27a3,3,0,0,0,3,3H4v4.793a.5.5,0,0,0,.854.353L10,30h9a3,3,0,0,0,3-3V15a3,3,0,0,0-3-3Z" transform="translate(0)"></path><path fill-rule="evenodd" d="M24,14.6A4.6,4.6,0,0,0,19.4,10H12V5a3,3,0,0,1,3-3H33a3,3,0,0,1,3,3V17a3,3,0,0,1-3,3H30v4.793a.5.5,0,0,1-.854.353L24,20Z" transform="translate(0)"></path>`;

const Chat = createWorkflowIcon('VueWorkflowChat', svgAttributes, svgInnerHTML);

export default Chat;
