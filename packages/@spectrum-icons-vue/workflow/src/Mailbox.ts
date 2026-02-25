import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M5,8a5,5,0,0,0-5,5V29a1,1,0,0,0,1,1H12V13A5,5,0,0,0,7,8Z"></path><path fill-rule="evenodd" d="M31,8H18v7a1,1,0,0,1-1,1H14V30H35a1,1,0,0,0,1-1V13A5,5,0,0,0,31,8Z"></path><path fill-rule="evenodd" d="M21,0H15a1,1,0,0,0-1,1V14h2V6h5a1,1,0,0,0,1-1V1A1,1,0,0,0,21,0Z"></path>`;

const Mailbox = createWorkflowIcon('VueWorkflowMailbox', svgAttributes, svgInnerHTML);

export default Mailbox;
