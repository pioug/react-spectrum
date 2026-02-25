import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14Zm.488,16.525s-1.389-2.771-1.842-3.688c-.4.923-1,2.22-1.363,3.014l-.311.675H12l3.621-6.333L12.127,18h3.98l.389.808c.393.816.883,1.831,1.27,2.68.361-.885.748-1.715,1.154-2.582L19.34,18h3.977l-3.535,6.124,3.709,6.4Z"></path>`;

const FileExcel = createWorkflowIcon('VueWorkflowFileExcel', svgAttributes, svgInnerHTML);

export default FileExcel;
