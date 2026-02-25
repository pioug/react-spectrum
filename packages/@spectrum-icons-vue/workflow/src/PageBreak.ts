import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<polygon fill-rule="evenodd" points="20 14 20 24 30 24 20 14"></polygon><path fill-rule="evenodd" d="M6,11a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1V2H6Z"></path><path fill-rule="evenodd" d="M19,26a1,1,0,0,1-1-1V14H7a1,1,0,0,0-1,1V34H30V26Z"></path>`;

const PageBreak = createWorkflowIcon('VueWorkflowPageBreak', svgAttributes, svgInnerHTML);

export default PageBreak;
