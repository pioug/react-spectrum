import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<circle fill-rule="evenodd" cx="14.856" cy="13.5" r="2"></circle><path fill-rule="evenodd" d="M35,4H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H35a1,1,0,0,0,1-1V5A1,1,0,0,0,35,4ZM4,8H20V20.694a8.535,8.535,0,0,0-3.478-1.125c-1.653,0-2.4,2.2-4.052,2.2s-2.936-4.353-4.588-4.353C6.379,17.412,4,21.819,4,21.819ZM32,28H4V26H32Zm0-6H24V20h8Zm0-6H24V14h8Zm0-6H24V8h8Z"></path>`;

const DocumentFragment = createWorkflowIcon('VueWorkflowDocumentFragment', svgAttributes, svgInnerHTML);

export default DocumentFragment;
