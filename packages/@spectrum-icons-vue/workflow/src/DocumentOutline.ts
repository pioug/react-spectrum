import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20.735,2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V11.265a2,2,0,0,0-.586-1.414L22.149,2.586A2,2,0,0,0,20.735,2ZM28,32H8V4H20.121v6.879a1,1,0,0,0,1,1H28ZM22,10V5.266L26.734,10Z"></path>`;

const DocumentOutline = createWorkflowIcon('VueWorkflowDocumentOutline', svgAttributes, svgInnerHTML);

export default DocumentOutline;
