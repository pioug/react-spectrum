import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,8H5A1,1,0,0,0,4,9V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V9A1,1,0,0,0,35,8ZM8,12H22v8.875a8.532,8.532,0,0,0-3.478-1.125c-1.653,0-2.4,2.2-4.052,2.2s-1.7-3.765-3.351-3.765C9.617,18.181,8,22,8,22ZM32,28H8V26H32Zm0-8H26V18h6Zm0-6H26V12h6Z"></path><path fill-rule="evenodd" d="M2,7A1,1,0,0,1,3,6H32V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5V27a1,1,0,0,0,1,1H2Z"></path><circle fill-rule="evenodd" cx="18" cy="16" r="2"></circle>`;

const DocumentFragmentGroup = createWorkflowIcon('VueWorkflowDocumentFragmentGroup', svgAttributes, svgInnerHTML);

export default DocumentFragmentGroup;
