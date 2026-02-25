import {createWorkflowIcon} from './createIcon';

const svgAttributes = {
  "viewBox": "0 0 36 36"
};
const svgInnerHTML = `<path fill-rule="evenodd" d="M35,10H30V3a1,1,0,0,0-1-1H7A1,1,0,0,0,6,3v7H1a1,1,0,0,0-1,1V25a1,1,0,0,0,1,1H4v7a1,1,0,0,0,1,1H31a1,1,0,0,0,1-1V26h3a1,1,0,0,0,1-1V11A1,1,0,0,0,35,10ZM8,4H28v6H8ZM30,32H6V20H30Z" transform="translate(0)"></path><rect fill-rule="evenodd" height="2" width="16" x="10" y="26"></rect><rect fill-rule="evenodd" height="2" width="16" x="10" y="22"></rect>`;

const Print = createWorkflowIcon('VueWorkflowPrint', svgAttributes, svgInnerHTML);

export default Print;
