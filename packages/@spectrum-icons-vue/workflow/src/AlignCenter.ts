import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M29,20H18V16h7a1,1,0,0,0,1-1V7a1,1,0,0,0-1-1H18V.5a.5.5,0,0,0-.5-.5h-1a.5.5,0,0,0-.5.5V6H9A1,1,0,0,0,8,7v8a1,1,0,0,0,1,1h7v4H5a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H16v5.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V30H29a1,1,0,0,0,1-1V21A1,1,0,0,0,29,20Z"></path>`;

const AlignCenter = createWorkflowIcon('VueWorkflowAlignCenter', svgAttributes, svgInnerHTML);

export default AlignCenter;
