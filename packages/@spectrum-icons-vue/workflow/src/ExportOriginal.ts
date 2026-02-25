import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M12,21V15a1,1,0,0,1,1-1H26V5a1,1,0,0,0-1-1H1A1,1,0,0,0,0,5V31a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V22H13A1,1,0,0,1,12,21Z"></path><path fill-rule="evenodd" d="M28,11.207V16H14.5a.5.5,0,0,0-.5.5v3a.5.5,0,0,0,.5.5H28v4.793a.5.5,0,0,0,.854.353L35.913,18l-7.059-7.146A.5.5,0,0,0,28,11.207Z"></path>`;

const ExportOriginal = createWorkflowIcon('VueWorkflowExportOriginal', svgAttributes, svgInnerHTML);

export default ExportOriginal;
