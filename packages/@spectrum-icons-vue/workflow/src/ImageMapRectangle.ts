import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.5,10a.5.5,0,0,0,.5-.5v-7a.5.5,0,0,0-.5-.5h-7a.5.5,0,0,0-.5.5V4H10V2.5A.5.5,0,0,0,9.5,2h-7a.5.5,0,0,0-.5.5v7a.5.5,0,0,0,.5.5H4V26H2.5a.5.5,0,0,0-.5.5v7a.5.5,0,0,0,.5.5h7a.5.5,0,0,0,.5-.5V32H26v1.5a.5.5,0,0,0,.5.5h7a.5.5,0,0,0,.5-.5v-7a.5.5,0,0,0-.5-.5H32V10ZM4,4H8V8H4ZM8,32H4V28H8Zm18-5.5V30H10V26.5a.5.5,0,0,0-.5-.5H6V10H9.5a.5.5,0,0,0,.5-.5V6H26V9.5a.5.5,0,0,0,.5.5H30V26H26.5A.5.5,0,0,0,26,26.5ZM32,32H28V28h4ZM28,8V4h4V8Z"></path>`;

const ImageMapRectangle = createWorkflowIcon('VueWorkflowImageMapRectangle', svgAttributes, svgInnerHTML);

export default ImageMapRectangle;
