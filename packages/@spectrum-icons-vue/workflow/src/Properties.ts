import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.5,6H15.9A5,5,0,0,0,6.1,6H2.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H6.1a5,5,0,0,0,9.8,0H33.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,33.5,6ZM11,10a3,3,0,1,1,3-3A3,3,0,0,1,11,10Z"></path><path fill-rule="evenodd" d="M33.5,26H19.9a5,5,0,0,0-9.8,0H2.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h7.6a5,5,0,0,0,9.8,0H33.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,33.5,26ZM15,30a3,3,0,1,1,3-3A3,3,0,0,1,15,30Z"></path><path fill-rule="evenodd" d="M2,16.5v1a.5.5,0,0,0,.5.5H20.1a5,5,0,0,0,9.8,0h3.6a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H29.9a5,5,0,0,0-9.8,0H2.5A.5.5,0,0,0,2,16.5ZM22,17a3,3,0,1,1,3,3A3,3,0,0,1,22,17Z"></path>`;

const Properties = createWorkflowIcon('VueWorkflowProperties', svgAttributes, svgInnerHTML);

export default Properties;
