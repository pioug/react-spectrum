import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M2,3.281V34.557a1,1,0,0,0,1.351.936l30-11.25A1,1,0,0,0,34,23.307V10.781a1,1,0,0,0-.757-.97l-30-7.5A1,1,0,0,0,2,3.281ZM32,16.117l-6,.4v-6.5l6,1.446ZM16,17.19V7.613l8,1.929v7.112Zm8,1.356v7.126L16,28.61V19.191ZM14,7.131V17.324L4,18V4.72ZM4,20.16l10-.807v9.992L4,33.017Zm22,4.778V18.384l6-.484v4.834Z"></path>`;

const Perspective = createWorkflowIcon('VueWorkflowPerspective', svgAttributes, svgInnerHTML);

export default Perspective;
