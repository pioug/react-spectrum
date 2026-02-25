import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 2 20 12 30 12 20 2"></polygon><path fill-rule="evenodd" d="M19,14a1,1,0,0,1-1-1V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V14ZM10.792,30.959A.727.727,0,0,1,10,30.236V29.9a.65.65,0,0,1,.457-.672c1.424-.25,3.136-1.268,3.136-2.631a4.332,4.332,0,1,1,5.069-4.268A8.336,8.336,0,0,1,10.792,30.959Z"></path>`;

const FileCSV = createWorkflowIcon('VueWorkflowFileCSV', svgAttributes, svgInnerHTML);

export default FileCSV;
