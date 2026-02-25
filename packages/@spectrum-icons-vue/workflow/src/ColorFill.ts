import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M33.727,23.672a64.346,64.346,0,0,0-1.306-6.632c-.624-2.436-2.919-2.98-5.34-3.308L18.974,5.625a1,1,0,0,0-1.415,0L15.135,8.055l4.872,4.872a1.5,1.5,0,1,1-2.121,2.121l-4.872-4.872L1.856,21.334a1,1,0,0,0,0,1.415L12.609,33.488a1,1,0,0,0,1.414,0L29.594,17.894a1,1,0,0,0,.015-1.4.38.38,0,0,1,.566.149c.5.938.69,2.8-.528,5.574-.377.86-1.388,2.148-1.388,3.256a2.516,2.516,0,0,0,2.779,2.8C32.68,28.274,34.033,26.733,33.727,23.672Z"></path><path fill-rule="evenodd" d="M15.131,8.05,9.4,2.317A1.5,1.5,0,0,0,7.276,4.438l5.733,5.733Z"></path>`;

const ColorFill = createWorkflowIcon('VueWorkflowColorFill', svgAttributes, svgInnerHTML);

export default ColorFill;
