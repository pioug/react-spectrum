import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M26,8H10a10,10,0,0,0,0,20H26A10,10,0,0,0,26,8Zm0,18.1H10A8.1,8.1,0,0,1,10,9.9H26a8.1,8.1,0,0,1,0,16.2Z"></path><path fill-rule="evenodd" d="M26,12.1H10a5.9,5.9,0,0,0,0,11.8H26a5.9,5.9,0,0,0,0-11.8Z"></path>`;

const Button = createWorkflowIcon('VueWorkflowButton', svgAttributes, svgInnerHTML);

export default Button;
