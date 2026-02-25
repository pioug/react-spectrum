import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M20,11V2H7A1,1,0,0,0,6,3V33a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V12H21A1,1,0,0,1,20,11Z"></path><path fill-rule="evenodd" d="M22,2h.086a1,1,0,0,1,.707.293l6.914,6.914A1,1,0,0,1,30,9.914V10H22Z"></path>`;

const Document = createWorkflowIcon('VueWorkflowDocument', svgAttributes, svgInnerHTML);

export default Document;
