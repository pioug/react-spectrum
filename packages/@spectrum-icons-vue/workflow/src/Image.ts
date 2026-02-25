import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33,6H3A1,1,0,0,0,2,7V29a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V7A1,1,0,0,0,33,6ZM32,25.373,26.728,20.1a2,2,0,0,0-2.828,0l-3.072,3.072-7.556-7.557a2,2,0,0,0-2.828,0L4,22.059V8H32Z"></path><circle fill-rule="evenodd" cx="26.7" cy="13.3" r="2.7"></circle>`;

const Image = createWorkflowIcon('VueWorkflowImage', svgAttributes, svgInnerHTML);

export default Image;
